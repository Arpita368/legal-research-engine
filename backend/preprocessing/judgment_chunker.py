from langchain_text_splitters import TokenTextSplitter


class JudgmentChunker:
    """
    Splits a judgment into token-based chunks for Legal RAG.
    """

    def __init__(
        self,
        chunk_size=700,
        chunk_overlap=100,
        encoding_name="cl100k_base"
    ):

        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

        self.splitter = TokenTextSplitter(
            encoding_name=encoding_name,
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap
        )

    def split(self, text: str, metadata: dict):
        """
        Split a judgment into structured token-based chunks.

        Parameters
        ----------
        text : str
            Complete judgment text.

        metadata : dict
            Metadata extracted from MetadataExtractor.

        Returns
        -------
        list
            List of chunk dictionaries.
        """

        if not text or not text.strip():
            return []

        split_texts = self.splitter.split_text(text)

        chunks = []

        for i, chunk in enumerate(split_texts, start=1):

            chunks.append({

                "chunk_id": f"{metadata['case_id']}_{i:03d}",

                "case_id": metadata["case_id"],

                "chunk_number": i,

                "title": metadata.get("title"),

                "citation": metadata.get("citation"),

                "insc_number": metadata.get("insc_number"),

                "case_number": metadata.get("case_number"),

                "judgment_date": metadata.get("judgment_date"),

                "bench": metadata.get("bench"),

                "court": metadata.get("court"),

                "text": chunk

            })

        return chunks


# ----------------------------------------------------------
# Testing
# ----------------------------------------------------------

if __name__ == "__main__":

    sample_text = (
        "The Supreme Court observed that the appellant had a valid claim. "
        * 500
    )

    metadata = {

        "case_id": "001",

        "title": "ABC v. XYZ",

        "citation": "[2026] 6 S.C.R. 311",

        "insc_number": "2026 INSC 495",

        "case_number": "Civil Appeal No. 7371 of 2026",

        "judgment_date": "08 May 2026",

        "bench": [
            "Justice A",
            "Justice B"
        ],

        "court": "Supreme Court of India"
    }

    chunker = JudgmentChunker(
        chunk_size=700,
        chunk_overlap=100
    )

    chunks = chunker.split(
        sample_text,
        metadata
    )

    print("=" * 60)
    print("Total Chunks:", len(chunks))
    print("=" * 60)

    print("\nFirst Chunk\n")
    print(chunks[0])

    print("\nLast Chunk\n")
    print(chunks[-1])