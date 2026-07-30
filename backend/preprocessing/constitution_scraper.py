#!/usr/bin/env python3
"""
Constitution of India (Indian Kanoon "Article N in Constitution of India"
style PDFs) -> JSON scraper.

These PDFs (as exported from indiankanoon.org) have a very different shape
from bare statute PDFs:

    Article 12 in Constitution of India      <- repeated page header
    12. Definition                            <- article number + title
    In this part, ... the plain article text ...
    Editorial Comment - <long discussion, case law, etc.>
    References
    Indiankanoon
    ConstitutionofIndia.net
    ...
    Article 12 in Constitution of India       <- repeated page footer
    Indian Kanoon - http://indiankanoon.org/doc/134365814/ 1  <- repeated
                                                                  page footer

This script strips the repeated header/footer noise, separates the actual
constitutional text from the editorial commentary and reference list, and
pulls out cross-references to other Articles, amendment mentions, and
case-law citations mentioned in the commentary -- so nothing in the PDF
gets thrown away, it's just organised into fields.

USAGE
-----
    python3 constitution_scraper.py <input_dir> <output_dir>

    # write one combined JSON array instead of one file per article:
    python3 constitution_scraper.py <input_dir> <output_dir> --combined

Every PDF in <input_dir> (recursively) is processed; one JSON file per PDF
is written to <output_dir> (unless --combined is given).
"""

import os
import re
import sys
import json
import glob
import argparse

# --------------------------------------------------------------------------
# PDF TEXT EXTRACTION
# --------------------------------------------------------------------------

def extract_text_from_pdf(pdf_path: str) -> str:
    import pdfplumber
    pages = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            pages.append(page.extract_text() or "")
    return "\n".join(pages)


# --------------------------------------------------------------------------
# STATIC PART TABLE (Constitution of India, as currently amended)
# --------------------------------------------------------------------------
# (start_num, end_num, part_number, part_title) using the *numeric* lead of
# the article number (so "31A" is matched on 31, "243ZH" on 243, etc.)
# Special lettered sub-ranges (51A, the 243-series, 323A/B) are handled
# explicitly in `resolve_part()` before falling back to this numeric table.

PART_TABLE = [
    (1, 4, "Part I", "The Union and its Territory"),
    (5, 11, "Part II", "Citizenship"),
    (12, 35, "Part III", "Fundamental Rights"),
    (36, 51, "Part IV", "Directive Principles of State Policy"),
    (52, 78, "Part V", "The Union"),
    (79, 122, "Part V", "The Union"),
    (123, 151, "Part V", "The Union"),
    (152, 237, "Part VI", "The States"),
    (238, 238, "Part VII", "The States in Part B of the First Schedule (Repealed)"),
    (239, 242, "Part VIII", "The Union Territories"),
    (243, 243, "Part IX", "The Panchayats"),
    (244, 244, "Part X", "The Scheduled and Tribal Areas"),
    (245, 263, "Part XI", "Relations between the Union and the States"),
    (264, 300, "Part XII", "Finance, Property, Contracts and Suits"),
    (301, 307, "Part XIII", "Trade, Commerce and Intercourse within India"),
    (308, 323, "Part XIV", "Services under the Union and the States"),
    (324, 329, "Part XV", "Elections"),
    (330, 342, "Part XVI", "Special Provisions Relating to Certain Classes"),
    (343, 351, "Part XVII", "Official Language"),
    (352, 360, "Part XVIII", "Emergency Provisions"),
    (361, 367, "Part XIX", "Miscellaneous"),
    (368, 368, "Part XX", "Amendment of the Constitution"),
    (369, 392, "Part XXI", "Temporary, Transitional and Special Provisions"),
    (393, 395, "Part XXII", "Short title, commencement, authoritative text in Hindi and repeals"),
]


