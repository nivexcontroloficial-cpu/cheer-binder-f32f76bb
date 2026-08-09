import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, CheckCircle2, Wallet, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/piloto/cadastro/operacao")({
  component: PilotRegistrationOperation,
});

function PilotRegistrationOperation() {
  const navigate = useNavigate();
  const [city, setCity] = useState("pausada"); // 'ativa' | 'pausada'

  return (
    <div className="flex flex-col min-h-screen bg-navy text-porcelain font-sans">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-navy/80 backdrop-blur-md z-10">
        <button onClick={() => navigate({ to: "/piloto/cadastro/veiculo" })} className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"><ChevronLeft size={20} /></button>
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rovya-orange mb-1">Passo 5 de 5</p>
          <div className="flex gap-1.5"><div className="h-1 w-6 bg-rovya-orange rounded-full" /><div className="h-1 w-6 bg-rovya-orange rounded-full" /><div className="h-1 w-6 bg-rovya-orange rounded-full" /><div className="h-1 w-6 bg-rovya-orange rounded-full" /><div className="h-1 w-6 bg-rovya-orange rounded-full" /></div>
        </div>
        <div className="w-12 h-12" />
      </header>

      <main className="flex-1 px-6 pt-4 pb-24 max-w-lg mx-auto w-full">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-8">OPERAÇÃO</h1>

        <div className="space-y-6">
            <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                <label className="text-[10px] font-black uppercase text-white/30 mb-4 block">Cidade de Atuação</label>
                <div className="p-4 bg-navy rounded-2xl border border-white/10 flex justify-between items-center">
                    <span className="font-bold text-sm">São Paulo - SP</span>
                    <span className="text-[9px] bg-amber-500/10 text-amber-500 font-black px-2 py-1 rounded">PAUSADA</span>
                </div>
                <p className="mt-4 text-[10px] text-white/40">As solicitações estão pausadas nesta região. Você pode finalizar o cadastro e será notificado quando abrirmos novas vagas.</p>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-white/30 block">Recebimento</label>
                {['Dinheiro', 'Pix (Chave: 119****-8888)', 'Máquina de Cartão'].map(opt => (
                    <div key={opt} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-rovya-orange" />
                        <span className="text-xs font-bold">{opt}</span>
                    </div>
                ))}
            </div>

            <button 
              onClick={() => {
                  toast.success("Cadastro enviado!");
                  navigate({ to: "/piloto/entrar" });
              }}
              className="w-full h-16 bg-rovya-orange text-white rounded-3xl font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3 hover:bg-rovya-orange/90 active:scale-95 transition-all shadow-xl shadow-black/20"
            >
              Enviar Cadastro
            </button>
        </div>
      </main>
    </div>
  );
}
