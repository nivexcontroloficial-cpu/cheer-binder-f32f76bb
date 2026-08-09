import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { 
  ArrowLeft, 
  ShieldAlert, 
  ChevronRight, 
  FileText, 
  Camera, 
  Send, 
  Info,
  CheckCircle2,
  Lock
} from "lucide-react";
import { CATEGORIES } from "@/services/mock/support";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/passageiro/denunciar/$rideId")({
  component: DenunciarScreen,
});

function DenunciarScreen() {
  const { rideId } = useParams({ from: "/passageiro/denunciar/$rideId" });
  const navigate = useNavigate();
  const [step, setStep] = useState<'category' | 'details' | 'success'>( 'category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [hasEvidence, setHasEvidence] = useState(false);

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    setStep('details');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.length < 10) {
      toast.error("Por favor, detalhe melhor o ocorrido.");
      return;
    }
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="flex min-h-screen flex-col bg-white p-6 items-center text-center justify-center animate-in fade-in duration-500">
        <div className="h-20 w-20 bg-emerald-50 rounded-[32px] flex items-center justify-center mb-6">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-navy mb-4">Relato Enviado</h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-[280px]">
          Geramos o protocolo <span className="text-navy font-bold">PR-2026-{Math.floor(Math.random()*1000)}</span>. Nossa equipe de segurança analisará o caso em até 24h.
        </p>
        <div className="w-full space-y-3">
          <Button 
            onClick={() => navigate({ to: "/passageiro/saude-da-conta" })}
            className="w-full bg-navy text-white h-14 rounded-2xl font-black uppercase italic tracking-widest"
          >
            Acompanhar Protocolo
          </Button>
          <Button 
            onClick={() => navigate({ to: "/passageiro" })}
            variant="ghost"
            className="w-full text-slate-400 font-bold uppercase text-[10px]"
          >
            Voltar para o Início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy">
      <header className="bg-white px-6 py-6 border-b border-slate-100 flex items-center gap-4">
        <button 
          onClick={() => step === 'details' ? setStep('category') : navigate({ to: -1 as any })}
          className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-navy"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-black italic tracking-tighter uppercase">
          {step === 'category' ? 'Denunciar' : 'Detalhes'}
        </h1>
      </header>

      <main className="flex-1 p-6 overflow-y-auto">
        {step === 'category' ? (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex gap-3 mb-2">
              <ShieldAlert size={18} className="text-red-600 shrink-0" />
              <p className="text-[10px] text-red-700 font-bold leading-relaxed">
                Esta denúncia é confidencial. O piloto não terá acesso ao seu relato ou identidade.
              </p>
            </div>
            
            <h2 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 px-2">Selecione uma categoria</h2>
            <div className="grid gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className="w-full bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between group active:scale-[0.98] transition-all"
                >
                  <span className="text-sm font-bold text-navy">{cat.label}</span>
                  <ChevronRight size={18} className="text-slate-200" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <FileText size={20} />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Categoria</span>
                  <span className="text-sm font-bold text-navy">{CATEGORIES.find(c => c.id === selectedCategory)?.label}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Relato detalhado</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o que aconteceu..."
                  className="w-full min-h-[150px] p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-navy outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Anexar Evidências (Opcional)</label>
                <div 
                  onClick={() => { setHasEvidence(true); toast.info("Simulando seleção de mídia..."); }}
                  className="w-full h-24 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <Camera size={24} className="text-slate-300" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Foto ou Vídeo</span>
                </div>
                {hasEvidence && (
                  <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg" />
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Evidência anexada localmente</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
              <Lock size={16} className="text-blue-600 shrink-0" />
              <p className="text-[10px] text-blue-800 font-medium leading-relaxed italic">
                Seus dados estão protegidos por criptografia e só serão acessados pela equipe de suporte.
              </p>
            </div>

            <Button 
              type="submit"
              className="w-full bg-navy text-white h-14 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Enviar Denúncia
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}
