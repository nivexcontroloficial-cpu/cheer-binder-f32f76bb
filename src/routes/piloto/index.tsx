import { createFileRoute } from "@tanstack/react-router";
import { DollarSign, Star, Zap, Clock } from "lucide-react";

export const Route = createFileRoute("/piloto/")({
  component: () => (
    <div className="space-y-6">
      <div className="bg-rovya-green/10 border border-rovya-green/20 rounded-[32px] p-8 text-center rovya-shadow">
        <p className="text-rovya-green text-[10px] font-black tracking-[0.3em] uppercase mb-2">Status Operacional</p>
        <h2 className="text-4xl font-black uppercase tracking-tighter">Disponível</h2>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-rovya-green text-white rounded-full text-[9px] font-black uppercase tracking-widest">
          <Zap size={14} fill="currentColor" /> Recebendo Chamadas
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <StatItem 
          icon={<DollarSign size={18} strokeWidth={2} />} 
          label="Ganhos Hoje" 
          value="R$ 142,50" 
          color="text-rovya-orange"
        />
        <StatItem 
          icon={<Star size={18} strokeWidth={2} />} 
          label="Avaliação" 
          value="4.98" 
          color="text-rovya-amber"
        />
      </div>
      
      <div className="p-12 text-center text-white/20 bg-white/5 rounded-[32px] border border-dashed border-white/10 flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center animate-pulse">
          <Clock size={24} strokeWidth={1.5} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
          Aguardando nova<br/>solicitação de corrida...
        </p>
      </div>
    </div>
  ),
});

function StatItem({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  return (
    <div className="bg-graphite p-6 rounded-[24px] border border-white/5 rovya-shadow">
      <div className={`mb-3 ${color}`}>
        {icon}
      </div>
      <p className="text-[9px] text-white/30 uppercase font-black tracking-widest mb-1">{label}</p>
      <p className="text-xl font-black tracking-tight">{value}</p>
    </div>
  );
}
