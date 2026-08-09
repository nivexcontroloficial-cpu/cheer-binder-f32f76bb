import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RovyaBrand } from "@/components/RovyaBrand";
import { useState, useRef } from "react";
import { Camera, RefreshCw, CheckCircle2, AlertCircle, ArrowRight, Loader2, Lightbulb } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/passageiro/verificacao")({
  component: VerificationScreen,
});

function VerificationScreen() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    photo: null as string | null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.birthDate) {
        toast.error("Por favor, preencha todos os campos.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.photo) {
        toast.error("A foto de perfil é obrigatória.");
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        toast.success("Identidade verificada com sucesso!");
        navigate({ to: "/passageiro/permissoes" });
      }, 2500);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
        setIsCapturing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-navy selection:bg-rovya-orange/20">
      <header className="p-8 pb-4">
        <div className="flex flex-col items-center gap-6">
          <RovyaBrand className="scale-90" />
          <div className="w-full flex gap-2">
            {[1, 2].map((i) => (
              <div 
                key={i} 
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-rovya-orange' : 'bg-slate-100'}`}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 px-8 py-10 flex flex-col max-w-sm mx-auto w-full">
        {step === 1 ? (
          <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <h1 className="text-2xl font-black uppercase tracking-tight italic text-navy leading-tight">
                Verificação de Identidade
              </h1>
              <p className="text-sm text-slate-500">
                Precisamos confirmar seus dados básicos para manter a comunidade segura.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nome Completo</label>
                <input 
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  placeholder="Seu nome como no documento"
                  className="w-full h-14 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-navy font-bold focus:outline-none focus:border-rovya-orange focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Data de Nascimento</label>
                <input 
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  className="w-full h-14 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-navy font-bold focus:outline-none focus:border-rovya-orange focus:bg-white transition-all"
                />
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex gap-3">
                <CheckCircle2 size={18} className="text-rovya-green shrink-0 mt-0.5" />
                <p className="text-[10px] text-emerald-800 font-medium leading-relaxed">
                  Telefone verificado: <span className="font-bold text-navy">(43) 999**-**12</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-right-4 duration-500 text-center">
            <div className="space-y-2">
              <h1 className="text-2xl font-black uppercase tracking-tight italic text-navy leading-tight">
                Foto de Perfil
              </h1>
              <p className="text-sm text-slate-500">
                Uma foto nítida ajuda o piloto a te encontrar e aumenta sua nota.
              </p>
            </div>

            <div className="relative aspect-square w-full max-w-[240px] mx-auto group">
              {formData.photo ? (
                <div className="w-full h-full rounded-[40px] overflow-hidden border-4 border-rovya-orange rovya-shadow-lg relative">
                  <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setFormData({...formData, photo: null})}
                    className="absolute bottom-4 right-4 p-3 bg-white text-navy rounded-full shadow-lg hover:bg-slate-50 transition-all active:scale-95"
                  >
                    <RefreshCw size={20} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full rounded-[40px] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-rovya-orange hover:bg-white transition-all group"
                >
                  <div className="p-5 bg-white rounded-3xl shadow-sm group-hover:scale-110 transition-transform">
                    <Camera size={32} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Tirar Foto</span>
                </button>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                capture="user"
                onChange={handlePhotoUpload}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-left">
                <Lightbulb size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">Dica de Iluminação</p>
                  <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                    Procure um lugar bem iluminado e evite usar boné ou óculos escuros para uma melhor identificação.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-center text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                <AlertCircle size={12} />
                Nenhuma biometria será armazenada
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto pt-8 flex flex-col gap-4">
          <button 
            onClick={handleNextStep}
            disabled={isLoading || (step === 2 && !formData.photo)}
            className="w-full bg-navy text-white h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-navy/90 transition-all active:scale-95 disabled:opacity-50 rovya-shadow"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : step === 1 ? "Prosseguir" : "Finalizar Verificação"}
            {!isLoading && <ArrowRight size={18} strokeWidth={2.5} />}
          </button>
          
          {step === 2 && (
            <button 
              onClick={() => setStep(1)}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-navy transition-colors self-center"
            >
              Voltar
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
