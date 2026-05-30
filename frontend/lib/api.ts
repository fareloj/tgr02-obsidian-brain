export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export type NoteReference = {
  title: string;
  path: string;
  excerpt: string;
  score: number;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type StreamEvents = {
  onMeta?: (data: { conversation_id: string; references: NoteReference[] }) => void;
  onChunk?: (text: string) => void;
  onDone?: (data: { new_note: string | null }) => void;
  onError?: (err: Error) => void;
};

/**
 * Streams a chat response from the backend via Server-Sent Events.
 * Returns an AbortController so the caller can cancel mid-stream.
 */
export function streamChat(
  params: { message: string; conversationId?: string; deepThink?: boolean },
  events: StreamEvents
): AbortController {
  const controller = new AbortController();

  (async () => {
    try {
      const res = await fetch(`${API_BASE}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: params.message,
          conversation_id: params.conversationId ?? null,
          deep_think: params.deepThink ?? false,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`Backend respondeu ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE frames are separated by a blank line
        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";

        for (const frame of frames) {
          const line = frame.trim();
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload) continue;

          let data: Record<string, unknown>;
          try {
            data = JSON.parse(payload);
          } catch {
            continue;
          }

          if (data.type === "meta") {
            events.onMeta?.({
              conversation_id: data.conversation_id as string,
              references: (data.references as NoteReference[]) ?? [],
            });
          } else if (data.type === "chunk") {
            events.onChunk?.(data.content as string);
          } else if (data.type === "done") {
            events.onDone?.({ new_note: (data.new_note as string) ?? null });
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      events.onError?.(err as Error);
    }
  })();

  return controller;
}

export type Conversation = {
  id: string;
  updated: string;
  preview: string;
  turns: number;
};

export async function listConversations(): Promise<Conversation[]> {
  const res = await fetch(`${API_BASE}/chat/conversations`);
  if (!res.ok) return [];
  return res.json();
}

export async function getConversation(
  id: string
): Promise<{ id: string; history: ChatMessage[] }> {
  const res = await fetch(`${API_BASE}/chat/conversations/${id}`);
  return res.json();
}

export type VaultStatus = {
  total_notes: number;
  indexed_notes: number;
  vault_path: string;
  is_watching: boolean;
};

export async function getVaultStatus(): Promise<VaultStatus | null> {
  try {
    const res = await fetch(`${API_BASE}/vault/status`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function syncVault(
  vaultPath: string,
  forceReindex = false
): Promise<{ message: string; total_notes: number; vault_path: string }> {
  const res = await fetch(`${API_BASE}/vault/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vault_path: vaultPath, force_reindex: forceReindex }),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.detail || "Falha ao sincronizar vault");
  }
  return res.json();
}
