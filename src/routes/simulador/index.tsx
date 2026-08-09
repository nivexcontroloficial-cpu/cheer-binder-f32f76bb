import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/simulador/")({
  component: () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          Controles do Simulador
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="p-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition-colors">
            Gerar Corrida Aleatória
          </button>
          <button className="p-4 bg-amber-600 hover:bg-amber-500 rounded-xl font-bold transition-colors">
            Simular Pico de Demanda
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl font-mono text-sm">
          <p className="text-emerald-500 mb-2">// Logs do Sistema</p>
          <p className="text-slate-400">[15:42:01] Motorista Carlos entrou em operação</p>
          <p className="text-slate-400">[15:43:12] Rafael solicitou corrida (Centro -{">"} Orla)</p>
        </div>
        <div className="h-64 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-slate-600">
          Mapa de simulação de tráfego
        </div>
      </div>
    </div>
  ),
});
