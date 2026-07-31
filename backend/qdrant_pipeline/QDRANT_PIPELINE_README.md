#  Documentation - Qdrant Pipeline

```bash
cd ~/projects/legal-research-engine

# Qdrant Vector Database Pipeline - Legal Research Engine

## Overview
This pipeline stores legal document embeddings (judgments, statutes, constitutional articles) into Qdrant for semantic retrieval.

### Quick Stats
- **4,942 vectors** stored
- **384-dimension** embeddings (configurable)
- **430 JSON files** processed
- **Cosine similarity** for search

---

## Quick Start

```bash
# 1. Start Qdrant
docker compose up -d

# 2. Run pipeline
python backend/qdrant_pipeline/run.py

# 3. Verify
cd backend && python qdrant_pipeline/verify.py
```

---

## File Structure

```
backend/qdrant_pipeline/
├── client.py          # Qdrant connection manager
├── uploader.py        # Embedding & upload logic
├── config.py          # Configuration settings
├── run.py             # Main pipeline runner
├── verify.py          # Verification script
```

---

## Configuration

### `config.py`

```python
# Qdrant Connection
QDRANT_HOST = "localhost"
QDRANT_PORT = 6333

# Collection
COLLECTION_NAME = "legal_chunks_test"
VECTOR_SIZE = 384
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

# Pipeline
BATCH_SIZE = 100

# Data Paths
DATA_PATHS = [
    "data/processed_statutes",
    "data/processed_articles", 
    "data/judgments",
    "data/chunks"
]
```

### Model Options

| Model | Vector Size | Speed | Accuracy |
|-------|-------------|-------|----------|
| `all-MiniLM-L6-v2` | 384 | ⚡ Fast | Good |
| `all-mpnet-base-v2` | 768 | Medium | Better |
| `BAAI/bge-m3` | 1024 | Slow | Best |

---

## Usage

### Run Pipeline
```bash
cd ~/projects/legal-research-engine
python backend/qdrant_pipeline/run.py
```

### Verify Upload
```bash
cd backend
python qdrant_pipeline/verify.py
```

### Search Test
```bash
cd backend
python qdrant_pipeline/test_search.py
```

### Check Collection
```bash
curl http://localhost:6333/collections/legal_chunks_test
```

---

## Change Vector Dimensions

### To change from 384 to 1024 (BAAI/bge-m3):

```bash
# 1. Update config
sed -i 's/MODEL_NAME = ".*"/MODEL_NAME = "BAAI\/bge-m3"/' backend/qdrant_pipeline/config.py
sed -i 's/VECTOR_SIZE = .*/VECTOR_SIZE = 1024/' backend/qdrant_pipeline/config.py

# 2. Delete old collection
curl -X DELETE http://localhost:6333/collections/legal_chunks_test

# 3. Re-run pipeline
python backend/qdrant_pipeline/run.py
```

### Quick Dimension Change Commands

```bash
# To 768 (all-mpnet-base-v2)
sed -i 's/MODEL_NAME = ".*"/MODEL_NAME = "sentence-transformers\/all-mpnet-base-v2"/' backend/qdrant_pipeline/config.py
sed -i 's/VECTOR_SIZE = .*/VECTOR_SIZE = 768/' backend/qdrant_pipeline/config.py
curl -X DELETE http://localhost:6333/collections/legal_chunks_test
python backend/qdrant_pipeline/run.py

# Back to 384 (all-MiniLM-L6-v2)
sed -i 's/MODEL_NAME = ".*"/MODEL_NAME = "sentence-transformers\/all-MiniLM-L6-v2"/' backend/qdrant_pipeline/config.py
sed -i 's/VECTOR_SIZE = .*/VECTOR_SIZE = 384/' backend/qdrant_pipeline/config.py
curl -X DELETE http://localhost:6333/collections/legal_chunks_test
python backend/qdrant_pipeline/run.py
```


Expected Output:
```
============================================================
QDRANT PIPELINE VERIFICATION
============================================================

[1] Collection Check
    Collection: legal_chunks_test
    Status: green

[2] Vector Count
    Total vectors: 4942

[3] Vector Dimensions
    Vector size: 384

[4] Distance Metric
    Distance: Cosine

[5] Sample Points
    Point 1: ID: abc123...
    Source: Article_12_in_Constitution_of_India.json
    Type: Constitution

✅ All checks passed!
```

---

## Troubleshooting

### Error: Dimension Mismatch
```
Vector dimension error: expected dim: 1024, got 384
```
**Solution:**
```bash
curl -X DELETE http://localhost:6333/collections/legal_chunks_test
python backend/qdrant_pipeline/run.py
```

### Error: Module Not Found
```
ModuleNotFoundError: No module named 'qdrant_pipeline'
```
**Solution:**
```bash
cd ~/projects/legal-research-engine/backend
python qdrant_pipeline/run.py
```

### Error: Connection Refused
```
ConnectionRefusedError
```
**Solution:**
```bash
docker compose up -d
docker ps | grep qdrant
```

---

## Dependencies

### Python Packages

```txt
qdrant-client>=1.9.0
sentence-transformers>=2.2.2
torch>=2.0.0
transformers>=4.30.0
numpy>=1.24.0
tqdm>=4.65.0
```

## Success Criteria

| Criteria | Status |
|----------|--------|
| All chunks stored in Qdrant | ✅ 4,942 vectors |
| Each point has unique ID | ✅ UUID generated |
| Each point has embedding vector | ✅ 384-dim |
| Complete metadata payload | ✅ All fields preserved |
| Collection ready for search | ✅ Semantic search working |

---

## Commands Quick Reference

```bash
# Start Qdrant
docker compose up -d

# Stop Qdrant
docker compose down

# Run pipeline
python backend/qdrant_pipeline/run.py

# Check collection
curl http://localhost:6333/collections/legal_chunks_test

# Delete collection
curl -X DELETE http://localhost:6333/collections/legal_chunks_test

# View Qdrant logs
docker logs legal-research-qdrant

# Check vector count
curl http://localhost:6333/collections/legal_chunks_test | grep points_count
```

---

## Support

For issues:
1. Check Qdrant logs: `docker logs legal-research-qdrant`
2. Run verification: `python qdrant_pipeline/verify.py`
3. Check collection: `curl http://localhost:6333/collections`

---
