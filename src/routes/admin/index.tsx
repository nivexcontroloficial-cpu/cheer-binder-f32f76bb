import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard label="Total de Pilotos" value="1.284" trend="+12%" />
      <StatCard label="Corridas Hoje" value="8.420" trend="+5%" />
      <StatCard label="Receita Estimada" value="R$ 42.100" trend="+8%" />
      
      <div className="col-span-1 md:col-span-3 h-64 bg-white border rounded-xl flex items-center justify-center text-slate-400">
        Gráfico de atividades em tempo real
      </div>
    </div>
  ),
});

function StatCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="bg-white p-6 border rounded-xl shadow-sm">
      <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{trend}</span>
      </div>
    </div>
  );
}
