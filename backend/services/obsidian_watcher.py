import os
import logging
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

logger = logging.getLogger(__name__)


def read_note(path: str) -> tuple[str, str]:
    """Returns (title, content). Title = filename without extension."""
    title = Path(path).stem
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    return title, content


class VaultEventHandler(FileSystemEventHandler):
    def __init__(self, vector_store):
        self.vs = vector_store

    def _is_md(self, path: str) -> bool:
        return path.endswith(".md")

    def on_created(self, event):
        if not event.is_directory and self._is_md(event.src_path):
            try:
                title, content = read_note(event.src_path)
                self.vs.index_note(event.src_path, title, content)
                logger.info(f"Indexed new note: {title}")
            except Exception as e:
                logger.error(f"Error indexing {event.src_path}: {e}")

    def on_modified(self, event):
        if not event.is_directory and self._is_md(event.src_path):
            try:
                title, content = read_note(event.src_path)
                self.vs.index_note(event.src_path, title, content)
                logger.info(f"Re-indexed note: {title}")
            except Exception as e:
                logger.error(f"Error re-indexing {event.src_path}: {e}")

    def on_deleted(self, event):
        if not event.is_directory and self._is_md(event.src_path):
            self.vs.delete_note(event.src_path)
            logger.info(f"Removed note from index: {event.src_path}")


class VaultWatcher:
    def __init__(self, vector_store):
        self.vs = vector_store
        self.observer: Observer | None = None
        self.vault_path: str | None = None

    def start(self, vault_path: str):
        if self.observer and self.observer.is_alive():
            self.observer.stop()
            self.observer.join()

        self.vault_path = vault_path
        handler = VaultEventHandler(self.vs)
        self.observer = Observer()
        self.observer.schedule(handler, vault_path, recursive=True)
        self.observer.start()
        logger.info(f"Watching vault: {vault_path}")

    def stop(self):
        if self.observer:
            self.observer.stop()
            self.observer.join()

    def is_alive(self) -> bool:
        return self.observer is not None and self.observer.is_alive()

    def full_index(self, vault_path: str) -> int:
        """Index all .md files in vault. Returns count of notes indexed."""
        total = 0
        for root, _, files in os.walk(vault_path):
            # Skip .obsidian config folder
            if ".obsidian" in root:
                continue
            for fname in files:
                if fname.endswith(".md"):
                    fpath = os.path.join(root, fname)
                    try:
                        title, content = read_note(fpath)
                        self.vs.index_note(fpath, title, content)
                        total += 1
                    except Exception as e:
                        logger.error(f"Error indexing {fpath}: {e}")
        return total
