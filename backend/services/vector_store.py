import os
import hashlib
from pathlib import Path
from typing import Optional

import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer

EMBED_MODEL = "all-MiniLM-L6-v2"
COLLECTION_NAME = "obsidian_notes"
CHUNK_SIZE = 800
CHUNK_OVERLAP = 100


class VectorStore:
    def __init__(self, persist_dir: str = "./data/chroma"):
        os.makedirs(persist_dir, exist_ok=True)
        self.client = chromadb.PersistentClient(
            path=persist_dir,
            settings=Settings(anonymized_telemetry=False),
        )
        self.collection = self.client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"},
        )
        self.embedder = SentenceTransformer(EMBED_MODEL)

    def _chunk_text(self, text: str) -> list[str]:
        words = text.split()
        chunks = []
        start = 0
        while start < len(words):
            end = start + CHUNK_SIZE
            chunk = " ".join(words[start:end])
            chunks.append(chunk)
            start += CHUNK_SIZE - CHUNK_OVERLAP
        return chunks

    def _note_hash(self, content: str) -> str:
        return hashlib.md5(content.encode()).hexdigest()

    def index_note(self, path: str, title: str, content: str) -> int:
        note_hash = self._note_hash(content)
        # Remove existing chunks for this note
        existing = self.collection.get(where={"source_path": path})
        if existing["ids"]:
            # Check if content changed
            if existing["metadatas"][0].get("hash") == note_hash:
                return 0
            self.collection.delete(ids=existing["ids"])

        chunks = self._chunk_text(content)
        if not chunks:
            return 0

        embeddings = self.embedder.encode(chunks).tolist()
        ids = [f"{path}::{i}" for i in range(len(chunks))]
        metadatas = [
            {
                "source_path": path,
                "title": title,
                "chunk_index": i,
                "hash": note_hash,
            }
            for i in range(len(chunks))
        ]

        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=chunks,
            metadatas=metadatas,
        )
        return len(chunks)

    def delete_note(self, path: str):
        existing = self.collection.get(where={"source_path": path})
        if existing["ids"]:
            self.collection.delete(ids=existing["ids"])

    def search(self, query: str, top_k: int = 5) -> list[dict]:
        if self.collection.count() == 0:
            return []
        query_embedding = self.embedder.encode([query]).tolist()
        results = self.collection.query(
            query_embeddings=query_embedding,
            n_results=min(top_k, self.collection.count()),
            include=["documents", "metadatas", "distances"],
        )
        hits = []
        seen_paths = set()
        for doc, meta, dist in zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0],
        ):
            path = meta["source_path"]
            # Deduplicate: keep only best chunk per note
            if path in seen_paths:
                continue
            seen_paths.add(path)
            hits.append(
                {
                    "title": meta["title"],
                    "path": path,
                    "excerpt": doc[:400],
                    "score": 1 - dist,  # cosine similarity
                }
            )
        return hits

    def count(self) -> int:
        return self.collection.count()

    def list_indexed_paths(self) -> set[str]:
        all_items = self.collection.get(include=["metadatas"])
        return {m["source_path"] for m in all_items["metadatas"]}
