import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, MapPin, Check, Plus, Info } from "lucide-react";

export const Route = createFileRoute("/passageiro/localizar")({
  component: MockMapScreen,
});

function MockMapScreen() {
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);
  const [reference, setReference] = useState("");

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 font-sans text-navy">
      {/* Mapa Esquemático Mock */}
      <div className="flex-1 relative bg-slate-200 overflow-hidden">
        {/* Grid do mapa mock */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#111827 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        {/* Marcadores Mock */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="absolute -top-12 -left-1/2 translate-x-1/4 bg-navy text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap shadow-xl animate-bounce">
              Confirmar Local
            </div>
            <div className="h-10 w-10 bg-rovya-orange rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-in zoom-in-50 duration-500">
              <MapPin size={20} className="text-white" fill="white" />
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate({ to: "/passageiro/destino" })}
          className="absolute top-6 left-6 h-12 w-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-navy hover:bg-slate-50 active:scale-95 transition-all"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="bg-white p-8 rounded-t-[40px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-rovya-orange shrink-0">
              <MapPin size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-navy">Ponto de Embarque</h3>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5 italic">Avenida Getúlio Vargas, 890 - Centro</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
              <Info size={16} />
            </div>
            <input 
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="REFERÊNCIA (EX: PORTÃO BRANCO)"
              className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-navy focus:outline-none focus:border-rovya-orange transition-all placeholder:text-slate-300"
            />
          </div>
        </div>

        <button 
          onClick={() => navigate({ to: "/passageiro/confirmar-corrida" })}
          className="w-full h-16 bg-navy text-white rounded-[24px] font-black uppercase tracking-widest text-[12px] flex items-center justify-center gap-2 hover:bg-navy/90 transition-all active:scale-95 rovya-shadow"
        >
          Confirmar Local
          <Check size={20} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
