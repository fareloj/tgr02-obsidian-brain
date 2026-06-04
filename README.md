# VaultMind

> Seu segundo cérebro inteligente, conectado ao seu Obsidian.

O **VaultMind** é um aplicativo que conecta suas notas do Obsidian a uma inteligência artificial que entende seu contexto. Usando um backend FastAPI com ChromaDB e um frontend rápido em Next.js, o VaultMind permite buscar, conversar e explorar os seus próprios arquivos.

---

## Funcionalidades

- **Integração com Obsidian:** Monitora e indexa seu Vault do Obsidian automaticamente.
- **Chat Contextual:** Converse com o modelo sobre as suas anotações com respostas baseadas nos seus próprios dados.
- **Busca Rápida:** Encontre notas facilmente apertando `⌘K` / `Ctrl+K`.
- **Navegação Intuitiva:** Visualize anotações, conversas e projetos através de uma interface desenhada com Tailwind CSS.

---

## Tech Stack

### Frontend
- **Framework:** Next.js 16 (React 19)
- **Estilização:** Tailwind CSS (v4)
- **Gerenciador de Pacotes:** `pnpm`

### Backend
- **Framework API:** FastAPI (`uvicorn` / `python`)
- **Banco de Dados Vetorial:** ChromaDB
- **Embeddings:** `sentence-transformers`
- **Integração de LLM:** OpenAI / OpenRouter
- **Monitoramento de Arquivos:** `watchdog`

---

## Getting Started

Siga as instruções abaixo para configurar o ambiente de desenvolvimento na sua máquina.

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/) (v9+)
- [Python](https://www.python.org/) (v3.10+)

### Configuração (Variáveis de Ambiente)

No diretório `backend`, crie um arquivo `.env` baseando-se no `.env.example`:

| Variável | Descrição | Exemplo de Placeholder |
| -------- | --------- | ---------------------- |
| `OPENROUTER_API_KEY` | Chave de API para o OpenRouter. | `sk-or-your-api-key-here` |
| `OPENROUTER_BASE_URL`| URL base da API. | `https://openrouter.ai/api/v1` |
| `LLM_MODEL` | Modelo a ser utilizado (ex: Llama 3). | `meta-llama/llama-3.3-70b-instruct` |
| `OBSIDIAN_VAULT_PATH`| Caminho absoluto para o seu Vault no Obsidian. | `C:/Caminho/Para/Seu/Vault` |
| `CHROMA_PERSIST_DIR` | Diretório de persistência do ChromaDB. | `./data/chroma` |
| `CORS_ORIGIN` | URL do frontend permitida (CORS). | `http://localhost:3000` |

### Backend

1. Entre na pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências usando `pip`:
   ```bash
   pip install -r requirements.txt
   ```
3. Inicie a API com Uvicorn (ela vai rodar na porta 8000 por padrão):
   ```bash
   fastapi run main.py
   ```

### Frontend

1. Entre na pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências via `pnpm`:
   ```bash
   pnpm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm dev
   ```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o aplicativo em funcionamento.
