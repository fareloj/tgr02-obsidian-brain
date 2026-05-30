import os
from openai import AsyncOpenAI
from typing import AsyncIterator

SYSTEM_PROMPT = """Você é um segundo cérebro pessoal e assistente inteligente. Você tem acesso às notas pessoais do usuário no Obsidian e usa esse conhecimento para dar respostas profundamente contextualizadas.

Diretrizes:
- Sempre cite as notas relevantes usando o formato [[Título da Nota]] quando usar informação delas
- Seja direto, pessoal e útil — você conhece o usuário através das notas dele
- Se não encontrar informação relevante nas notas, diga claramente e responda com conhecimento geral
- Em modo "pensamento profundo", analise conexões entre notas, padrões e insights que o usuário pode não ter percebido
- Responda sempre em português do Brasil
- Quando criar uma nota nova, informe o título entre <nova_nota>Título</nova_nota>"""

DEEP_THINK_ADDITION = """

Modo Pensamento Profundo ativo: Analise as notas com mais profundidade. Busque padrões, contradições, conexões não óbvias e insights. Seja mais reflexivo e detalhado."""


def build_context(references: list[dict]) -> str:
    if not references:
        return "Nenhuma nota relevante encontrada no vault."
    parts = ["=== NOTAS RELEVANTES DO VAULT ===\n"]
    for ref in references:
        parts.append(f"[[{ref['title']}]] (relevância: {ref['score']:.0%})\n{ref['excerpt']}\n---")
    return "\n".join(parts)


class LLMService:
    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=os.getenv("OPENROUTER_API_KEY", ""),
            base_url=os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1"),
            default_headers={"HTTP-Referer": "http://localhost:3000", "X-Title": "Obsidian Brain"},
        )
        self.model = os.getenv("LLM_MODEL", "meta-llama/llama-3.3-70b-instruct")

    def _system(self, deep_think: bool) -> str:
        prompt = SYSTEM_PROMPT
        if deep_think:
            prompt += DEEP_THINK_ADDITION
        return prompt

    async def chat(
        self,
        message: str,
        references: list[dict],
        history: list[dict],
        deep_think: bool = False,
    ) -> str:
        context = build_context(references)
        messages = [
            {"role": "system", "content": self._system(deep_think)},
            {"role": "user", "content": f"{context}\n\n=== PERGUNTA ===\n{message}"},
        ]
        # Inject last 6 turns of history before current message
        if history:
            tail = history[-6:]
            messages = [messages[0]] + tail + [messages[-1]]

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            max_tokens=2048 if not deep_think else 4096,
            temperature=0.7,
        )
        return response.choices[0].message.content or ""

    async def stream_chat(
        self,
        message: str,
        references: list[dict],
        history: list[dict],
        deep_think: bool = False,
    ) -> AsyncIterator[str]:
        context = build_context(references)
        messages = [
            {"role": "system", "content": self._system(deep_think)},
            {"role": "user", "content": f"{context}\n\n=== PERGUNTA ===\n{message}"},
        ]
        if history:
            tail = history[-6:]
            messages = [messages[0]] + tail + [messages[-1]]

        stream = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            max_tokens=2048 if not deep_think else 4096,
            temperature=0.7,
            stream=True,
        )
        async for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                yield delta
