from sentence_transformers import SentenceTransformer


class EmbeddingGenerator:
    """
    Generates embeddings for legal text chunks.
    """

    def __init__(self, model_name="BAAI/bge-m3"):

        print(f"Loading embedding model: {model_name}")

        self.model = SentenceTransformer(model_name)

        print("Embedding model loaded successfully.")

    def generate_embedding(self, text: str):
        """
        Generate embedding for a single text chunk.
        """

        if not text or not text.strip():
            return None

        embedding = self.model.encode(
            text,
            normalize_embeddings=True
        )

        return embedding.tolist()

    def generate_embeddings(self, chunks):
        """
        Generate embeddings for multiple chunks using batch encoding.
        """

        if not chunks:
            return []

        # Extract all texts
        texts = [
            chunk["text"]
            for chunk in chunks
        ]

        # Generate embeddings in batches
        embeddings = self.model.encode(
            texts,
            batch_size=32,
            normalize_embeddings=True,
            show_progress_bar=True
        )

        results = []

        # Combine chunk metadata with embeddings
        for chunk, embedding in zip(chunks, embeddings):

            obj = chunk.copy()

            obj["embedding"] = embedding.tolist()

            results.append(obj)

        return results


# --------------------------------------------------------
# Testing
# --------------------------------------------------------

if __name__ == "__main__":

    sample_chunks = [

        {
            "chunk_id": "001_001",
            "text": "The Supreme Court held that anticipatory bail can be granted."
        },

        {
            "chunk_id": "001_002",
            "text": "The appellant challenged the constitutional validity."
        },

        {
            "chunk_id": "001_003",
            "text": "The High Court dismissed the appeal."
        }

    ]

    generator = EmbeddingGenerator()

    embedded_chunks = generator.generate_embeddings(
        sample_chunks
    )

    print()

    print("Generated Embeddings:", len(embedded_chunks))

    print()

    print("First Chunk ID:")
    print(embedded_chunks[0]["chunk_id"])

    print()

    print("Embedding Dimension:")
    print(len(embedded_chunks[0]["embedding"]))

    print()

    print("Sample Embedding (First 10 values):")
    print(embedded_chunks[0]["embedding"][:10])