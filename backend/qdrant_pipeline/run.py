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