import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";

export const Route = createFileRoute("/passageiro/mensagens")({
  component: MensagensScreen,
});

function MensagensScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 text-slate-400">
      <MessageSquare size={48} className="mb-4" />
      <h2 className="text-sm font-black uppercase text-navy">Mensagens</h2>
      <p className="text-[10px] font-bold uppercase mt-2">Nenhuma conversa ativa no momento.</p>
    </div>
  );
}
