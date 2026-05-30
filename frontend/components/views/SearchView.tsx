"use client";

import { useState } from "react";
import { Icon } from "../Icon";
import { ViewHeader } from "./ViewHeader";

const FILTERS = ["Tudo", "Notas", "Conversas", "Projetos"];

const RESULTS = [
  {
    icon: "doc",
    badge: "Nota",
    badgeClass: "text-on-tertiary-container bg-tertiary-container",
    title: "Princípios de arquitetura de informação",
    excerpt:
      "Estruturas de navegação, taxonomias e o equilíbrio entre profundidade e amplitude na organização de conteúdo…",
    meta: "Atualizada há 3 dias · 5 conexões",
  },
  {
    icon: "message",
    badge: "Conversa",
    badgeClass: "text-on-primary-container bg-primary-container",
    title: "Discussão sobre hierarquia visual",
    excerpt:
      "…como a arquitetura de informação influencia a percepção de complexidade e a carga cognitiva do usuário…",
    meta: "há 1 semana · 12 mensagens",
  },
  {
    icon: "folder",
    badge: "Projeto",
    badgeClass: "text-on-surface-variant bg-container-high",
    title: "Redesign do sistema de navegação",
    excerpt:
      "Reorganização da arquitetura de informação do produto com base em card sorting e testes de árvore…",
    meta: "22 notas · 4 colaboradores",
  },
  {
    icon: "doc",
    badge: "Nota",
    badgeClass: "text-on-tertiary-container bg-tertiary-container",
    title: 'Notas do livro "Information Architecture"',
    excerpt:
      "Resumo dos capítulos sobre organização, rotulagem e sistemas de busca em ecossistemas de informação…",
    meta: "há 2 meses · 9 conexões",
  },
];

export function SearchView({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const [query, setQuery] = useState("arquitetura de informação");
  const [filter, setFilter] = useState("Tudo");

  return (
    <section className="view-enter flex flex-col flex-1 min-h-0 relative z-10">
      <ViewHeader
        onOpenSidebar={onOpenSidebar}
        title="Buscar no Vault"
        subtitle="Busca semântica em 1.284 notas, conversas e projetos."
      />
      <div className="flex-1 min-h-0 overflow-y-auto px-4 md:px-10 pb-12">
        <div className="max-w-[760px] mx-auto">
          <label className="flex items-center gap-3 h-14 px-5 rounded-md bg-container-lowest border border-outline-variant/80 shadow-sm focus-within:border-primary focus-within:shadow-[0_0_0_4px_rgba(88,94,108,.1)] transition">
            <Icon name="search" size={20} className="text-on-surface-variant" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none p-0 font-body text-[16px] text-on-surface placeholder:text-outline"
              placeholder="Busque por significado, não só palavras-chave…"
            />
            <span className="font-label text-[10px] tracking-wide text-outline border border-outline-variant rounded-md px-1.5 py-0.5">
              ESC
            </span>
          </label>

          <div className="flex gap-2 mt-5 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`chip chip-filter h-8 px-3.5 rounded-full border border-outline-variant text-[12.5px] font-ui text-on-surface-variant ${
                  filter === f ? "active" : ""
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <p className="font-label text-[10.5px] tracking-[0.16em] uppercase text-outline mt-8 mb-2">
            {RESULTS.length} resultados
          </p>
          <div className="space-y-1.5">
            {RESULTS.map((r) => (
              <button
                key={r.title}
                className="row card w-full text-left flex items-start gap-4 p-4 rounded-md bg-container-lowest border border-outline-variant/60"
              >
                <span className="w-9 h-9 rounded-full bg-primary-container text-primary grid place-items-center flex-shrink-0 mt-0.5">
                  <Icon name={r.icon} size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-[14.5px] font-medium text-on-surface font-ui truncate">
                      {r.title}
                    </span>
                    <span
                      className={`font-label text-[10px] uppercase tracking-wide rounded px-1.5 py-0.5 ${r.badgeClass}`}
                    >
                      {r.badge}
                    </span>
                  </span>
                  <span className="block font-body text-[13.5px] text-on-surface-variant leading-snug mt-1 line-clamp-2">
                    {r.excerpt}
                  </span>
                  <span className="block font-label text-[10.5px] text-outline mt-1.5">{r.meta}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
