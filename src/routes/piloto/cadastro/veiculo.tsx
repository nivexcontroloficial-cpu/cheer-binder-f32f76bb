import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RovyaBrand } from "@/components/RovyaBrand";
import { ChevronLeft, ArrowRight, Bike, Settings, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/piloto/cadastro/veiculo")({
  component: PilotRegistrationVehicle,
});

function PilotRegistrationVehicle() {
  const navigate = useNavigate();
  const [data, setData] = useState({ placa: "ABC1D23", modelo: "Honda CG 160", ano: "2021" });

  return (
    <div className="flex flex-col min-h-screen bg-navy text-porcelain font-sans">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-navy/80 backdrop-blur-md z-10">
        <button onClick={() => navigate({ to: "/piloto/cadastro/documentos" })} className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"><ChevronLeft size={20} /></button>
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rovya-orange mb-1">Passo 4 de 5</p>
          <div className="flex gap-1.5"><div className="h-1 w-6 bg-rovya-orange rounded-full" /><div className="h-1 w-6 bg-rovya-orange rounded-full" /><div className="h-1 w-6 bg-rovya-orange rounded-full" /><div className="h-1 w-6 bg-rovya-orange rounded-full" /><div className="h-1 w-6 bg-white/10 rounded-full" /></div>
        </div>
        <div className="w-12 h-12" />
      </header>

      <main className="flex-1 px-6 pt-4 pb-24 max-w-lg mx-auto w-full">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-8">DADOS DA MOTO</h1>
        
        <div className="p-6 bg-orange-500/5 border border-orange-500/10 rounded-3xl mb-8">
            <div className="flex gap-4 items-center">
                <div className="h-16 w-16 bg-navy rounded-2xl flex items-center justify-center"><Bike className="text-rovya-orange" /></div>
                <div>
                    <h3 className="font-black uppercase tracking-widest text-sm text-porcelain">{data.modelo}</h3>
                    <p className="text-[10px] text-white/50 font-bold uppercase">PLACA: {data.placa} • ANO: {data.ano}</p>
                </div>
            </div>
        </div>

        <button 
          onClick={() => navigate({ to: "/piloto/cadastro/operacao" })}
          className="w-full h-16 bg-rovya-orange text-white rounded-3xl font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3 hover:bg-rovya-orange/90 active:scale-95 transition-all shadow-xl shadow-black/20"
        >
          Confirmar Veículo
          <ArrowRight size={16} strokeWidth={3} />
        </button>
      </main>
    </div>
  );
}
