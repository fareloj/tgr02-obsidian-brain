"use client";

import { useEffect, useState } from "react";
import { Icon } from "../Icon";
import { ViewHeader } from "./ViewHeader";
import { listConversations, type Conversation } from "../../lib/api";

const DEMO: { group: string; items: { title: string; preview: string; time: string }[] }[] = [
  {
    group: "Hoje",
    items: [
      {
        title: "Síntese da pesquisa de usuários",
        preview: "Quais foram os principais pontos de dor mencionados nas entrevistas?",
        time: "há 2 horas",
      },
      {
        title: "Rascunho do email para investidores",
        preview: "Me ajude a tornar o tom mais confiante mas não arrogante.",
        time: "há 5 horas",
      },
    ],
  },
  {
    group: "Esta semana",
    items: [
      {
        title: "Conexões entre estoicismo e hábitos",
        preview: "Existe relação entre a dicotomia do controle e a formação de hábitos?",
        time: "ontem",
      },
      {
        title: "Roadmap do produto Q3",
        preview: "Priorize estas 12 features por impacto e esforço.",
        time: "3 dias atrás",
      },
      {
        title: "Ideias para o ensaio sobre atenção",
        preview: "Quais das minhas notas falam sobre economia da atenção?",
        time: "4 dias atrás",
      },
    ],
  },
];

type Props = {
  onOpenSidebar: () => void;
  onOpenConversation: () => void;
};

function Row({
  title,
  preview,
  time,
  onClick,
}: {
  title: string;
  preview: string;
  time: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="row w-full text-left flex items-center gap-4 px-5 py-4">
      <span className="w-9 h-9 rounded-full bg-primary-container text-primary grid place-items-center flex-shrink-0">
        <Icon name="message" size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-medium text-on-surface font-ui truncate">
          {title}
        </span>
        <span className="block font-body text-[13px] text-on-surface-variant truncate mt-0.5">
          {preview}
        </span>
      </span>
      <span className="hidden sm:block font-label text-[10.5px] text-outline whitespace-nowrap">
        {time}
      </span>
      <span className="row-actions flex items-center gap-1">
        <span className="w-8 h-8 grid place-items-center rounded-full hover:bg-container-high text-on-surface-variant">
          <Icon name="pin" size={16} />
        </span>
        <span className="w-8 h-8 grid place-items-center rounded-full hover:bg-container-high text-on-surface-variant">
          <Icon name="more" size={16} />
        </span>
      </span>
    </button>
  );
}

export function ConversationsView({ onOpenSidebar, onOpenConversation }: Props) {
  const [real, setReal] = useState<Conversation[] | null>(null);

  useEffect(() => {
    listConversations().then((c) => setReal(c.length ? c : null));
  }, []);

  return (
    <section className="view-enter flex flex-col flex-1 min-h-0 relative z-10">
      <ViewHeader
        onOpenSidebar={onOpenSidebar}
        title="Conversas"
        subtitle={
          real
            ? `${real.length} threads com o seu segundo cérebro.`
            : "128 threads com o seu segundo cérebro."
        }
        actions={
          <>
            <button className="h-10 w-10 md:w-auto md:px-4 grid place-items-center md:flex md:items-center md:gap-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-container-high transition-colors">
              <Icon name="sort" size={18} />
              <span className="hidden md:inline text-[13px] font-ui">Recentes</span>
            </button>
            <button
              onClick={onOpenConversation}
              className="h-10 px-4 rounded-full bg-primary text-on-primary text-[13.5px] font-ui font-medium flex items-center gap-2 hover:bg-primary-hover transition-colors"
            >
              <Icon name="plus" size={17} />
              <span className="hidden sm:inline">Nova conversa</span>
            </button>
          </>
        }
      />
      <div className="flex-1 min-h-0 overflow-y-auto px-4 md:px-10 pb-12">
        <div className="max-w-[900px] mx-auto">
          {real ? (
            <>
              <p className="font-label text-[10.5px] tracking-[0.16em] uppercase text-outline mt-2 mb-2">
                Suas conversas
              </p>
              <div className="bg-container-lowest border border-outline-variant/60 rounded-md overflow-hidden divide-y divide-outline-variant/50">
                {real.map((c) => (
                  <Row
                    key={c.id}
                    title={c.preview || "Conversa sem título"}
                    preview={`${c.turns} ${c.turns === 1 ? "troca" : "trocas"}`}
                    time={new Date(c.updated).toLocaleDateString("pt-BR")}
                    onClick={onOpenConversation}
                  />
                ))}
              </div>
            </>
          ) : (
            DEMO.map((section) => (
              <div key={section.group}>
                <p className="font-label text-[10.5px] tracking-[0.16em] uppercase text-outline mt-7 first:mt-2 mb-2">
                  {section.group}
                </p>
                <div className="bg-container-lowest border border-outline-variant/60 rounded-md overflow-hidden divide-y divide-outline-variant/50">
                  {section.items.map((it) => (
                    <Row key={it.title} {...it} onClick={onOpenConversation} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
