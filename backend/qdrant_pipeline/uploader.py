import json
import os
import glob
import uuid
from sentence_transformers import SentenceTransformer
from qdrant_client.http.models import PointStruct
import config

class Uploader:
    def __init__(self, qdrant_client):
        self.client = qdrant_client
        self.model = SentenceTransformer(config.MODEL_NAME)
        self.total = 0
    
    def find_files(self):
        files = []
        for path in config.DATA_PATHS:
            if os.path.exists(path):
                files.extend(glob.glob(f"{path}/**/*.json", recursive=True))
        return files
    
    def process(self):
        files = self.find_files()
        print(f"Found {len(files)} files")
        for filepath in files:
            print(f"Processing: {os.path.basename(filepath)}")
            chunks = self._load_json(filepath)
            self._embed_and_upload(chunks, filepath)
        print(f"Done! Total: {self.total}")
    
    def _load_json(self, filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data if isinstance(data, list) else [data]
    
    def _embed_and_upload(self, chunks, filepath):
        points = []
        filename = os.path.basename(filepath).replace('.json', '')
        for i, chunk in enumerate(chunks):
            text = chunk.get('text', '')
            if not text:
                continue
            vector = self.model.encode(text).tolist()
            chunk_id = str(uuid.uuid4())
            payload = {k: v for k, v in chunk.items() if k != 'embedding'}
            payload['source_file'] = filename
            points.append(PointStruct(id=chunk_id, vector=vector, payload=payload))
            if len(points) >= config.BATCH_SIZE:
                self.client.upsert(collection_name=config.COLLECTION_NAME, points=points, wait=True)
                self.total += len(points)
                print(f"  Uploaded {self.total} chunks...")
                points = []
        if points:
            self.client.upsert(collection_name=config.COLLECTION_NAME, points=points, wait=True)
            self.total += len(points)