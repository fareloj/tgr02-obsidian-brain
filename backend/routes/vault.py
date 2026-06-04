import os
from fastapi import APIRouter, Request, HTTPException
from models.schemas import SyncStatus, SyncRequest

router = APIRouter(prefix="/vault", tags=["vault"])


@router.post("/sync")
async def sync_vault(req: SyncRequest, request: Request):
    watcher = request.app.state.watcher

    if not os.path.exists(req.vault_path):
        raise HTTPException(status_code=400, detail=f"Vault path not found: {req.vault_path}")

    # Full reindex
    total = watcher.full_index(req.vault_path)

    # Start watcher
    watcher.start(req.vault_path)

    # Persist vault path to env for next restart
    _write_vault_path(req.vault_path)

    return {
        "message": f"Indexed {total} notes. Watcher started.",
        "vault_path": req.vault_path,
        "total_notes": total,
    }


@router.get("/status", response_model=SyncStatus)
async def vault_status(request: Request):
    vs = request.app.state.vector_store
    watcher = request.app.state.watcher
    return SyncStatus(
        total_notes=len(vs.list_indexed_paths()),
        indexed_notes=vs.count(),
        vault_path=watcher.vault_path or "",
        is_watching=watcher.is_alive(),
    )


def _write_vault_path(path: str):
    """Persist vault path to .env so it survives restarts."""
    env_file = ".env"
    lines = []
    found = False
    if os.path.exists(env_file):
        with open(env_file, "r") as f:
            lines = f.readlines()
        for i, line in enumerate(lines):
            if line.startswith("OBSIDIAN_VAULT_PATH="):
                lines[i] = f"OBSIDIAN_VAULT_PATH={path}\n"
                found = True
                break
    if not found:
        lines.append(f"OBSIDIAN_VAULT_PATH={path}\n")
    with open(env_file, "w") as f:
        f.writelines(lines)
