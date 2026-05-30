from pydantic import BaseModel
from typing import Optional


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    deep_think: bool = False


class NoteReference(BaseModel):
    title: str
    path: str
    excerpt: str
    score: float


class ChatResponse(BaseModel):
    answer: str
    references: list[NoteReference]
    conversation_id: str
    new_note_created: Optional[str] = None


class SyncStatus(BaseModel):
    total_notes: int
    indexed_notes: int
    vault_path: str
    is_watching: bool


class SyncRequest(BaseModel):
    vault_path: str
    force_reindex: bool = False
