QDRANT_HOST = "localhost"
QDRANT_PORT = 6333
COLLECTION_NAME = "legal_chunks"
MODEL_NAME = "BAAI/bge-m3"
VECTOR_SIZE = 1024
BATCH_SIZE = 100
DATA_PATHS = [
    "data/processed_statutes",
    "data/processed_articles",
    "data/judgments",
    "data/chunks"
]