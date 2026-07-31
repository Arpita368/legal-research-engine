"""
uploader.py - Qdrant Uploader

Uses the team's EmbeddingGenerator to create embeddings,
then uploads them in batches to Qdrant.

Usage:
    from uploader import Uploader
    uploader = Uploader(qdrant_client)
    uploader.process()
"""

import json
import os
import glob
import uuid
import sys
from pathlib import Path
from qdrant_client.http.models import PointStruct

# Add backend to path so we can import team's code
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from backend.embeddings.embedding_generator import EmbeddingGenerator
import config


class Uploader:
    """
    Reads JSON chunk files, generates embeddings, and uploads to Qdrant.
    """

    def __init__(self, qdrant_client):
        self.client = qdrant_client
        self.generator = EmbeddingGenerator(model_name=config.MODEL_NAME)
        self.total = 0

    def find_files(self):
        """Find all JSON files in configured data paths."""
        files = []
        for path in config.DATA_PATHS:
            if os.path.exists(path):
                files.extend(glob.glob(f"{path}/**/*.json", recursive=True))
        return files

    def process(self):
        """Process all found files: embed and upload."""
        files = self.find_files()
        print(f"Found {len(files)} files")

        for filepath in files:
            print(f"Processing: {os.path.basename(filepath)}")
            chunks = self._load_json(filepath)
            if chunks:
                self._embed_and_upload(chunks, filepath)

        print(f"Done! Total uploaded: {self.total}")

    def _load_json(self, filepath):
        """Load chunks from a JSON file."""
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data if isinstance(data, list) else [data]

    def _embed_and_upload(self, chunks, filepath):
        """
        Generate embeddings using team's EmbeddingGenerator,
        then upload in batches to Qdrant.
        """
        filename = os.path.basename(filepath).replace('.json', '')

        # Use team's generator for batch embeddings
        embedded_chunks = self.generator.generate_embeddings(chunks)

        points = []
        for chunk in embedded_chunks:
            if 'embedding' not in chunk:
                continue

            # Unique ID for each chunk
            point_id = str(uuid.uuid4())

            # Payload = all metadata except the embedding vector
            payload = {k: v for k, v in chunk.items() if k != 'embedding'}
            payload['source_file'] = filename

            points.append(PointStruct(
                id=point_id,
                vector=chunk['embedding'],
                payload=payload
            ))

            # Upload in batches
            if len(points) >= config.BATCH_SIZE:
                self.client.upsert(
                    collection_name=config.COLLECTION_NAME,
                    points=points,
                    wait=True
                )
                self.total += len(points)
                print(f"  Uploaded {self.total} chunks...")
                points = []

        # Upload remaining
        if points:
            self.client.upsert(
                collection_name=config.COLLECTION_NAME,
                points=points,
                wait=True
            )
            self.total += len(points)