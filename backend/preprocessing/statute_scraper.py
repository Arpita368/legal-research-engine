#!/usr/bin/env python3
"""
Indian Statute PDF -> JSON scraper
===================================

Point it at a single PDF or a folder of PDFs (bare Central-Act-style PDFs,
e.g. as published on indiacode.nic.in) and it will emit one JSON array file
per PDF, with one object per section, e.g.:

{
  "document_type": "statute",
  "act_name": "The Commercial Courts Act, 2015",
  "short_name": "Commercial Courts Act",
  "act_number": "4 of 2016",
  "year": 2015,
  "part": null,
  "chapter": "CHAPTER II - CONSTITUTION OF COMMERCIAL COURTS...",
  "section_number": "6",
  "section_title": "Jurisdiction of Commercial Court",
  "citation": "Section 6, Commercial Courts Act, 2015",
  "text": "...full section text...",
  "source_pdf": "Commercial_Courts_Act__2015.pdf"
}

USAGE
-----
    python3 scraper.py /path/to/file_or_folder [-o /path/to/output_dir]

    # single combined file with everything instead of per-pdf files:
    python3 scraper.py /path/to/folder -o out/ --combined

If some header metadata (act number, year, short name) can't be found in
the PDF text itself, the script tries a small built-in lookup table of
well-known Indian acts, and -- if `--web` is passed and `requests` +
internet access are available -- falls back to a best-effort web search.
Anything still missing is left as null rather than guessed.
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
    """Extract raw text from a PDF, page by page, joined with newlines."""
    import pdfplumber
    pages = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            pages.append(page.extract_text() or "")
    return "\n".join(pages)


# --------------------------------------------------------------------------
# KNOWN-ACT FALLBACK METADATA (extend as needed)
# --------------------------------------------------------------------------

KNOWN_ACTS = {
    "the commercial courts act, 2015": {
        "short_name": "Commercial Courts Act",
        "act_number": "4 of 2016",
        "year": 2015,
    },
    "the indian contract act, 1872": {
        "short_name": "Contract Act",
        "act_number": "9 of 1872",
        "year": 1872,
    },
    "the arbitration and conciliation act, 1996": {
        "short_name": "Arbitration Act",
        "act_number": "26 of 1996",
        "year": 1996,
    },
}


def web_lookup_metadata(act_name: str):
    """
    Best-effort fallback: try to find act_number/year/short_name online.
    Only used if --web is passed. Silently returns {} on any failure
    (no internet, no `requests`, parsing miss, etc.) so the pipeline
    never breaks because of this step.
    """
    try:
        import requests
        from bs4 import BeautifulSoup
    except ImportError:
        return {}

    try:
        query = f"{act_name} act number india"
        resp = requests.get(
            "https://www.bing.com/search",
            params={"q": query},
            headers={"User-Agent": "Mozilla/5.0"},
            timeout=8,
        )
        text = BeautifulSoup(resp.text, "html.parser").get_text(" ")
        m = re.search(r"Act\s*(?:No\.?)?\s*(\d+)\s*of\s*(\d{4})", text, re.I)
        result = {}
        if m:
            result["act_number"] = f"{m.group(1)} of {m.group(2)}"
        return result
    except Exception:
        return {}


# --------------------------------------------------------------------------
# METADATA PARSING (act name / act number / year)
# --------------------------------------------------------------------------

def parse_act_metadata(text: str):
    """
    Find the *second* occurrence of the act title (the first is the TOC
    heading, the second precedes 'ACT NO. X OF YYYY'), plus the act number.
    """
    # e.g. "THE COMMERCIAL COURTS ACT, 2015" (all caps heading)
    title_matches = list(re.finditer(
        r"THE\s+([A-Z][A-Z ,&'\-]+?ACT),?\s*(\d{4})", text
    ))

    act_name = None
    year = None
    if title_matches:
        # prefer the one immediately followed by "ACT NO."
        chosen = None
        for m in title_matches:
            tail = text[m.end():m.end() + 200]
            if re.search(r"ACT\s*NO\.?\s*\d+\s*OF\s*\d{4}", tail, re.I):
                chosen = m
                break
        if chosen is None:
            chosen = title_matches[-1]
        raw_title = chosen.group(0)
        year = int(chosen.group(2))
        # Title-case it nicely: "The Commercial Courts Act, 2015"
        act_name = "The " + raw_title[3:].title().replace("Of", "of")
        act_name = re.sub(r"\s+", " ", act_name).strip()
        # fix ", <year>" spacing
        act_name = re.sub(r",\s*(\d{4})$", r", \1", act_name)

    act_number_match = re.search(r"ACT\s*NO\.?\s*(\d+)\s*OF\s*(\d{4})", text, re.I)
    act_number = None
    if act_number_match:
        act_number = f"{act_number_match.group(1)} of {act_number_match.group(2)}"

    return act_name, act_number, year


def guess_short_name(act_name: str) -> str:
    if not act_name:
        return None
    # Strip leading "The " and trailing ", YYYY"
    name = re.sub(r"^The\s+", "", act_name)
    name = re.sub(r",?\s*\d{4}$", "", name).strip()
    # "Commercial Courts Act" -> keep as is; "Indian Contract Act" -> "Contract Act"
    words = name.split()
    if len(words) > 2 and words[0].lower() in {"indian", "the"}:
        words = words[1:]
    return " ".join(words)


# --------------------------------------------------------------------------
# CHAPTER PARSING
# --------------------------------------------------------------------------

CHAPTER_RE = re.compile(
    r"(?m)^\s*\[?CHAPTER\s*[.\-]{0,2}\s*([IVXLC]+A?)\b"
)

def find_chapters(text: str):
    """
    Returns a list of (start_offset, chapter_label) sorted by offset.
    chapter_label combines the roman numeral and (if present) the title
    line(s) that follow, e.g. "CHAPTER II - CONSTITUTION OF COMMERCIAL COURTS..."
    """
    chapters = []
    for m in CHAPTER_RE.finditer(text):
        start = m.start()
        roman = m.group(1)
        # grab following non-blank lines (title), stop at next blank line
        # or a line that looks like a section start.
        rest = text[m.end():m.end() + 400]
        lines = [l.strip() for l in rest.splitlines()]
        title_lines = []
        for l in lines:
            if not l:
                if title_lines:
                    break
                else:
                    continue
            if re.match(r"^\d+\s*$", l):
                # a bare footnote-reference number (superscript), skip silently
                continue
            if re.match(r"^\d+[A-Z]?\.\s", l):
                break
            if re.match(r"^SECTIONS\s*$", l, re.I):
                break
            # Chapter titles are conventionally ALL CAPS. Strip brackets/
            # punctuation before checking, so "[COMMERCIAL COURTS...]" style
            # amendment-substituted titles are still recognised.
            alpha_only = re.sub(r"[^A-Za-z]", "", l)
            if alpha_only and not alpha_only.isupper():
                break
            title_lines.append(l.strip("[]"))
            if len(title_lines) >= 3:
                break
        title = " ".join(title_lines).strip()
        label = f"CHAPTER {roman}" + (f" - {title}" if title else "")
        chapters.append((start, label))
    return chapters


def chapter_for_offset(chapters, offset):
    label = None
    for start, lbl in chapters:
        if start <= offset:
            label = lbl
        else:
            break
    return label


# --------------------------------------------------------------------------
# TOC (ARRANGEMENT OF SECTIONS) PARSING
# --------------------------------------------------------------------------

def parse_toc_section_numbers(text: str):
    """
    Pull the ordered list of section numbers out of the
    'ARRANGEMENT OF SECTIONS' block at the top of the Act.
    Falls back to None (caller will use body-only detection) if not found.
    """
    m = re.search(r"ARRANGEMENT OF SECTIONS(.*?)(?:PREAMBLE|PRELIMINARY|CHAPTER\s+I\b)",
                  text, re.S | re.I)
    if not m:
        return []
    block = m.group(1)
    nums = re.findall(r"(?m)^\s*(\d+[A-Z]?)\.\s", block)
    # de-duplicate while preserving order
    seen = set()
    ordered = []
    for n in nums:
        if n not in seen:
            seen.add(n)
            ordered.append(n)
    return ordered


# --------------------------------------------------------------------------
# BODY SECTION SPLITTING
# --------------------------------------------------------------------------

def find_enactment_start(text: str) -> int:
    """
    Find where the *real* Act body starts (after the TOC + preamble),
    i.e. after the 'BE it enacted ...' clause, or after the second
    occurrence of the act title if no enactment clause is found.
    """
    m = re.search(r"BE it enacted[^\n]*", text, re.I)
    if m:
        return m.end()
    m2 = re.search(r"ACT\s*NO\.?\s*\d+\s*OF\s*\d{4}", text, re.I)
    if m2:
        return m2.end()
    return 0


SECTION_LINE_RE = re.compile(r"(?m)^\s*\[?(\d+[A-Z]?)\.\s*(.{0,40})")

# Text immediately following "<num>. " that marks the line as a running
# footnote (amendment note) rather than a real section heading.
FOOTNOTE_LEAD_RE = re.compile(
    r"^(Ins\.|Subs\.|Rep\.|Omitted|Renumbered|The words|The\s|Clause|Added|"
    r"Section|Sub-section|Explanation|See\s|Cf\.|For\s)",
    re.I,
)


def _is_footnote_candidate(lead_text: str) -> bool:
    return bool(FOOTNOTE_LEAD_RE.match(lead_text.strip()))


def find_body_sections(text: str, body_start: int, toc_numbers):
    """
    Locate the offset of every real section heading in the body
    (as opposed to footnote lines that also start with 'N. ').

    Strategy: scan all line-start matches of '<num>. ' after body_start,
    drop ones that look like running footnotes, then greedily walk
    through the survivors in the order implied by toc_numbers (allowing
    a small lookahead window so genuinely-missing/repealed entries in
    the TOC don't derail the match), falling back to a simple
    non-decreasing-number heuristic if TOC matching mostly fails.
    """
    raw_candidates = [
        (m.start(1), m.group(1), m.group(2)) for m in SECTION_LINE_RE.finditer(text, body_start)
    ]
    candidates = [
        (offset, num) for offset, num, lead in raw_candidates
        if not _is_footnote_candidate(lead)
    ]

    results = []  # (offset, number)

    if toc_numbers:
        idx = 0
        window = 6
        last_offset = -1
        for offset, num in candidates:
            if idx >= len(toc_numbers) or offset <= last_offset:
                continue
            # look for `num` within a small window ahead of the current
            # TOC pointer, to tolerate the odd missing/repealed entry
            found_at = None
            for j in range(idx, min(idx + window, len(toc_numbers))):
                if toc_numbers[j] == num:
                    found_at = j
                    break
            if found_at is not None:
                results.append((offset, num))
                last_offset = offset
                idx = found_at + 1

        if len(results) < max(3, len(toc_numbers) * 0.4):
            results = []

    if not results:
        # Fallback: assume every non-footnote line-start match in body is
        # a real section as long as its numeric part is non-decreasing.
        def numeric_key(n):
            digits = re.match(r"\d+", n).group(0)
            return int(digits)

        last_num = -1
        for offset, num in candidates:
            nk = numeric_key(num)
            if nk >= last_num:
                results.append((offset, num))
                last_num = nk

    return results


def extract_section_title_and_text(text: str, num: str, start: int, end: int):
    """
    Given the raw slice for a section (starting right at '<num>.'), split
    into (title, body_text).
    Title = text up to the first em/en-dash or double-dash ('.—' style)
    or up to the first '.' followed by a capital letter starting the body
    if no dash is present.
    """
    chunk = text[start:end].strip()
    # drop the leading "12A." (optionally bracket-prefixed, e.g. "[3A.") itself
    chunk = re.sub(rf"^\[?{re.escape(num)}\.\s*", "", chunk, count=1)

    # look for the title/body divider: '.—', '.--', '—' etc.
    m = re.search(r"[.\u2014\u2013]{1,2}\s*[-\u2014\u2013]?\s*", chunk)
    dash_m = re.search(r"[\u2014\u2013]|--", chunk)
    if dash_m:
        title = chunk[:dash_m.start()].strip().rstrip(".").strip()
        body = chunk[dash_m.end():].strip()
    else:
        # no dash found (rare) - split on first period
        p = chunk.find(".")
        if p != -1:
            title = chunk[:p].strip()
            body = chunk[p + 1:].strip()
        else:
            title = chunk.strip()
            body = ""

    full_text = (num + ". " + chunk).strip()
    full_text = re.sub(r"[ \t]+", " ", full_text)
    full_text = re.sub(r"\n{2,}", "\n", full_text).strip()

    title = re.sub(r"\s+", " ", title).strip()
    return title, full_text


# --------------------------------------------------------------------------
# CLEANUP HELPERS
# --------------------------------------------------------------------------

FOOTNOTE_MARK_RE = re.compile(r"\n\s*\d+\.\s+(Ins\.|Subs\.|Rep\.|Omitted|Renumbered|The words)[^\n]*", re.I)

def strip_footer_noise(text: str) -> str:
    """Remove obvious running footnote / footer lines from a section body."""
    text = FOOTNOTE_MARK_RE.sub("", text)
    # remove bare page-number lines
    text = re.sub(r"\n\s*\d{1,4}\s*\n", "\n", text)
    return text


def balance_brackets(text: str) -> str:
    """
    Amendment markup wraps whole inserted sections in '[...]' but our
    slicing starts just past the opening bracket, so an unmatched
    trailing ']' is often left dangling. Trim it (and any trailing
    whitespace/period before it) if brackets are unbalanced.
    """
    text = text.rstrip()
    while text.count("]") > text.count("["):
        idx = text.rfind("]")
        text = text[:idx].rstrip()
    return text


# --------------------------------------------------------------------------
# MAIN PER-PDF PIPELINE
# --------------------------------------------------------------------------

def process_pdf(pdf_path: str, use_web: bool = False):
    text = extract_text_from_pdf(pdf_path)
    return process_text(text, source_pdf=os.path.basename(pdf_path), use_web=use_web)


def process_text(text: str, source_pdf: str, use_web: bool = False):
    act_name, act_number, year = parse_act_metadata(text)

    fallback = KNOWN_ACTS.get((act_name or "").lower(), {})
    if not act_number:
        act_number = fallback.get("act_number")
    if not year:
        year = fallback.get("year")
    short_name = fallback.get("short_name") or guess_short_name(act_name)

    if use_web and (not act_number or not year) and act_name:
        web_meta = web_lookup_metadata(act_name)
        act_number = act_number or web_meta.get("act_number")

    toc_numbers = parse_toc_section_numbers(text)
    body_start = find_enactment_start(text)
    # Only look for chapter headings in the real body -- the same
    # "CHAPTER I" / "CHAPTER II" headings also appear in the
    # ARRANGEMENT OF SECTIONS table of contents above body_start, and we
    # don't want those polluting the offset->chapter lookup.
    chapters = [(off + body_start, lbl) for off, lbl in find_chapters(text[body_start:])]

    sections = find_body_sections(text, body_start, toc_numbers)

    records = []
    for i, (offset, num) in enumerate(sections):
        end = sections[i + 1][0] if i + 1 < len(sections) else len(text)
        raw_slice = text[offset:end]
        raw_slice = strip_footer_noise(raw_slice)
        title, full_text = extract_section_title_and_text(text, num, offset, end)
        full_text = strip_footer_noise(full_text)
        full_text = balance_brackets(full_text)

        chapter_label = chapter_for_offset(chapters, offset)
        if chapter_label:
            chapter_label = balance_brackets(chapter_label).rstrip(".")

        citation = f"Section {num}, {short_name}, {year}" if short_name and year else f"Section {num}, {act_name}"

        records.append({
            "document_type": "statute",
            "act_name": act_name,
            "short_name": short_name,
            "act_number": act_number,
            "year": year,
            "part": None,
            "chapter": chapter_label,
            "section_number": num,
            "section_title": title if title else None,
            "citation": citation,
            "text": full_text,
            "source_pdf": source_pdf,
        })

    return records


# --------------------------------------------------------------------------
# FOLDER / FILE DRIVER
# --------------------------------------------------------------------------

def gather_pdfs(path: str):
    if os.path.isdir(path):
        return sorted(glob.glob(os.path.join(path, "**", "*.pdf"), recursive=True))
    elif os.path.isfile(path) and path.lower().endswith(".pdf"):
        return [path]
    else:
        raise ValueError(f"Not a PDF or directory: {path}")


def main():
    ap = argparse.ArgumentParser(description="Scrape Indian statute PDFs into per-section JSON.")
    ap.add_argument("input", help="Path to a single PDF or a folder of PDFs")
    ap.add_argument("-o", "--output", default="/mnt/user-data/outputs",
                     help="Output directory (default: /mnt/user-data/outputs)")
    ap.add_argument("--combined", action="store_true",
                     help="Write a single combined JSON file instead of one per PDF")
    ap.add_argument("--web", action="store_true",
                     help="Attempt best-effort web lookup for missing metadata (needs internet + requests/bs4)")
    args = ap.parse_args()

    os.makedirs(args.output, exist_ok=True)
    pdfs = gather_pdfs(args.input)
    if not pdfs:
        print("No PDFs found.", file=sys.stderr)
        sys.exit(1)

    all_records = []
    for pdf_path in pdfs:
        print(f"Processing {pdf_path} ...")
        try:
            records = process_pdf(pdf_path, use_web=args.web)
        except Exception as e:
            print(f"  FAILED: {e}", file=sys.stderr)
            continue
        print(f"  -> {len(records)} sections")

        if args.combined:
            all_records.extend(records)
        else:
            out_name = os.path.splitext(os.path.basename(pdf_path))[0] + ".json"
            out_path = os.path.join(args.output, out_name)
            with open(out_path, "w", encoding="utf-8") as f:
                json.dump(records, f, indent=2, ensure_ascii=False)
            print(f"  wrote {out_path}")

    if args.combined:
        out_path = os.path.join(args.output, "all_statutes.json")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(all_records, f, indent=2, ensure_ascii=False)
        print(f"wrote combined file: {out_path} ({len(all_records)} sections total)")


if __name__ == "__main__":
    main()
