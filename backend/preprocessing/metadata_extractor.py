import re


class MetadataExtractor:

    def extract(self, text):

        metadata = {
            "title": "",
            "citation": "",
            "insc_number": "",
            "case_number": "",
            "judgment_date": "",
            "bench": [],
            "court": "Supreme Court of India"
        }

        # ----------------------------------------
        # Citation
        # Example:
        #
        # [2026] 6 S.C.R. 311 : 2026 INSC 495
        # ----------------------------------------

        m = re.search(
            r"\[(\d{4})\]\s+\d+\s+S\.C\.R\.\s+\d+\s*:\s*(\d{4}\s+INSC\s+\d+)",
            text
        )

        if m:

            metadata["citation"] = m.group(0)
            metadata["insc_number"] = m.group(2)

        # ----------------------------------------
        # Title
        #
        # ABC
        # v.
        # XYZ
        # ----------------------------------------

        m = re.search(

            r"\n([A-Z][^\n]+?)\n(?:A\d+:.*\n)*v\.\n([^\n]+)",

            text,

            re.MULTILINE

        )

        if m:

            metadata["title"] = (
                m.group(1).strip()
                + " v. "
                + m.group(2).strip()
            )

        # ----------------------------------------
        # Case Number
        #
        # (Civil Appeal No. 7371 of 2026)
        # ----------------------------------------

        m = re.search(

            r"\((.*?)\)",

            text

        )

        if m:

            metadata["case_number"] = m.group(1)

        # ----------------------------------------
        # Date
        #
        # 08 May 2026
        # ----------------------------------------

        m = re.search(

            r"\n(\d{2}\s+[A-Za-z]+\s+\d{4})\n",

            text

        )

        if m:

            metadata["judgment_date"] = m.group(1)

        # ----------------------------------------
        # Bench
        #
        # [Ahsanuddin Amanullah* and Vipul M Pancholi, JJ.]
        # ----------------------------------------

        m = re.search(

            r"\[([^\]]+JJ\.)\]",

            text

        )

        if m:

            bench = m.group(1)

            bench = bench.replace("JJ.", "")
            bench = bench.replace("*", "")

            judges = [
                j.strip()
                for j in bench.split("and")
            ]

            metadata["bench"] = judges

        return metadata