import json
import os
import uuid
from datetime import datetime
from pathlib import Path


MEMORY_DIR = "./data/conversations"


class ConversationMemory:
    def __init__(self):
        os.makedirs(MEMORY_DIR, exist_ok=True)

    def _path(self, conversation_id: str) -> str:
        return os.path.join(MEMORY_DIR, f"{conversation_id}.json")

    def new_conversation(self) -> str:
        cid = str(uuid.uuid4())[:8]
        self._save(cid, [])
        return cid

    def _save(self, conversation_id: str, history: list):
        with open(self._path(conversation_id), "w", encoding="utf-8") as f:
            json.dump({"id": conversation_id, "updated": datetime.now().isoformat(), "history": history}, f, ensure_ascii=False, indent=2)

    def load(self, conversation_id: str) -> list[dict]:
        path = self._path(conversation_id)
        if not os.path.exists(path):
            return []
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data.get("history", [])

    def append(self, conversation_id: str, role: str, content: str):
        history = self.load(conversation_id)
        history.append({"role": role, "content": content})
        self._save(conversation_id, history)

    def list_conversations(self) -> list[dict]:
        convs = []
        for fname in sorted(Path(MEMORY_DIR).glob("*.json"), key=os.path.getmtime, reverse=True):
            with open(fname, "r", encoding="utf-8") as f:
                data = json.load(f)
            history = data.get("history", [])
            if history:
                convs.append({
                    "id": data["id"],
                    "updated": data.get("updated"),
                    "preview": history[0]["content"][:80],
                    "turns": len(history) // 2,
                })
        return convs
