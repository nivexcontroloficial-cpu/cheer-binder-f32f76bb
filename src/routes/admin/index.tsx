import { createFileRoute } from "@tanstack/react-router";
import { Bike, MapPin, DollarSign, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Bike size={20} />}
          label="Total de Pilotos" 
          value="1.284" 
          trend="+12%" 
        />
        <StatCard 
          icon={<MapPin size={20} />}
          label="Corridas Hoje" 
          value="8.420" 
          trend="+5%" 
        />
        <StatCard 
          icon={<DollarSign size={20} />}
          label="Receita Bruta" 
          value="R$ 42.100" 
          trend="+8%" 
        />
      </div>
      
      <div className="bg-white border border-slate-100 rounded-[32px] p-8 rovya-shadow">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em]">Atividade em Tempo Real</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Monitoramento de tráfego global</p>
          </div>
          <div className="flex items-center gap-2 text-rovya-blue bg-rovya-blue/5 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest">
            <TrendingUp size={14} /> Atualizando
          </div>
        </div>
        <div className="h-64 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Visualização de Dados em Grade</p>
        </div>
      </div>
    </div>
  ),
});

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string; value: string; trend: string }) {
  return (
    <div className="bg-white p-8 border border-slate-100 rounded-[32px] rovya-shadow transition-transform hover:-translate-y-1 duration-300">
      <div className="text-rovya-blue mb-4 opacity-50">
        {icon}
      </div>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-3xl font-black tracking-tighter text-navy">{value}</h3>
        <span className="text-[9px] font-black text-rovya-green bg-rovya-green/10 px-2 py-1 rounded-lg uppercase tracking-widest">{trend}</span>
      </div>
    </div>
  );
}