def resolve_part(article_number: str):
    """Return (part_number, part_title) for a given article number string."""
    if not article_number:
        return None, None
    num_match = re.match(r"(\d+)([A-Z]*)", article_number)
    if not num_match:
        return None, None
    num = int(num_match.group(1))
    suffix = num_match.group(2)

    # -- special lettered insertions --
    if article_number.upper() == "51A":
        return "Part IVA", "Fundamental Duties"
    if num == 243 and suffix:
        # 243A..243O -> Part IX ; 243P..243ZG -> Part IXA ; 243ZH..243ZT -> Part IXB
        letter = suffix[0]
        if letter <= "O":
            return "Part IX", "The Panchayats"
        elif letter == "Z" and len(suffix) > 1 and suffix[1] >= "H":
            return "Part IXB", "The Co-operative Societies"
        else:
            return "Part IXA", "The Municipalities"
    if article_number.upper() in ("323A", "323B"):
        return "Part XIVA", "Tribunals"
    if article_number.upper() in ("371A", "371B", "371C", "371D", "371E", "371F",
                                   "371G", "371H", "371I", "371J"):
        return "Part XXI", "Temporary, Transitional and Special Provisions"

    for start, end, part_number, part_title in PART_TABLE:
        if start <= num <= end:
            return part_number, part_title
    return None, None


# --------------------------------------------------------------------------
# NOISE CLEANUP (repeated Indian Kanoon page headers/footers)
# --------------------------------------------------------------------------

TITLE_HEADER_RE = re.compile(r"Article\s+(\d+[A-Z]*)\s+in\s+Constitution\s+of\s+India", re.I)
KANOON_FOOTER_RE = re.compile(r"Indian\s+Kanoon\s*-\s*https?://indiankanoon\.org/doc/\d+/\s*\d*", re.I)
DOC_URL_RE = re.compile(r"https?://indiankanoon\.org/doc/\d+/")


def clean_text(raw_text: str):
    """Strip repeated page header/footer lines; return (clean_text, article_number_from_title, source_url)."""
    header_match = TITLE_HEADER_RE.search(raw_text)
    article_number_from_title = header_match.group(1) if header_match else None

    url_match = DOC_URL_RE.search(raw_text)
    source_url = url_match.group(0) if url_match else None

    cleaned = TITLE_HEADER_RE.sub("\n", raw_text)
    cleaned = KANOON_FOOTER_RE.sub("\n", cleaned)
    cleaned = re.sub(r"[ \t]+", " ", cleaned)
    cleaned = re.sub(r"\n\s*\n+", "\n", cleaned)
    cleaned = cleaned.strip()
    return cleaned, article_number_from_title, source_url


# --------------------------------------------------------------------------
# SECTION SPLITTING: heading / main text / commentary / references
# --------------------------------------------------------------------------

HEADING_RE = re.compile(r"^\s*(\d+[A-Z]*)\.\s*(.+)$", re.M)
EDITORIAL_RE = re.compile(r"Editorial\s+Comment\s*[-:]?\s*", re.I)
REFERENCES_RE = re.compile(r"\n\s*References\s*\n", re.I)


def split_article(cleaned_text: str):
    """
    Returns dict with: article_number, article_title, main_text,
    commentary, references (list[str]).
    """
    lines = [l for l in cleaned_text.splitlines() if l.strip()]
    article_number, article_title = None, None
    body_start_idx = 0

    if lines:
        m = HEADING_RE.match(lines[0])
        if m:
            article_number, article_title = m.group(1), m.group(2).strip()
            body_start_idx = 1

    rest = "\n".join(lines[body_start_idx:])

    references = []
    ref_split = REFERENCES_RE.split(rest, maxsplit=1)
    if len(ref_split) == 2:
        rest, ref_block = ref_split
        references = [r.strip() for r in ref_block.splitlines() if r.strip()]

    ed_split = EDITORIAL_RE.split(rest, maxsplit=1)
    if len(ed_split) == 2:
        main_text, commentary = ed_split
    else:
        main_text, commentary = rest, ""

    return {
        "article_number": article_number,
        "article_title": article_title,
        "main_text": main_text.strip(),
        "commentary": commentary.strip(),
        "references": references,
    }


