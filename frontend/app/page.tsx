"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { ChatView } from "../components/views/ChatView";
import { SearchView } from "../components/views/SearchView";
import { ConversationsView } from "../components/views/ConversationsView";
import { NotesView } from "../components/views/NotesView";
import { ProjectsView } from "../components/views/ProjectsView";
import { SettingsView } from "../components/views/SettingsView";

export type ViewName =
  | "explorar"
  | "buscar"
  | "conversas"
  | "notas"
  | "projetos"
  | "config";

export default function Home() {
  const [view, setView] = useState<ViewName>("explorar");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Bumping this key remounts ChatView, giving us a fresh conversation.
  const [chatKey, setChatKey] = useState(0);

  const navigate = (v: ViewName) => {
    setView(v);
    setSidebarOpen(false);
  };

  const newChat = () => {
    setChatKey((k) => k + 1);
    navigate("explorar");
  };

  // ⌘K / Ctrl+K → busca
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setView("buscar");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openSidebar = () => setSidebarOpen(true);

  return (
    <>
      <Sidebar
        active={view}
        onNavigate={navigate}
        onNewChat={newChat}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="relative flex-1 flex flex-col min-w-0 bg-surface">
        {/* Ambient decor */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[52rem] h-[52rem] rounded-full bg-primary-container blur-[150px] opacity-40" />
          <div className="absolute bottom-[-10rem] right-[-6rem] w-[34rem] h-[34rem] rounded-full bg-tertiary-container blur-[140px] opacity-30" />
        </div>

        {view === "explorar" && <ChatView key={chatKey} onOpenSidebar={openSidebar} />}
        {view === "buscar" && <SearchView onOpenSidebar={openSidebar} />}
        {view === "conversas" && (
          <ConversationsView
            onOpenSidebar={openSidebar}
            onOpenConversation={() => navigate("explorar")}
          />
        )}
        {view === "notas" && <NotesView onOpenSidebar={openSidebar} />}
        {view === "projetos" && <ProjectsView onOpenSidebar={openSidebar} />}
        {view === "config" && <SettingsView onOpenSidebar={openSidebar} />}
      </main>
    </>
  );
}
