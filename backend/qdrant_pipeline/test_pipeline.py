"""
test_pipeline.py - Verify Qdrant Collection Data

This script connects to Qdrant and displays:
1. Collection name and total vector count
2. Sample points with their metadata
3. Preview of stored text content

Purpose: Quick validation that data was uploaded correctly
"""
import sys
sys.path.insert(0, '.')
from qdrant_pipeline.client import QdrantManager
import qdrant_pipeline.config as config

qdrant = QdrantManager()
print(f"Collection: {config.COLLECTION_NAME}")
print(f"Total vectors: {qdrant.get_count()}")

# Get sample
sample = qdrant.client.scroll(
    collection_name=config.COLLECTION_NAME,
    limit=3,
    with_payload=True,
    with_vectors=False
)

for point in sample[0]:
    print(f"\nID: {point.id}")
    print(f"Source: {point.payload.get('source_file', 'Unknown')}")
    print(f"Document type: {point.payload.get('document_type', 'Unknown')}")
    text_preview = point.payload.get('text', '')[:150]
    if text_preview:
        print(f"Text preview: {text_preview}...")

qdrant.close()