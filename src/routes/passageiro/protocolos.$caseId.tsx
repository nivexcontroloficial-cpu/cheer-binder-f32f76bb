import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
  Send,
} from "lucide-react";
import { MOCK_PROTOCOLS, getStatusLabel, getUrgencyColor } from "@/services/mock/support";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/passageiro/protocolos/$caseId")({
  component: ProtocolDetailScreen,
});

interface SimulatedMessage {
  id: string;
  text: string;
  timestamp: string;
}

function ProtocolDetailScreen() {
  const { caseId } = useParams({ from: "/passageiro/protocolos/$caseId" });
  const navigate = useNavigate();
  const protocol = MOCK_PROTOCOLS.find((p) => p.id === caseId);
  const [newMessage, setNewMessage] = useState("");
  const [simulatedMessages, setSimulatedMessages] = useState<SimulatedMessage[]>([]);

  // Timeline with last event highlighted as current
  const timelineEvents = useMemo(() => {
    if (!protocol) return [];
    // We assume the mock timeline is ordered chronologically (first to last)
    // The requirement says "destacar como atual o último evento da lista, não o primeiro"
    return [...protocol.timeline];
  }, [protocol]);

  if (!protocol) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-porcelain">
        <AlertCircle size={48} className="text-slate-300 mb-4" />
        <h1 className="text-xl font-black uppercase italic text-navy">
          Protocolo simulado não encontrado
        </h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          Demonstração local: nenhum protocolo real foi consultado.
        </p>
        <Button
          type="button"
          onClick={() => navigate({ to: "/passageiro/saude-da-conta" })}
          variant="ghost"
          className="uppercase text-[10px] font-black tracking-widest"
          aria-label="Voltar para saúde da conta"
        >
          Voltar
        </Button>
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) return;

    const newSimMsg: SimulatedMessage = {
      id: `msg-${Date.now()}`,
      text: trimmedMessage,
      timestamp: new Date().toISOString(),
    };

    setSimulatedMessages((prev) => [...prev, newSimMsg]);
    setNewMessage("");
    toast.info("Mensagem adicionada somente nesta demonstração. Nada foi enviado.");
  };

  return (
    <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy">
      <header className="bg-white px-6 py-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate({ to: "/passageiro/saude-da-conta" })}
            className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-navy"
            aria-label="Voltar para saúde da conta"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">
              Protocolo
            </h1>
            <span className="text-[10px] font-black text-slate-400 tracking-widest">
              {protocol.id}
            </span>
          </div>
        </div>
      </header>

      {/* Demo Warning Banner */}
      <div className="bg-amber-50 border-b border-amber-100 px-6 py-2">
        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-tight text-center">
          Demonstração local: este protocolo e sua linha do tempo utilizam dados simulados.
        </p>
      </div>

      <main className="flex-1 p-6 space-y-6 overflow-y-auto pb-32">
        {/* Status Card */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div
              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                protocol.status === "resolvida"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {getStatusLabel(protocol.status)}
            </div>
            <div
              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getUrgencyColor(protocol.urgency)}`}
            >
              Prioridade {protocol.urgency}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Motivo
              </span>
              <p className="text-sm font-bold text-navy">{protocol.category.replace("_", " ")}</p>
            </div>
            <div>
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Relato
              </span>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{protocol.description}"
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            Linha do Tempo (Fictícia)
          </h3>
          <div className="space-y-6 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
            {timelineEvents.map((event, idx) => {
              const isLast = idx === timelineEvents.length - 1;
              return (
                <div key={event.id} className="relative pl-12">
                  <div
                    className={`absolute left-3 top-0 h-4 w-4 rounded-full border-2 border-white shadow-sm ${
                      isLast ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                  <div className="bg-white p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-navy">
                        {getStatusLabel(event.status)}
                      </span>
                      <span className="text-[9px] font-bold text-slate-300">
                        {new Date(event.timestamp).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{event.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Local Simulated Messages */}
        {simulatedMessages.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
              Histórico Local (Volátil)
            </h3>
            <div className="space-y-3" aria-live="polite">
              {simulatedMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Você
                    </span>
                    <span className="text-[9px] font-bold text-slate-300">
                      {new Date(msg.timestamp).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-navy leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Support Chat Box */}
        {protocol.status !== "resolvida" && (
          <section className="pt-4 pb-12">
            <div className="bg-navy rounded-[32px] p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="text-blue-400" size={18} />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Canal simulado</h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                Esta é uma demonstração local. Nenhuma mensagem é enviada à equipe de atendimento.
              </p>
              <form onSubmit={handleSendMessage} className="relative">
                <label htmlFor="simulated-message" className="sr-only">
                  Mensagem para o suporte simulado
                </label>
                <input
                  id="simulated-message"
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite aqui..."
                  className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-blue-400 focus-visible:ring-rovya-orange transition-all min-h-[44px]"
                />
                <button
                  type="submit"
                  aria-label="Enviar mensagem simulada"
                  className="absolute right-2 top-2 h-8 w-8 bg-blue-500 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </section>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 z-10">
        <div className="flex items-center gap-3 text-slate-400 max-w-lg mx-auto">
          <ShieldCheck size={16} />
          <span className="text-[9px] font-bold uppercase tracking-widest">
            Demonstração local • dados mockados
          </span>
        </div>
      </footer>
    </div>
  );
}
