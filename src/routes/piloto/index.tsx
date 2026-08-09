import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/piloto/")({
  component: () => (
    <div className="space-y-6">
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
        <p className="text-emerald-500 text-sm font-bold tracking-widest uppercase mb-1">Status Atual</p>
        <h2 className="text-3xl font-bold">Disponível</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Ganhos Hoje</p>
          <p className="text-xl font-bold">R$ 142,50</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Avaliação</p>
          <p className="text-xl font-bold">4.98 ⭐</p>
        </div>
      </div>
      
      <div className="p-8 text-center text-slate-500 bg-slate-800/50 rounded-2xl border border-dashed border-slate-700">
        Aguardando nova solicitação...
      </div>
    </div>
  ),
});
