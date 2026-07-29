from pathlib import Path
import fitz


class PDFParser:

    def __init__(self, pdf_path):
        self.pdf_path = Path(pdf_path)

    def extract_pages(self):
        """
        Returns:
        [
            {
                "page_number":1,
                "text":"...."
            },
            ...
        ]
        """

        doc = fitz.open(self.pdf_path)

        pages = []

        for page_no, page in enumerate(doc, start=1):

            text = page.get_text("text")

            pages.append(
                {
                    "page_number": page_no,
                    "text": text
                }
            )

        doc.close()

        return pages