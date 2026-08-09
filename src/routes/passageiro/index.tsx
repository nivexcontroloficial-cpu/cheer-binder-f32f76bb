import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/passageiro/")({
  component: () => (
    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Olá, Rafael!</h2>
      <p className="text-slate-600">Para onde vamos hoje?</p>
      <div className="mt-8 space-y-4">
        <div className="h-14 w-full bg-slate-50 rounded-xl border border-slate-200 flex items-center px-4 text-slate-400 italic">
          Defina seu destino...
        </div>
      </div>
      <div className="mt-12 p-12 text-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400">
        O mapa aparecerá aqui após definir a rota.
      </div>
    </div>
  ),
});
