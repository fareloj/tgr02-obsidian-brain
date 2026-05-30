"use client";

import { Icon } from "./Icon";
import type { ViewName } from "../app/page";

const NAV_ITEMS: { id: ViewName; icon: string; label: string; shortcut?: string }[] = [
  { id: "buscar", icon: "search", label: "Buscar", shortcut: "⌘K" },
  { id: "explorar", icon: "network", label: "Explorar Vault" },
  { id: "conversas", icon: "message", label: "Conversas" },
  { id: "notas", icon: "history", label: "Notas Recentes" },
  { id: "projetos", icon: "folder", label: "Projetos" },
];

const RECENTS = [
  { title: "Síntese da pesquisa de usuários", meta: "há 2 horas · 14 notas" },
  { title: "Conexões entre estoicismo e hábitos", meta: "ontem · 8 notas" },
  { title: "Roadmap do produto Q3", meta: "3 dias atrás · 22 notas" },
  { title: "Ideias para o ensaio sobre atenção", meta: "3 dias atrás · 5 notas" },
];

type SidebarProps = {
  active: ViewName;
  onNavigate: (view: ViewName) => void;
  onNewChat: () => void;
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ active, onNavigate, onNewChat, open, onClose }: SidebarProps) {
  return (
    <>
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-[284px] flex-shrink-0 flex flex-col bg-container-low/80 backdrop-blur-xl border-r border-outline-variant/60 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="px-5 pt-6 pb-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-[0.85rem] bg-inverse-surface grid place-items-center shadow-[0_4px_14px_-4px_rgba(40,44,44,.5)]">
            <Icon name="network" size={19} className="text-inverse-on-surface" />
          </div>
          <div className="leading-none">
            <h1 className="font-headline text-[17px] font-semibold tracking-tight text-on-surface">
              VaultMind
            </h1>
            <p className="font-label text-[10.5px] tracking-[0.14em] uppercase text-on-surface-variant mt-1">
              Second Brain
            </p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden ml-auto w-8 h-8 grid place-items-center rounded-full text-on-surface-variant hover:bg-container-high"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* New chat */}
        <div className="px-4">
          <button
            onClick={onNewChat}
            className="group w-full h-12 rounded-full bg-primary text-on-primary font-ui font-medium text-[14.5px] flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors shadow-[0_8px_22px_-10px_rgba(88,94,108,.9)]"
          >
            <Icon name="plus" size={18} className="transition-transform group-hover:rotate-90 duration-300" />
            <span>Novo Chat</span>
          </button>
        </div>

        {/* Primary nav */}
        <nav className="px-4 mt-6 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`nav-item w-full flex items-center gap-3 h-10 px-3 rounded-full text-[14px] ${
                active === item.id ? "active" : ""
              }`}
            >
              <span className="bar" />
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
              {item.shortcut && (
                <span className="ml-auto font-label text-[10px] tracking-wide text-outline border border-outline-variant rounded-md px-1.5 py-0.5">
                  {item.shortcut}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Recents */}
        <div className="px-4 mt-7 flex items-center justify-between">
          <span className="font-label text-[10.5px] tracking-[0.16em] uppercase text-outline">
            Recentes
          </span>
          <button className="text-outline hover:text-on-surface transition-colors">
            <Icon name="more" size={16} />
          </button>
        </div>
        <div className="px-4 mt-2 flex-1 overflow-y-auto space-y-0.5 min-h-0">
          {RECENTS.map((r) => (
            <button
              key={r.title}
              onClick={() => onNavigate("explorar")}
              className="w-full text-left block px-3 py-2 rounded-[0.85rem] hover:bg-container-high/70 transition-colors"
            >
              <p className="text-[13.5px] text-on-surface truncate font-ui">{r.title}</p>
              <p className="font-label text-[10.5px] text-outline mt-0.5">{r.meta}</p>
            </button>
          ))}
        </div>

        {/* Footer / user */}
        <div className="p-3 border-t border-outline-variant/60">
          <button
            onClick={() => onNavigate("config")}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-full hover:bg-container-high/70 transition-colors"
          >
            <span className="w-9 h-9 rounded-full bg-tertiary-container text-on-tertiary-container grid place-items-center font-ui font-semibold text-[13px]">
              D
            </span>
            <span className="text-left leading-tight">
              <span className="block text-[13.5px] font-medium text-on-surface">Daniel</span>
              <span className="block font-label text-[10.5px] text-outline">Plano Pro</span>
            </span>
            <Icon name="settings" size={18} className="ml-auto text-on-surface-variant" />
          </button>
        </div>
      </aside>

      {/* Mobile scrim */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-inverse-surface/30 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
    </>
  );
}
