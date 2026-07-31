"""
config.py - Qdrant Pipeline Settings

Stores all configuration for the Qdrant upload pipeline.

Usage:
    import config
    print(config.MODEL_NAME)  # "BAAI/bge-m3"
    print(config.VECTOR_SIZE) # 1024

Settings:
    QDRANT_HOST     - Qdrant server address
    QDRANT_PORT     - Qdrant server port
    COLLECTION_NAME - Vector collection name
    MODEL_NAME      - Embedding model from HuggingFace
    VECTOR_SIZE     - Embedding dimension
    BATCH_SIZE      - Chunks per upload batch
    DATA_PATHS      - Folders to scan for JSON files
"""
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