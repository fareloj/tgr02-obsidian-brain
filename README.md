# VaultMind

> Seu segundo cérebro inteligente, conectado ao seu Obsidian.

O **VaultMind** é um aplicativo desktop que conecta suas notas do Obsidian a uma inteligência artificial que entende seu contexto. Usando um backend FastAPI com ChromaDB e um frontend em Next.js empacotado com Electron, o VaultMind permite buscar, conversar e explorar os seus próprios arquivos — tudo rodando localmente.

<img width="1381" height="832" alt="VaultMind" src="https://github.com/user-attachments/assets/0c0f06b2-5a87-4086-9e92-c0d39bdda678" />

---

## Funcionalidades

- **Integração com Obsidian:** Monitora e indexa seu Vault automaticamente em tempo real via watchdog.
- **Chat Contextual com RAG:** Converse com o Gemini 3.5 Flash sobre as suas anotações — respostas baseadas nos seus próprios dados com citações `[[Nota]]`.
- **Busca Semântica:** Encontre notas por significado, não por palavras-chave exatas.
- **App Desktop:** Empacotado com Electron — abre backend e frontend com um clique.
- **Modo Pensamento Profundo:** Análise mais densa de conexões e padrões entre notas.
- **Memória de Conversas:** Histórico persistente de todas as suas sessões.

---

## Screenshots

| Explorar Vault | Notas Recentes | Projetos |
|:-:|:-:|:-:|
| ![Chat](<!-- SCREENSHOT_CHAT_URL -->) | ![Notas](<!-- SCREENSHOT_NOTAS_URL -->) | ![Projetos](<!-- SCREENSHOT_PROJETOS_URL -->) |

---

## Tech Stack

### Desktop
- **Electron** v33 — empacota o app e orquestra backend + frontend

### Frontend
- **Framework:** Next.js 16 (React 19)
- **Estilização:** Tailwind CSS v4 — design system *Slate & Sky*
- **Gerenciador de Pacotes:** `pnpm`

### Backend
- **Framework API:** FastAPI + Uvicorn
- **Banco de Dados Vetorial:** ChromaDB (local)
- **Embeddings:** `sentence-transformers` (`all-MiniLM-L6-v2`) — GPU via CUDA
- **LLM:** Google Gemini 3.5 Flash (via Google AI Studio)
- **Monitoramento de Arquivos:** `watchdog`

---

## Getting Started

### Pré-requisitos
- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v9+
- [Python](https://www.python.org/) v3.10+
- Chave de API do [Google AI Studio](https://aistudio.google.com/)

### Configuração do Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # edite com sua chave
```

Variáveis de ambiente (`backend/.env`):

| Variável | Descrição |
|---|---|
| `GOOGLE_API_KEY` | Chave de API do Google AI Studio |
| `LLM_MODEL` | Modelo a usar (padrão: `gemini-3.5-flash`) |
| `OBSIDIAN_VAULT_PATH` | Caminho absoluto para o seu Vault |
| `CHROMA_PERSIST_DIR` | Diretório de persistência do ChromaDB |
| `CORS_ORIGIN` | URL do frontend (padrão: `http://localhost:3000`) |

### Rodando com Electron (recomendado)

```bash
cd electron
npm install
.\node_modules\electron\dist\electron.exe .
```

O Electron sobe o backend (porta 8000) e o frontend (porta 3000) automaticamente.

### Rodando manualmente

**Backend:**
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
pnpm install
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/health` | Status do servidor |
| `POST` | `/chat/stream` | Chat com streaming SSE |
| `POST` | `/vault/sync` | Indexa o vault e inicia watcher |
| `GET` | `/vault/status` | Status da indexação |
| `GET` | `/chat/conversations` | Lista histórico de conversas |
