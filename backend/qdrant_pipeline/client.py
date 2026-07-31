from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams
import config

class QdrantManager:
    def __init__(self):
        self.client = QdrantClient(host=config.QDRANT_HOST, port=config.QDRANT_PORT)
    
    def create_collection(self):
        collections = self.client.get_collections()
        names = [c.name for c in collections.collections]
        if config.COLLECTION_NAME not in names:
            self.client.create_collection(
                collection_name=config.COLLECTION_NAME,
                vectors_config=VectorParams(size=config.VECTOR_SIZE, distance=Distance.COSINE)
            )
            print(f"Collection '{config.COLLECTION_NAME}' created")
        else:
            print(f"Collection '{config.COLLECTION_NAME}' already exists")
    
    def get_count(self):
        info = self.client.get_collection(config.COLLECTION_NAME)
        return info.points_count
    
    def close(self):
        self.client.close()