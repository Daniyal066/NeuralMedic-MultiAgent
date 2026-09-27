import os
import glob
from pypdf import PdfReader
import chromadb
from chromadb.utils import embedding_functions

# Get absolute path to the docs/context_pack directory
DOCS_DIR = os.getenv("DOCS_DIR", os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "docs", "context_pack")))

# ChromaDB connection config
CHROMA_HOST = os.getenv("CHROMA_HOST", "localhost")
CHROMA_PORT = int(os.getenv("CHROMA_PORT", "8003"))

def main():
    print(f"Connecting to Chroma DB at {CHROMA_HOST}:{CHROMA_PORT}")
    client = chromadb.HttpClient(host=CHROMA_HOST, port=CHROMA_PORT)
    
    emb_func = embedding_functions.DefaultEmbeddingFunction()
    
    collection_name = "medical_context"
    try:
        collection = client.get_or_create_collection(
            name=collection_name,
            embedding_function=emb_func,
            metadata={"hnsw:space": "cosine"}
        )
    except Exception as e:
        print(f"Error connecting to Chroma DB or creating collection: {e}")
        return

    pdf_files = glob.glob(os.path.join(DOCS_DIR, "*.pdf"))
    if not pdf_files:
        print(f"No PDF files found in {DOCS_DIR}")
        return

    for file_path in pdf_files:
        filename = os.path.basename(file_path)
        print(f"Processing {filename}...")
        
        try:
            reader = PdfReader(file_path)
            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if text and text.strip():
                    chunk_id = f"{filename}_page_{i+1}"
                    
                    # Upsert (adds if not exists, updates if exists)
                    collection.upsert(
                        documents=[text],
                        metadatas=[{"source": filename, "page": i+1}],
                        ids=[chunk_id]
                    )
            print(f"Successfully ingested {filename}")
        except Exception as e:
            print(f"Failed to process {filename}: {e}")

    print("Ingestion complete.")
    print(f"Collection '{collection_name}' currently has {collection.count()} items.")

if __name__ == "__main__":
    main()
