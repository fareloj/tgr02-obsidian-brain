"use client";

import { useEffect, useState } from "react";
import { Icon } from "../Icon";
import { ViewHeader } from "./ViewHeader";
import { getVaultStatus, syncVault, type VaultStatus } from "../../lib/api";

function Toggle({ initial = false }: { initial?: boolean }) {
  const [on, setOn] = useState(initial);
  return <button onClick={() => setOn((v) => !v)} className={`toggle ${on ? "on" : ""}`} />;
}

export function SettingsView({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const [theme, setTheme] = useState("Claro");
  const [vaultPath, setVaultPath] = useState("");
  const [status, setStatus] = useState<VaultStatus | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  useEffect(() => {
    getVaultStatus().then((s) => {
      setStatus(s);
      if (s?.vault_path) setVaultPath(s.vault_path);
    });
  }, []);

  async function handleSync() {
    if (!vaultPath.trim()) return;
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await syncVault(vaultPath.trim());
      setSyncMsg(`✓ ${res.total_notes} notas indexadas. Sincronização em tempo real ativa.`);
      setStatus(await getVaultStatus());
    } catch (err) {
      setSyncMsg(`⚠️ ${(err as Error).message}`);
    } finally {
      setSyncing(false);
    }
  }

  return (
    <section className="view-enter flex flex-col flex-1 min-h-0 relative z-10">
      <ViewHeader
        onOpenSidebar={onOpenSidebar}
        title="Configurações"
        subtitle="Personalize o comportamento do seu Vault."
      />
      <div className="flex-1 min-h-0 overflow-y-auto px-4 md:px-10 pb-12">
        <div className="max-w-[720px] mx-auto space-y-6">
          {/* Profile */}
          <div className="bg-container-lowest border border-outline-variant/60 rounded-md p-5 flex items-center gap-4">
            <span className="w-14 h-14 rounded-full bg-tertiary-container text-on-tertiary-container grid place-items-center font-ui font-semibold text-[20px]">
              D
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[16px] font-medium text-on-surface font-ui">Daniel</p>
              <p className="font-body text-[13.5px] text-on-surface-variant truncate">Plano Pro</p>
            </div>
            <button className="h-10 px-4 rounded-full border border-outline-variant text-on-surface-variant hover:bg-container-high transition-colors text-[13px] font-ui flex items-center gap-2">
              <Icon name="edit" size={16} />
              <span className="hidden sm:inline">Editar</span>
            </button>
          </div>

          {/* Vault connection — functional */}
          <div>
            <p className="font-label text-[10.5px] tracking-[0.16em] uppercase text-outline mb-2 px-1">
              Conexão com o Obsidian
            </p>
            <div className="bg-container-lowest border border-outline-variant/60 rounded-md p-5 space-y-4">
              <div className="flex items-center gap-3">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    status?.is_watching ? "bg-primary" : "bg-outline-variant"
                  }`}
                />
                <p className="text-[13.5px] font-ui text-on-surface">
                  {status?.is_watching
                    ? `Conectado · ${status.total_notes} notas · sync ativo`
                    : "Nenhum vault conectado"}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={vaultPath}
                  onChange={(e) => setVaultPath(e.target.value)}
                  placeholder="C:/Users/danie/Documents/MeuVault"
                  className="flex-1 h-11 px-4 rounded-full bg-surface border border-outline-variant/80 focus:border-primary focus:outline-none font-body text-[14px] text-on-surface placeholder:text-outline"
                />
                <button
                  onClick={handleSync}
                  disabled={syncing || !vaultPath.trim()}
                  className="h-11 px-5 rounded-full bg-primary text-on-primary text-[13.5px] font-ui font-medium flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors disabled:opacity-40"
                >
                  <Icon name="network" size={16} />
                  {syncing ? "Sincronizando…" : "Conectar e indexar"}
                </button>
              </div>
              {syncMsg && (
                <p className="font-body text-[13px] text-on-surface-variant">{syncMsg}</p>
              )}
            </div>
          </div>

          {/* Appearance */}
          <div>
            <p className="font-label text-[10.5px] tracking-[0.16em] uppercase text-outline mb-2 px-1">
              Aparência
            </p>
            <div className="bg-container-lowest border border-outline-variant/60 rounded-md divide-y divide-outline-variant/50">
              <div className="flex items-center gap-4 px-5 py-4">
                <Icon name="palette" size={19} className="text-on-surface-variant" />
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-on-surface font-ui">Tema</p>
                  <p className="font-body text-[12.5px] text-on-surface-variant">
                    Escolha o visual da interface.
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-container-high rounded-full p-1">
                  {["Claro", "Escuro", "Sistema"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`seg h-8 px-3.5 rounded-full text-[12.5px] font-ui text-on-surface-variant ${
                        theme === t ? "active" : ""
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 px-5 py-4">
                <Icon name="doc" size={19} className="text-on-surface-variant" />
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-on-surface font-ui">
                    Respostas em fonte serifada
                  </p>
                  <p className="font-body text-[12.5px] text-on-surface-variant">
                    Usa Source Serif 4 para um toque editorial.
                  </p>
                </div>
                <Toggle initial />
              </div>
            </div>
          </div>

          {/* Vault behaviour */}
          <div>
            <p className="font-label text-[10.5px] tracking-[0.16em] uppercase text-outline mb-2 px-1">
              Comportamento do Vault
            </p>
            <div className="bg-container-lowest border border-outline-variant/60 rounded-md divide-y divide-outline-variant/50">
              {[
                {
                  icon: "network",
                  title: "Conexões automáticas",
                  desc: "Sugere links entre notas relacionadas.",
                  on: true,
                },
                {
                  icon: "spark",
                  title: "Sugestões proativas",
                  desc: "O Vault destaca insights enquanto você escreve.",
                  on: false,
                },
                {
                  icon: "history",
                  title: "Indexação automática",
                  desc: "Mantém a busca semântica sempre atualizada.",
                  on: true,
                },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-4 px-5 py-4">
                  <Icon name={item.icon} size={19} className="text-on-surface-variant" />
                  <div className="flex-1">
                    <p className="text-[14px] font-medium text-on-surface font-ui">{item.title}</p>
                    <p className="font-body text-[12.5px] text-on-surface-variant">{item.desc}</p>
                  </div>
                  <Toggle initial={item.on} />
                </div>
              ))}
            </div>
          </div>

          {/* Account */}
          <div>
            <p className="font-label text-[10.5px] tracking-[0.16em] uppercase text-outline mb-2 px-1">
              Conta
            </p>
            <div className="bg-container-lowest border border-outline-variant/60 rounded-md divide-y divide-outline-variant/50">
              <button className="w-full flex items-center gap-4 px-5 py-4 row text-left">
                <Icon name="lock" size={19} className="text-on-surface-variant" />
                <span className="flex-1 text-[14px] font-medium text-on-surface font-ui">
                  Privacidade e segurança
                </span>
                <Icon name="chevron-right" size={18} className="text-outline" />
              </button>
              <button className="w-full flex items-center gap-4 px-5 py-4 row text-left">
                <Icon name="logout" size={19} style={{ color: "#9f403d" } as React.CSSProperties} />
                <span className="flex-1 text-[14px] font-medium font-ui" style={{ color: "#9f403d" }}>
                  Sair da conta
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
