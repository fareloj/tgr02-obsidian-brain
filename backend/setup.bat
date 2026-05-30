@echo off
echo === Obsidian Brain - Backend Setup ===

python -m venv venv
call venv\Scripts\activate

pip install --upgrade pip
pip install -r requirements.txt

if not exist .env (
    copy .env.example .env
    echo .env criado a partir do .env.example - configure sua OPENROUTER_API_KEY
)

mkdir data\chroma 2>nul
mkdir data\conversations 2>nul

echo.
echo Setup concluido! Para rodar:
echo   call venv\Scripts\activate
echo   uvicorn main:app --reload --port 8000
