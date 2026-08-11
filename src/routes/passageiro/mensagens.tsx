import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/passageiro/mensagens")({
  component: MensagensScreen,
});

interface ChatPreview {
  id: string;
  initials: string;
  name: string;
  rideId: string;
  preview: string;
  time: string;
  isSimulated: boolean;
}

function MensagensScreen() {
  const [conversas] = useState<ChatPreview[]>([
    {
      id: "ride-active-mock",
      initials: "CH",
      name: "Carlos H.",
      rideId: "RY-2026-00842",
      preview: "Olá Rafael, estou chegando ao local de embarque.",
      time: "Agora",
      isSimulated: true,
    },
  ]);

  if (conversas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 text-slate-400">
        <MessageSquare size={48} className="mb-4" aria-hidden="true" />
        <h1 className="text-sm font-black uppercase text-navy">Mensagens</h1>
        <p className="text-[10px] font-bold uppercase mt-2">Nenhuma conversa ativa no momento.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xs font-black uppercase tracking-widest text-navy mb-4 px-2">
        Conversas Recentes
      </h1>

      {conversas.map((chat) => (
        <Link
          key={chat.id}
          to="/passageiro/chat/$rideId"
          params={{ rideId: chat.id }}
          className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-slate-100 hover:border-rovya-orange/30 transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-rovya-orange focus-visible:ring-offset-2 outline-none"
        >
          {/* Avatar CSS */}
          <div className="h-14 w-14 rounded-2xl bg-navy flex items-center justify-center text-white font-black text-lg shrink-0">
            {chat.initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-black text-navy truncate">{chat.name}</h3>
              <span className="text-[9px] font-bold text-slate-400 uppercase">{chat.time}</span>
            </div>

            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{chat.rideId}</p>
            <p className="text-[11px] font-medium text-slate-600 truncate leading-relaxed">
              {chat.preview}
            </p>

            {chat.isSimulated && (
              <div className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">
                  Conversa simulada
                </span>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
