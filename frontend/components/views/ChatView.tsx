"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "../Icon";
import { streamChat, type NoteReference, type ChatMessage } from "../../lib/api";

type Msg = ChatMessage & { references?: NoteReference[]; streaming?: boolean };

const SUGGESTIONS = [
  {
    icon: "summary",
    title: "Resumir minha semana",
    desc: "Sintetize as notas dos últimos 7 dias.",
    prompt: "Resuma minhas notas desta semana e destaque os 3 temas principais.",
  },
  {
    icon: "link",
    title: "Conectar ideias",
    desc: "Descubra links entre temas distintos.",
    prompt:
      "Encontre conexões inesperadas entre minhas notas sobre criatividade e produtividade.",
  },
  {
    icon: "search",
    title: "Encontrar uma nota",
    desc: "Busque por significado, não palavras-chave.",
    prompt:
      "Estou procurando uma anotação sobre arquitetura de informação que fiz no mês passado.",
  },
  {
    icon: "spark",
    title: "Iniciar um projeto",
    desc: "Transforme notas soltas em um plano.",
    prompt: "Me ajude a estruturar um novo projeto a partir das minhas anotações de pesquisa.",
  },
];

const SCOPES = [
  { label: "Vault completo", icon: "network" },
  { label: "Apenas notas recentes", icon: "history" },
  { label: "Projeto: Roadmap Q3", icon: "folder" },
];

