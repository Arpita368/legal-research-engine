import re

from backend.preprocessing.pdf_parser import PDFParser


class JudgmentSplitter:

    def __init__(self):

        self.start_pattern = re.compile(
            r"\[\d{4}\]\s+\d+\s+S\.C\.R\.\s+\d+\s*:\s*\d{4}\s+INSC\s+\d+",
            re.IGNORECASE,
        )

    def is_start(self, text):

        return bool(self.start_pattern.search(text))

    def split(self, pages):

        judgments = []

        current = []

        start_page = None

        for page in pages:

            text = page["text"]

            if self.is_start(text):

                if current:

                    judgments.append(
                        {
                            "start_page": start_page,
                            "end_page": page["page_number"] - 1,
                            "text": "\n".join(current),
                        }
                    )

                    current = []

                start_page = page["page_number"]

            if start_page is not None:
                current.append(text)

        if current:

            judgments.append(
                {
                    "start_page": start_page,
                    "end_page": pages[-1]["page_number"],
                    "text": "\n".join(current),
                }
            )

        return judgments

    # ----------------------------------------
    # NEW METHOD
    # ----------------------------------------

    def split_pdf(self, pdf_path):

        parser = PDFParser(pdf_path)

        pages = parser.extract_pages()

        return self.split(pages)