"use client";

import { Icon } from "../Icon";
import { ViewHeader } from "./ViewHeader";

const NOTES = [
  {
    tag: "Pesquisa",
    tagClass: "text-on-tertiary-container bg-tertiary-container",
    time: "há 2h",
    title: "Pontos de dor recorrentes",
    body: 'Três temas surgiram em quase todas as entrevistas: dificuldade de retomar o contexto, medo de perder informação e a sensação de que as anotações "morrem" depois de escritas.',
    links: 14,
    topic: "UX",
  },
  {
    tag: "Filosofia",
    tagClass: "text-on-primary-container bg-primary-container",
    time: "ontem",
    title: "A dicotomia do controle",
    body: "Separar o que está sob meu controle do que não está é, na prática, um filtro de atenção. Talvez seja a raiz de todo bom sistema de hábitos: investir energia só onde ela rende.",
    links: 8,
    topic: "Estoicismo",
  },
  {
    tag: "Produto",
    tagClass: "text-on-surface-variant bg-container-high",
    time: "3 dias",
    title: "Critérios de priorização Q3",
    body: "Impacto × confiança × esforço, mas com um veto qualitativo: se a feature não fortalece o hábito principal do produto, ela espera — independente do score.",
    links: 22,
    topic: "Roadmap",
  },
  {
    tag: "Escrita",
    tagClass: "text-on-tertiary-container bg-tertiary-container",
    time: "3 dias",
    title: "Economia da atenção",
    body: "A atenção virou a moeda mais disputada. Escrever sobre isso exige primeiro proteger a minha — ironia que vale como abertura do ensaio.",
    links: 5,
    topic: "Ensaio",
  },
  {
    tag: "Design",
    tagClass: "text-on-surface-variant bg-container-high",
    time: "1 sem",
    title: "Hierarquia e carga cognitiva",
    body: "Cada elemento que compete por destaque cobra um imposto de atenção. Hierarquia clara não é estética — é gentileza com o usuário.",
    links: 11,
    topic: "UI",
  },
  {
    tag: "Leitura",
    tagClass: "text-on-primary-container bg-primary-container",
    time: "2 sem",
    title: "Information Architecture — notas",
    body: "Organização, rotulagem, navegação e busca formam os quatro sistemas. A maioria dos problemas que chamo de \"UX\" são, na verdade, falhas de rotulagem.",
    links: 9,
    topic: "Livro",
  },
];

export function NotesView({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  return (
    <section className="view-enter flex flex-col flex-1 min-h-0 relative z-10">
      <ViewHeader
        onOpenSidebar={onOpenSidebar}
        title="Notas Recentes"
        subtitle="Tudo que você capturou ultimamente, no seu Vault."
        actions={
          <>
            <button className="h-10 w-10 grid place-items-center rounded-full border border-outline-variant text-on-surface-variant hover:bg-container-high transition-colors">
              <Icon name="grid" size={18} />
            </button>
            <button className="h-10 px-4 rounded-full bg-primary text-on-primary text-[13.5px] font-ui font-medium flex items-center gap-2 hover:bg-primary-hover transition-colors">
              <Icon name="plus" size={17} />
              <span className="hidden sm:inline">Nova nota</span>
            </button>
          </>
        }
      />
      <div className="flex-1 min-h-0 overflow-y-auto px-4 md:px-10 pb-12">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NOTES.map((n) => (
            <article
              key={n.title}
              className="card bg-container-lowest border border-outline-variant/60 rounded-md p-5 flex flex-col"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`chip text-[11px] font-label uppercase tracking-wide rounded-full px-2.5 py-1 ${n.tagClass}`}
                >
                  {n.tag}
                </span>
                <span className="font-label text-[10.5px] text-outline">{n.time}</span>
              </div>
              <h3 className="font-headline text-[16px] font-semibold text-on-surface mt-3 leading-snug">
                {n.title}
              </h3>
              <p className="font-body text-[13.5px] text-on-surface-variant leading-relaxed mt-2 flex-1 line-clamp-4">
                {n.body}
              </p>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-outline-variant/50 font-label text-[10.5px] text-outline">
                <span className="flex items-center gap-1">
                  <Icon name="link" size={13} />
                  {n.links}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="tag" size={13} />
                  {n.topic}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
