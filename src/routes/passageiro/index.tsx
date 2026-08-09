import { createFileRoute } from "@tanstack/react-router";
import { Search, MapPin, Navigation, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/passageiro/")({
  component: () => (
    <div className="space-y-6">
      <div className="bg-white rounded-[32px] p-8 border border-slate-100 rovya-shadow-lg">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-2xl font-black tracking-tight">Olá, Rafael</h2>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
            <ShieldCheck size={14} className="text-rovya-green" />
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-800">Verificado</span>
          </div>
        </div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Para onde vamos hoje?</p>
        
        <div className="mt-8 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rovya-orange">
            <Search size={20} strokeWidth={2} />
          </div>
          <input 
            type="text" 
            placeholder="DEFINA SEU DESTINO..." 
            className="w-full h-16 bg-slate-50 rounded-2xl border border-slate-100 pl-12 pr-4 text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-rovya-orange transition-colors"
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <QuickAction icon={<Navigation size={18} strokeWidth={2} />} label="Trabalho" />
          <QuickAction icon={<MapPin size={18} strokeWidth={2} />} label="Casa" />
        </div>
      </div>

      <div className="aspect-square w-full bg-slate-100 rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center text-slate-400 gap-4">
        <div className="p-4 bg-white rounded-2xl shadow-sm">
          <MapPin size={32} strokeWidth={1.5} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
          O mapa interativo será carregado<br/>após a definição da rota.
        </p>
      </div>
    </div>
  ),
});

function QuickAction({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-rovya-orange transition-all group">
      <div className="text-slate-400 group-hover:text-rovya-orange transition-colors">
        {icon}
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}
