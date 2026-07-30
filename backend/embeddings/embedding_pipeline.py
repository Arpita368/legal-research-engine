import json
from pathlib import Path

from backend.embeddings.embedding_generator import EmbeddingGenerator


def main():

    generator = EmbeddingGenerator()

    # Folder containing all chunk files
    base_dir = Path("data/judgments")

    # Find every chunks_*.json recursively
    chunk_files = list(base_dir.rglob("chunks_*.json"))

    print(f"\nFound {len(chunk_files)} chunk files.\n")

    total_chunks = 0

    for file in chunk_files:

        print("=" * 60)
        print(f"Processing: {file}")

        with open(file, "r", encoding="utf-8") as f:
            chunks = json.load(f)

        embedded_chunks = generator.generate_embeddings(chunks)

        total_chunks += len(embedded_chunks)

        print(f"Embedded {len(embedded_chunks)} chunks")

        if embedded_chunks:
            print(f"Embedding Dimension: {len(embedded_chunks[0]['embedding'])}")

    print("\n" + "=" * 60)
    print("Embedding generation completed.")
    print(f"Total Embedded Chunks: {total_chunks}")


if __name__ == "__main__":
    main()