import re
import os
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from models.schemas import ChatRequest, ChatResponse, NoteReference
import json

router = APIRouter(prefix="/chat", tags=["chat"])


def extract_new_note(text: str) -> tuple[str, str | None]:
    """Extracts <nova_nota>Title</nova_nota> tag from LLM response."""
    match = re.search(r"<nova_nota>(.*?)</nova_nota>", text)
    if match:
        title = match.group(1).strip()
        clean = text.replace(match.group(0), "").strip()
        return clean, title
    return text, None


def maybe_create_note(vault_path: str | None, title: str, conversation_excerpt: str):
    if not vault_path or not os.path.exists(vault_path):
        return
    safe_title = re.sub(r'[<>:"/\\|?*]', "", title)
    note_path = os.path.join(vault_path, f"{safe_title}.md")
    if not os.path.exists(note_path):
        with open(note_path, "w", encoding="utf-8") as f:
            f.write(f"# {title}\n\n_{conversation_excerpt}_\n")


@router.post("/stream")
async def chat_stream(req: ChatRequest, request: Request):
    vs = request.app.state.vector_store
    memory = request.app.state.memory
    llm = request.app.state.llm
    watcher = request.app.state.watcher

    # Get or create conversation
    cid = req.conversation_id or memory.new_conversation()
    history = memory.load(cid)

    # RAG: retrieve relevant notes
    references = vs.search(req.message, top_k=5)

    # Save user message
    memory.append(cid, "user", req.message)

    async def event_stream():
        # Send metadata first
        meta = {
            "conversation_id": cid,
            "references": references,
        }
        yield f"data: {json.dumps({'type': 'meta', **meta})}\n\n"

        # Stream LLM response
        full_response = ""
        async for chunk in llm.stream_chat(req.message, references, history, req.deep_think):
            full_response += chunk
            yield f"data: {json.dumps({'type': 'chunk', 'content': chunk})}\n\n"

        # Post-process: extract new note directive
        clean_response, new_note_title = extract_new_note(full_response)
        if new_note_title and watcher.vault_path:
            maybe_create_note(watcher.vault_path, new_note_title, req.message[:200])

        # Save assistant response
        memory.append(cid, "assistant", clean_response)

        yield f"data: {json.dumps({'type': 'done', 'new_note': new_note_title})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@router.get("/conversations")
async def list_conversations(request: Request):
    memory = request.app.state.memory
    return memory.list_conversations()


@router.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str, request: Request):
    memory = request.app.state.memory
    history = memory.load(conversation_id)
    return {"id": conversation_id, "history": history}