/** Renders assistant text, turning [[Nota]] citations into styled chips. */
function renderContent(text: string) {
  const parts = text.split(/(\[\[[^\]]+\]\])/g);
  return parts.map((part, i) => {
    const m = part.match(/^\[\[([^\]]+)\]\]$/);
    if (m) {
      return (
        <span
          key={i}
          className="inline-flex items-center gap-1 align-baseline font-ui text-[13px] font-medium text-on-primary-container bg-primary-container rounded-md px-1.5 py-0.5 mx-0.5"
        >
          <Icon name="doc" size={12} />
          {m[1]}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function Avatar() {
  return (
    <div className="w-9 h-9 rounded-[0.8rem] bg-inverse-surface grid place-items-center flex-shrink-0 mt-0.5">
      <Icon name="network" size={18} className="text-inverse-on-surface" />
    </div>
  );
}

export function ChatView({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [deepThink, setDeepThink] = useState(false);
  const [scope, setScope] = useState(SCOPES[0].label);
  const [scopeOpen, setScopeOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasMessages = messages.length > 0;

  const scrollDown = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [input]);

  function send() {
    const text = input.trim();
    if (!text || busy) return;

    setInput("");
    setBusy(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
      { role: "assistant", content: "", streaming: true },
    ]);
    scrollDown();

    streamChat(
      { message: text, conversationId, deepThink },
      {
        onMeta: ({ conversation_id, references }) => {
          setConversationId(conversation_id);
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === "assistant") last.references = references;
            return next;
          });
        },
        onChunk: (chunk) => {
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === "assistant") last.content += chunk;
            return next;
          });
          scrollDown();
        },
        onDone: () => {
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === "assistant") last.streaming = false;
            return next;
          });
          setBusy(false);
        },
        onError: (err) => {
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === "assistant") {
              last.streaming = false;
              last.content =
                last.content ||
                `⚠️ Não consegui falar com o backend (${err.message}). Confira se o servidor está rodando em :8000.`;
            }
            return next;
          });
          setBusy(false);
        },
      }
    );
  }

  return (
    <section className="view-enter flex flex-col flex-1 min-h-0 relative z-10">
      {/* Top bar */}
      <header className="h-16 flex-shrink-0 flex items-center gap-3 px-4 md:px-8">
        <button
          onClick={onOpenSidebar}
          className="md:hidden w-10 h-10 grid place-items-center rounded-full text-on-surface-variant hover:bg-container-high"
        >
          <Icon name="menu" size={22} />
        </button>
        <div className="hidden md:flex items-center gap-2 text-on-surface-variant">
          <Icon name="network" size={16} />
          <span className="font-label text-[11px] tracking-[0.12em] uppercase">
            Explorando · {scope}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <button className="w-10 h-10 grid place-items-center rounded-full text-on-surface-variant hover:bg-container-high transition-colors" title="Histórico">
            <Icon name="history" size={20} />
          </button>
          <button className="w-10 h-10 grid place-items-center rounded-full text-on-surface-variant hover:bg-container-high transition-colors" title="Ajuda">
            <Icon name="help" size={20} />
          </button>
        </div>
      </header>

      {/* Scroll region */}
      <div ref={scrollRef} className="flex-1 min-h-0 flex flex-col items-center overflow-y-auto">
        <div className="w-full max-w-[780px] px-6 flex-1 flex flex-col">
          {!hasMessages ? (
            <section className="flex-1 flex flex-col items-center justify-center text-center py-10">
              <div
                className="rise w-[68px] h-[68px] rounded-[1.4rem] bg-container-lowest border border-outline-variant/70 grid place-items-center shadow-[0_18px_40px_-22px_rgba(40,44,44,.4)] mb-8"
                style={{ animationDelay: ".04s" }}
              >
                <Icon name="network" size={32} className="text-primary" />
              </div>
              <h2
                className="rise font-headline text-[34px] md:text-[40px] leading-[1.1] font-semibold tracking-[-0.02em] text-on-surface max-w-[16ch]"
                style={{ animationDelay: ".1s" }}
              >
                O que você quer explorar no seu Vault?
              </h2>
              <p
                className="rise font-body text-[17px] leading-relaxed text-on-surface-variant max-w-[46ch] mt-5"
                style={{ animationDelay: ".18s" }}
              >
                Seu cérebro externo está pronto. Acesse memórias, conecte pensamentos ou inicie uma
                nova linha de raciocínio.
              </p>

              <div
                className="rise grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-10"
                style={{ animationDelay: ".26s" }}
              >
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.title}
                    onClick={() => {
                      setInput(s.prompt);
                      textareaRef.current?.focus();
                    }}
                    className="suggest text-left bg-container-low/70 border border-outline-variant/70 rounded-md p-4 flex items-start gap-3.5"
                  >
                    <span className="w-9 h-9 rounded-full bg-primary-container text-primary grid place-items-center flex-shrink-0">
                      <Icon name={s.icon} size={18} />
                    </span>
                    <span>
                      <span className="block text-[14px] font-medium text-on-surface font-ui">
                        {s.title}
                      </span>
                      <span className="block font-body text-[13px] text-on-surface-variant leading-snug mt-1">
                        {s.desc}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <section className="conv-in flex-1 w-full py-6 space-y-7">
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex justify-end">
                    <div className="bg-container-high text-on-surface rounded-md px-5 py-3 max-w-[78%] font-body text-[16px] leading-relaxed">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex gap-4">
                    <Avatar />
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="font-label text-[11px] tracking-[0.12em] uppercase text-outline mb-1.5">
                        VaultMind
                      </div>
                      {m.streaming && !m.content ? (
                        <div className="flex items-center gap-1.5 h-9">
                          <span className="dot" />
                          <span className="dot" />
                          <span className="dot" />
                        </div>
                      ) : (
                        <div className="font-body text-[16.5px] leading-[1.7] text-on-surface whitespace-pre-wrap">
                          {renderContent(m.content)}
                        </div>
                      )}

                      {m.references && m.references.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {m.references.map((ref) => (
                            <span
                              key={ref.path}
                              title={`${(ref.score * 100).toFixed(0)}% relevante`}
                              className="inline-flex items-center gap-1.5 bg-container-low border border-outline-variant/70 rounded-full pl-2 pr-3 py-1 font-ui text-[12.5px] text-on-surface-variant"
                            >
                              <span className="w-5 h-5 rounded-full bg-primary-container text-primary grid place-items-center">
                                <Icon name="doc" size={11} />
                              </span>
                              {ref.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </section>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 w-full flex justify-center px-6 pb-6 pt-2">
        <div className="w-full max-w-[780px]">
          <div className="rounded-md bg-container-lowest border border-outline-variant/80 shadow-[0_10px_40px_-24px_rgba(40,44,44,.45)] transition-all duration-300 focus-within:border-primary focus-within:shadow-[0_0_0_4px_rgba(88,94,108,.12)]">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Pergunte ao seu Vault…"
              className="bare w-full bg-transparent resize-none border-0 focus:ring-0 focus:outline-none font-body text-[16.5px] leading-relaxed text-on-surface px-5 pt-4 pb-1 max-h-[200px]"
            />
            <div className="flex items-center gap-1 px-3 pb-3 pt-1">
              <button className="h-9 px-3 rounded-full flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface hover:bg-container-high transition-colors">
                <Icon name="paperclip" size={18} />
                <span className="font-label text-[12px]">Anexar</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setScopeOpen((v) => !v)}
                  className="h-9 px-3 rounded-full flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface hover:bg-container-high transition-colors"
                >
                  <Icon name="network" size={17} />
                  <span className="font-label text-[12px]">{scope}</span>
                  <Icon name="chevron" size={15} />
                </button>
                <div
                  className={`scope-menu absolute bottom-full left-0 mb-2 w-60 bg-container-lowest border border-outline-variant/70 rounded-2xl shadow-[0_18px_50px_-20px_rgba(40,44,44,.4)] p-1.5 z-30 ${
                    scopeOpen ? "" : "menu-hidden"
                  }`}
                >
                  {SCOPES.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => {
                        setScope(s.label);
                        setScopeOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-container-high transition-colors text-left"
                    >
                      <Icon
                        name={s.icon}
                        size={17}
                        className={scope === s.label ? "text-primary" : "text-on-surface-variant"}
                      />
                      <span className="flex-1 text-[13.5px] text-on-surface font-ui">{s.label}</span>
                      <Icon
                        name="check"
                        size={16}
                        className={`text-primary ${scope === s.label ? "" : "opacity-0"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setDeepThink((v) => !v)}
                title="Pensamento profundo"
                className={`h-9 px-3 rounded-full flex items-center gap-1.5 transition-colors ${
                  deepThink
                    ? "bg-primary-container text-on-primary-container"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-container-high"
                }`}
              >
                <Icon name="spark" size={17} />
                <span className="font-label text-[12px]">Profundo</span>
              </button>

              <div className="ml-auto flex items-center gap-1.5">
                <button className="w-9 h-9 grid place-items-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-container-high transition-colors" title="Voz">
                  <Icon name="mic" size={19} />
                </button>
                <button
                  onClick={send}
                  disabled={!input.trim() || busy}
                  className="w-10 h-10 grid place-items-center rounded-full bg-primary text-on-primary hover:bg-primary-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Enviar"
                >
                  <Icon name="arrow-up" size={20} />
                </button>
              </div>
            </div>
          </div>
          <p className="text-center font-label text-[10px] text-outline mt-3 opacity-80">
            O VaultMind pode cometer erros. Verifique informações importantes.
          </p>
        </div>
      </div>
    </section>
  );
}
