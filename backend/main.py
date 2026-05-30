import os
import logging
from contextlib import asynccontextmanager
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services.vector_store import VectorStore
from services.obsidian_watcher import VaultWatcher
from services.llm import LLMService
from services.memory import ConversationMemory
from routes.chat import router as chat_router
from routes.vault import router as vault_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s — %(message)s")
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Init services
    vs = VectorStore(persist_dir=os.getenv("CHROMA_PERSIST_DIR", "./data/chroma"))
    watcher = VaultWatcher(vs)
    llm = LLMService()
    memory = ConversationMemory()

    app.state.vector_store = vs
    app.state.watcher = watcher
    app.state.llm = llm
    app.state.memory = memory

    # Auto-start watcher if vault path is configured
    vault_path = os.getenv("OBSIDIAN_VAULT_PATH", "")
    if vault_path and os.path.exists(vault_path):
        logger.info(f"Auto-indexing vault: {vault_path}")
        watcher.full_index(vault_path)
        watcher.start(vault_path)

    yield

    watcher.stop()
    logger.info("Watcher stopped.")


app = FastAPI(title="Obsidian Brain API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGIN", "http://localhost:3000"), "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(vault_router)


@app.get("/health")
async def health():
    return {"status": "ok"}