# --------------------------------------------------------------------------
# CROSS-REFERENCES / AMENDMENTS / CASE LAW EXTRACTION
# --------------------------------------------------------------------------

ARTICLE_MENTION_RE = re.compile(
    r"Articles?\s+((?:\d+[A-Z]*\s*(?:,|and|&|to)\s*)*\d+[A-Z]*)", re.I
)
NUM_TOKEN_RE = re.compile(r"\d+[A-Z]*")

AMENDMENT_RE = re.compile(
    r"Constitution\s*\(\s*[\w\-\s]+?Amendment\s*\)\s*Act,?\s*\d{4}"
    r"|\b\d{1,3}(?:st|nd|rd|th)\s+(?:Constitutional\s+)?Amendment(?:\s+Act)?(?:,?\s*\d{4})?",
    re.I,
)

CASE_LAW_RE = re.compile(
    r"\b[A-Z][A-Za-z.&'\u2019\-]*(?:\s+(?:of|the|and)?\s*[A-Z][A-Za-z.&'\u2019\-]*){0,5}"
    r"\s+v\.?\s+"
    r"[A-Z][A-Za-z.&'\u2019()0-9\-]*(?:\s+(?:of|the|and)?\s*[A-Z][A-Za-z.&'\u2019()0-9\-]*){0,4}"
)

CASE_LAW_PREFIX_RE = re.compile(r"^(?:in\s+the\s+case\s+of\s+|in\s+)", re.I)
CASE_LAW_STOP_RE = re.compile(
    r"\s+(?:It|held|wherein|was\s+held|has\s+been|it\s+has|it\s+was|AIR)\b.*$"
)


def extract_cross_references(text: str, self_article: str):
    refs = []
    for m in ARTICLE_MENTION_RE.finditer(text):
        nums = NUM_TOKEN_RE.findall(m.group(1))
        refs.extend(nums)
    seen = set()
    out = []
    for n in refs:
        if n == self_article:
            continue
        label = f"Article {n}"
        if label not in seen:
            seen.add(label)
            out.append(label)
    return out


def extract_amendments(text: str):
    found = [m.group(0).strip() for m in AMENDMENT_RE.finditer(text)]
    seen = set()
    out = []
    for f in found:
        norm = re.sub(r"\s+", " ", f)
        if norm not in seen:
            seen.add(norm)
            out.append(norm)
    return out


def extract_case_laws(text: str):
    found = []
    for m in CASE_LAW_RE.finditer(text):
        raw = re.sub(r"\s+", " ", m.group(0)).strip(" ,")
        raw = CASE_LAW_PREFIX_RE.sub("", raw)
        raw = CASE_LAW_STOP_RE.sub("", raw).strip(" ,")
        found.append(raw)
    seen = set()
    out = []
    for f in found:
        if len(f) < 6 or len(f) > 100 or " v" not in f.lower():
            continue
        if f not in seen:
            seen.add(f)
            out.append(f)
    return out


STOPWORDS = {"of", "the", "in", "and", "for", "to", "a", "an", "on", "by", "or", "with"}


def build_keywords(article_number, article_title, part_title):
    kw = []
    if article_title:
        for w in re.split(r"[\s,;:()\-]+", article_title):
            w = w.strip()
            if w and w.lower() not in STOPWORDS:
                kw.append(w)
    if article_number:
        kw.append(f"Article {article_number}")
    if part_title:
        kw.append(part_title)
    # dedup, preserve order
    seen = set()
    out = []
    for k in kw:
        if k.lower() not in seen:
            seen.add(k.lower())
            out.append(k)
    return out


# --------------------------------------------------------------------------
# MAIN PER-PDF PIPELINE
# --------------------------------------------------------------------------

