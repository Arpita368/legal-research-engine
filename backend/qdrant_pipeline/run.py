"""
run.py - Main Upload Pipeline

Orchestrates the complete flow: connect → create collection →
generate embeddings → upload → verify.

Usage:
    python backend/qdrant_pipeline/run.py

    Or import:
    from run import main
    main()

Steps:
    1. Connects to Qdrant
    2. Creates 'legal_chunks' collection
    3. Loads all JSON files from data folders
    4. Generates embeddings for each chunk
    5. Uploads in batches to Qdrant
    6. Prints total vectors stored
"""
from client import QdrantManager
from uploader import Uploader

def main():
    print("=" * 50)
    print("Legal Document Upload Pipeline")
    print("=" * 50)
    qdrant = QdrantManager()
    qdrant.create_collection()
    uploader = Uploader(qdrant.client)
    uploader.process()
    count = qdrant.get_count()
    print(f"\nVectors in Qdrant: {count}")
    qdrant.close()
    print("Done!")

if __name__ == "__main__":
    main()