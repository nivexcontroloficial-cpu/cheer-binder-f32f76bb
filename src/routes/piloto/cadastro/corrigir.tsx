import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useDemo } from "@/state/DemoContext";
import { ShieldAlert, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { RovyaBrand } from "@/components/RovyaBrand";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/piloto/cadastro/corrigir")({
  component: PilotCorrectionPage,
});

function PilotCorrectionPage() {
  const { pilotRegistration, updatePilotRegistration, setPilotStatus } = useDemo();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Simulando o campo de correção
  const [fieldValue, setFieldValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldValue.trim()) {
      toast.error("Por favor, preencha o campo solicitado.");
      return;
    }

    setIsSubmitting(true);
    
    // Simular upload e processamento
    setTimeout(() => {
      // Atualiza o dado no contexto (simulando persistência dos dados corrigidos)
      if (pilotRegistration.correctionField === 'CNH') {
        // Mocking CRLV/CNH update
      }
      
      setPilotStatus('pending');
      setIsSubmitting(false);
      setIsSuccess(true);
      
      toast.success("Informações enviadas com sucesso!");
      
      setTimeout(() => {
        navigate({ to: '/piloto/analise' });
      }, 2000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-navy items-center justify-center p-6">
        <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
          <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-2xl font-black text-navy uppercase italic mb-2 tracking-tighter">Reenviado!</h1>
          <p className="text-slate-500 text-sm max-w-xs mb-8">
            Seus dados foram atualizados e retornaram para a fila de análise.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse"></div>
            Redirecionando para análise...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-navy">
      <header className="p-6 flex items-center justify-between">
        <button 
          onClick={() => navigate({ to: '/piloto/analise' })}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <RovyaBrand className="h-6" />
        <div className="w-10"></div>
      </header>

      <main className="flex-1 p-6 flex flex-col max-w-md mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-navy uppercase italic mb-2 tracking-tighter">Corrigir Dados</h1>
          <p className="text-slate-500 text-sm">
            Atualize as informações solicitadas pela equipe de triagem.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert size={14} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Instrução de Correção</span>
          </div>
          <p className="text-xs text-blue-800 leading-relaxed font-medium">
            "{pilotRegistration.correctionMessage}"
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Novo Upload / Informação ({pilotRegistration.correctionField})
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-navy transition-colors">
                <ShieldAlert size={18} strokeWidth={2.5} />
              </div>
              <input 
                type="text" 
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
                placeholder={`Cole o link ou descreva a correção da ${pilotRegistration.correctionField}...`}
                className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-navy focus:outline-none focus:border-navy focus:ring-4 focus:ring-navy/5 transition-all rovya-shadow-sm"
              />
            </div>
            
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center gap-3 bg-white hover:bg-slate-50 transition-colors cursor-pointer mt-4">
              <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                <Send size={20} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clique para selecionar arquivo</p>
              <p className="text-[9px] text-slate-300 font-bold italic">PNG, JPG até 10MB</p>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-navy text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-navy/90 transition-all active:scale-95 rovya-shadow disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Enviando...
                </>
              ) : (
                <>
                  Reenviar para Análise
                  <Send size={18} strokeWidth={2.5} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 p-6 bg-slate-50 rounded-3xl">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 text-center">Dados Preservados</h3>
          <div className="space-y-3 opacity-50 pointer-events-none">
             <div className="flex justify-between items-center text-[10px] font-bold">
               <span className="text-slate-400">NOME</span>
               <span className="text-navy">{pilotRegistration.nome}</span>
             </div>
             <div className="flex justify-between items-center text-[10px] font-bold">
               <span className="text-slate-400">CPF</span>
               <span className="text-navy">{pilotRegistration.cpf}</span>
             </div>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Rovya Operations • 2026</p>
      </footer>
    </div>
  );
}