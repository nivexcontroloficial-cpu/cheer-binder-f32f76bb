import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RovyaBrand } from "@/components/RovyaBrand";
import { useState } from "react";
import { User, ShieldCheck, Mail, CheckCircle2, ArrowRight, Loader2, Info } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/passageiro/cadastro")({
  component: SignupScreen,
});

function SignupScreen() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        toast.success("Perfil criado com sucesso!");
        navigate({ to: "/passageiro/verificacao" });
      }, 2000);
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
        <form onSubmit={handleNext} className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase tracking-tight italic text-navy leading-tight">
              {step === 1 ? "Como podemos te chamar?" : "Dados de segurança"}
            </h1>
            <p className="text-sm text-slate-500">
              {step === 1 
                ? "Informe seu nome completo para que o piloto possa te identificar." 
                : "Seu CPF é necessário para validação de integridade da conta."}
            </p>
          </div>

          <div className="space-y-6">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} strokeWidth={2} />
                    <input 
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: Rafael Silva"
                      className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-navy font-bold focus:outline-none focus:border-rovya-orange focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} strokeWidth={2} />
                    <input 
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="rafael@email.com"
                      className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-navy font-bold focus:outline-none focus:border-rovya-orange focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">CPF</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} strokeWidth={2} />
                  <input 
                    required
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                    placeholder="000.000.000-00"
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-navy font-bold focus:outline-none focus:border-rovya-orange focus:bg-white transition-all"
                  />
                </div>
                <div className="flex gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl mt-4">
                  <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[9px] text-blue-700 leading-relaxed font-medium italic">
                    Utilizamos o CPF apenas para verificar antecedentes e garantir a segurança de toda a comunidade Rovya. Seus dados são criptografados.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto flex flex-col gap-4">
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-navy text-white h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-navy/90 transition-all active:scale-95 disabled:opacity-50 rovya-shadow"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : step === 1 ? "Continuar" : "Finalizar Cadastro"}
              {!isLoading && <ArrowRight size={18} strokeWidth={2.5} />}
            </button>
            
            {step === 2 && (
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-navy transition-colors self-center"
              >
                Voltar
              </button>
            )}
          </div>
        </form>
      </main>

      <footer className="p-8 text-center flex flex-col gap-2">
        <div className="flex items-center justify-center gap-2 text-[9px] text-slate-300 font-bold uppercase tracking-[0.2em]">
          <CheckCircle2 size={12} className="text-rovya-green" />
          Segurança Rovya Ativa
        </div>
      </footer>
    </div>
  );
}
