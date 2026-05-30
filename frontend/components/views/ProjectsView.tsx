"use client";

import { Icon } from "../Icon";
import { ViewHeader } from "./ViewHeader";

const PROJECTS = [
  {
    icon: "folder",
    iconStyle: { background: "#dde2f2", color: "#585e6c" },
    title: "Redesign da navegação",
    status: "Ativo",
    statusStyle: { background: "#dde2f2", color: "#3f4554" },
    desc: "Reestruturar a arquitetura de informação do produto com base em pesquisa.",
    progress: 68,
    notes: 22,
    convs: 9,
    updated: "Atualizado há 3 dias",
  },
  {
    icon: "spark",
    iconStyle: { background: "#dad7f8", color: "#5e5c78" },
    title: "Ensaio: Economia da atenção",
    status: "Rascunho",
    statusStyle: { background: "#dad7f8", color: "#42415c" },
    desc: "Reunir argumentos e referências para um ensaio longo sobre atenção.",
    progress: 35,
    notes: 13,
    convs: 4,
    updated: "Atualizado ontem",
  },
  {
    icon: "summary",
    iconStyle: { background: "#e2dfdd", color: "#5e5f60" },
    title: "Roadmap do produto Q3",
    status: "Ativo",
    statusStyle: { background: "#dde2f2", color: "#3f4554" },
    desc: "Definir prioridades, metas e marcos do trimestre.",
    progress: 52,
    notes: 31,
    convs: 15,
    updated: "Atualizado há 3 dias",
  },
];

export function ProjectsView({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  return (
    <section className="view-enter flex flex-col flex-1 min-h-0 relative z-10">
      <ViewHeader
        onOpenSidebar={onOpenSidebar}
        title="Projetos"
        subtitle="Espaços de trabalho que agrupam notas e conversas."
        actions={
          <button className="h-10 px-4 rounded-full bg-primary text-on-primary text-[13.5px] font-ui font-medium flex items-center gap-2 hover:bg-primary-hover transition-colors">
            <Icon name="plus" size={17} />
            <span className="hidden sm:inline">Novo projeto</span>
          </button>
        }
      />
      <div className="flex-1 min-h-0 overflow-y-auto px-4 md:px-10 pb-12">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROJECTS.map((p) => (
            <article
              key={p.title}
              className="card bg-container-lowest border border-outline-variant/60 rounded-md p-5"
            >
              <div className="flex items-start gap-3">
                <span
                  className="w-10 h-10 rounded-[0.85rem] grid place-items-center flex-shrink-0"
                  style={p.iconStyle}
                >
                  <Icon name={p.icon} size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline text-[16px] font-semibold text-on-surface truncate">
                      {p.title}
                    </h3>
                    <span
                      className="font-label text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5"
                      style={p.statusStyle}
                    >
                      {p.status}
                    </span>
                  </div>
                  <p className="font-body text-[13px] text-on-surface-variant leading-snug mt-1 line-clamp-2">
                    {p.desc}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between font-label text-[10.5px] text-outline mb-1.5">
                  <span>Progresso</span>
                  <span>{p.progress}%</span>
                </div>
                <div className="progress h-1.5 rounded-full bg-container-high overflow-hidden">
                  <i style={{ width: `${p.progress}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 font-label text-[10.5px] text-outline">
                <span className="flex items-center gap-1">
                  <Icon name="doc" size={13} />
                  {p.notes} notas
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="message" size={13} />
                  {p.convs} conversas
                </span>
                <span className="ml-auto">{p.updated}</span>
              </div>
            </article>
          ))}
          <button className="card border border-dashed border-outline-variant rounded-md p-5 flex flex-col items-center justify-center gap-2 text-on-surface-variant hover:text-on-surface min-h-[170px]">
            <span className="w-10 h-10 rounded-full bg-container-high grid place-items-center">
              <Icon name="plus" size={20} />
            </span>
            <span className="text-[14px] font-ui font-medium">Criar novo projeto</span>
            <span className="font-body text-[12.5px]">Agrupe notas e conversas relacionadas.</span>
          </button>
        </div>
      </div>
    </section>
  );
}
