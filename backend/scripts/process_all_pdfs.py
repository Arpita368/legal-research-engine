import json
from pathlib import Path

from backend.preprocessing.judgment_splitter import JudgmentSplitter
from backend.preprocessing.metadata_extractor import MetadataExtractor

RAW_FOLDER = Path("data/raw")
OUTPUT_ROOT = Path("data/judgments")

OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)

pdfs = sorted(RAW_FOLDER.glob("*.pdf"))

splitter = JudgmentSplitter()
extractor = MetadataExtractor()

total = 0

for pdf in pdfs:

    print("=" * 70)
    print(pdf.name)

    judgments = splitter.split_pdf(pdf)

    print("Cases:", len(judgments))

    volume_folder = OUTPUT_ROOT / pdf.stem.replace(" ", "_")
    volume_folder.mkdir(parents=True, exist_ok=True)

    metadata = []

    for i, judgment in enumerate(judgments, start=1):

        case_id = f"{i:03d}"

        txt_name = f"judgment_{case_id}.txt"
        json_name = f"judgment_{case_id}.json"

        txt_path = volume_folder / txt_name
        json_path = volume_folder / json_name

        text = judgment["text"]

        # ---------------------------------
        # Extract Metadata
        # ---------------------------------

        meta = extractor.extract(text)

        # ---------------------------------
        # Save TXT
        # ---------------------------------

        txt_path.write_text(
            text,
            encoding="utf8"
        )

        # ---------------------------------
        # Save JSON
        # ---------------------------------

        obj = {

            "case_id": case_id,

            "title": meta["title"],

            "citation": meta["citation"],

            "insc_number": meta["insc_number"],

            "case_number": meta["case_number"],

            "judgment_date": meta["judgment_date"],

            "bench": meta["bench"],

            "court": meta["court"],

            "volume": pdf.stem,

            "start_page": judgment["start_page"],

            "end_page": judgment["end_page"],

            "page_count":
                judgment["end_page"]
                - judgment["start_page"]
                + 1,

            "text": text
        }

        with open(
            json_path,
            "w",
            encoding="utf8"
        ) as f:

            json.dump(
                obj,
                f,
                indent=4,
                ensure_ascii=False
            )

        # ---------------------------------
        # Metadata Index
        # ---------------------------------

        metadata.append({

            "case_id": case_id,

            "title": meta["title"],

            "citation": meta["citation"],

            "insc_number": meta["insc_number"],

            "case_number": meta["case_number"],

            "judgment_date": meta["judgment_date"],

            "bench": meta["bench"],

            "court": meta["court"],

            "volume": pdf.stem,

            "start_page": judgment["start_page"],

            "end_page": judgment["end_page"],

            "page_count":
                judgment["end_page"]
                - judgment["start_page"]
                + 1,

            "txt_file": txt_name,

            "json_file": json_name

        })

    with open(
        volume_folder / "metadata.json",
        "w",
        encoding="utf8"
    ) as f:

        json.dump(
            metadata,
            f,
            indent=4,
            ensure_ascii=False
        )

    total += len(judgments)

print("\n" + "=" * 70)
print("Finished")
print("Total Judgments:", total)