def process_pdf(pdf_path: str):
    raw_text = extract_text_from_pdf(pdf_path)
    return process_text(raw_text, source_pdf=os.path.basename(pdf_path))


def process_text(raw_text: str, source_pdf: str):
    cleaned, title_article_number, source_url = clean_text(raw_text)
    parts = split_article(cleaned)

    article_number = parts["article_number"] or title_article_number
    article_title = parts["article_title"]

    combined_for_extraction = parts["main_text"] + "\n" + parts["commentary"]

    part_number, part_title = resolve_part(article_number)

    cross_references = extract_cross_references(combined_for_extraction, article_number)
    amendments = extract_amendments(combined_for_extraction)
    case_laws = extract_case_laws(parts["commentary"])
    keywords = build_keywords(article_number, article_title, part_title)

    citation = f"Article {article_number}, Constitution of India" if article_number else None

    record = {
        "document_type": "Constitution",
        "constitution_name": "Constitution of India",
        "year": "1950",
        "part_number": part_number,
        "part_title": part_title,
        "chapter": None,
        "article_number": article_number,
        "article_title": article_title,
        "citation": citation,
        "text": parts["main_text"] if parts["main_text"] else None,
        "commentary": parts["commentary"] if parts["commentary"] else None,
        "keywords": keywords,
        "cross_references": cross_references,
        "amendments": amendments,
        "case_laws": case_laws,
        "references": parts["references"],
        "source": "Indian Kanoon" if source_url else "Constitution PDF",
        "source_url": source_url,
        "source_pdf": source_pdf,
    }
    return record


# --------------------------------------------------------------------------
# FOLDER DRIVER
# --------------------------------------------------------------------------

def gather_pdfs(path: str):
    if os.path.isdir(path):
        return sorted(glob.glob(os.path.join(path, "**", "*.[Pp][Dd][Ff]"), recursive=True))
    elif os.path.isfile(path) and path.lower().endswith(".pdf"):
        return [path]
    else:
        raise ValueError(f"Not a PDF or directory: {path}")


def main():
    ap = argparse.ArgumentParser(description="Scrape Constitution-of-India article PDFs into JSON.")
    ap.add_argument("input", help="Path to a single PDF or a folder of PDFs (input dir)")
    ap.add_argument("output", nargs="?", default="/mnt/user-data/outputs",
                     help="Output directory (default: /mnt/user-data/outputs)")
    ap.add_argument("-o", "--output-flag", dest="output_flag", default=None,
                     help="Alternative way to pass the output directory")
    ap.add_argument("--combined", action="store_true",
                     help="Write a single combined JSON array instead of one file per PDF")
    args = ap.parse_args()

    output_dir = args.output_flag or args.output
    os.makedirs(output_dir, exist_ok=True)

    pdfs = gather_pdfs(args.input)
    if not pdfs:
        print("No PDFs found.", file=sys.stderr)
        sys.exit(1)

    all_records = []
    for pdf_path in pdfs:
        print(f"Processing {pdf_path} ...")
        try:
            record = process_pdf(pdf_path)
        except Exception as e:
            print(f"  FAILED: {e}", file=sys.stderr)
            continue

        art = record.get("article_number") or "UNKNOWN"
        print(f"  -> Article {art}")

        if args.combined:
            all_records.append(record)
        else:
            base = os.path.splitext(os.path.basename(pdf_path))[0]
            out_path = os.path.join(output_dir, base + ".json")
            with open(out_path, "w", encoding="utf-8") as f:
                json.dump(record, f, indent=2, ensure_ascii=False)
            print(f"  wrote {out_path}")

    if args.combined:
        out_path = os.path.join(output_dir, "all_articles.json")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(all_records, f, indent=2, ensure_ascii=False)
        print(f"wrote combined file: {out_path} ({len(all_records)} articles total)")


if __name__ == "__main__":
    main()
