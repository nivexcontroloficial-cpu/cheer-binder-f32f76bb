import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { RovyaBrand } from "@/components/RovyaBrand";
import { useState, useRef, useEffect } from "react";
import {
  User,
  ShieldCheck,
  Mail,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Info,
  ChevronLeft,
} from "lucide-react";
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
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    cpf?: string;
    terms?: string;
  }>({});
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);
    let masked = numbers;
    if (numbers.length > 3) masked = numbers.substring(0, 3) + "." + numbers.substring(3);
    if (numbers.length > 6) masked = masked.substring(0, 7) + "." + masked.substring(7);
    if (numbers.length > 9) masked = masked.substring(0, 11) + "-" + masked.substring(11);
    return masked;
  };

  const validateStep = () => {
    const newErrors: typeof errors = {};
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "O nome é obrigatório";
      if (!formData.email.trim()) newErrors.email = "O e-mail é obrigatório";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        newErrors.email = "E-mail inválido";
      }
    } else {
      const cpfDigits = formData.cpf.replace(/\D/g, "");
      if (cpfDigits.length !== 11) {
        newErrors.cpf = "Informe exatamente 11 números fictícios";
      }
      if (!acceptedTerms) {
        newErrors.terms = "Você deve aceitar os termos da demonstração";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      const trimmedName = formData.name.trim();
      const trimmedEmail = formData.email.trim();
      setFormData((prev) => ({
        ...prev,
        name: trimmedName,
        email: trimmedEmail,
      }));
      
      // Use local variables for validation to avoid waiting for state update
      const newErrors: typeof errors = {};
      if (!trimmedName) newErrors.name = "O nome é obrigatório";
      if (!trimmedEmail) newErrors.email = "O e-mail é obrigatório";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        newErrors.email = "E-mail inválido";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
      setStep(2);
    } else {
      if (!validateStep()) return;
      setIsLoading(true);
      timerRef.current = setTimeout(() => {
        setIsLoading(false);
        toast.success("Cadastro simulado concluído. Nenhuma conta real foi criada.");
        navigate({ to: "/passageiro/verificacao" });
      }, 1000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-navy selection:bg-rovya-orange/20">
      <header className="p-8 pb-4">
        <div className="flex flex-col items-center gap-6">
          <div className="w-full flex justify-between items-center relative">
            <button
              type="button"
              onClick={() => (step === 1 ? navigate({ to: "/passageiro/entrar" }) : setStep(1))}
              className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-navy z-10"
              aria-label={step === 1 ? "Voltar para entrar" : "Voltar para primeira etapa"}
            >
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
            <RovyaBrand className="scale-90 absolute left-1/2 -translate-x-1/2" />
            <div className="w-8" />
          </div>
          <div
            className="w-full flex gap-2"
            role="progressbar"
            aria-label="Progresso do cadastro simulado"
            aria-valuetext={`Etapa ${step} de 2`}
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={2}
          >
            {[1, 2].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-rovya-orange" : "bg-slate-100"}`}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 px-8 py-10 flex flex-col max-w-sm mx-auto w-full">
        <form
          onSubmit={handleNext}
          className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-rovya-orange/5 border border-rovya-orange/10 rounded-xl">
              <Info size={14} className="text-rovya-orange shrink-0" aria-hidden="true" />
              <p className="text-[10px] text-rovya-orange leading-tight font-medium italic">
                Demonstração local: nenhuma conta será criada e os dados informados não serão
                enviados ou validados.
              </p>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black uppercase tracking-tight italic text-navy leading-tight">
                {step === 1 ? "Como podemos te chamar?" : "Dados da simulação"}
              </h1>
              <p className="text-sm text-slate-500">
                {step === 1
                  ? "Informe um nome completo fictício para identificação simulada."
                  : "CPF fictício usado apenas para testar o formulário nesta demonstração."}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <label
                    htmlFor="name-input"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                  >
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={18}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    <input
                      id="name-input"
                      required
                      type="text"
                      maxLength={50}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Rafael Silva"
                      className={`w-full h-14 pl-12 pr-4 bg-slate-50 border ${errors.name ? "border-red-300" : "border-slate-100"} rounded-2xl text-navy font-bold focus:outline-none focus:border-rovya-orange focus:bg-white transition-all`}
                    />
                  </div>
                  {errors.name && (
                    <p id="name-error" className="text-[10px] text-red-500 font-bold" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email-input"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                  >
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={18}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    <input
                      id="email-input"
                      required
                      type="email"
                      maxLength={100}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="rafael@email.com"
                      className={`w-full h-14 pl-12 pr-4 bg-slate-50 border ${errors.email ? "border-red-300" : "border-slate-100"} rounded-2xl text-navy font-bold focus:outline-none focus:border-rovya-orange focus:bg-white transition-all`}
                    />
                  </div>
                  {errors.email && (
                    <p id="email-error" className="text-[10px] text-red-500 font-bold" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="cpf-input"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                  >
                    CPF Fictício (11 números)
                  </label>
                  <div className="relative">
                    <ShieldCheck
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={18}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    <input
                      id="cpf-input"
                      required
                      type="text"
                      inputMode="numeric"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                      placeholder="000.000.000-00"
                      className={`w-full h-14 pl-12 pr-4 bg-slate-50 border ${errors.cpf ? "border-red-300" : "border-slate-100"} rounded-2xl text-navy font-bold focus:outline-none focus:border-rovya-orange focus:bg-white transition-all`}
                    />
                  </div>
                  {errors.cpf && (
                    <p className="text-[10px] text-red-500 font-bold" role="alert">
                      {errors.cpf}
                    </p>
                  )}
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      id="terms-checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-rovya-orange focus:ring-rovya-orange transition-all cursor-pointer"
                    />
                  </div>
                  <label
                    htmlFor="terms-checkbox"
                    className="text-[11px] text-slate-500 leading-relaxed font-medium cursor-pointer"
                  >
                    Li os{" "}
                    <Link
                      to="/passageiro/termos"
                      className="text-rovya-orange font-bold underline underline-offset-2"
                    >
                      Termos de Uso
                    </Link>{" "}
                    e a{" "}
                    <Link
                      to="/passageiro/privacidade"
                      className="text-rovya-orange font-bold underline underline-offset-2"
                    >
                      Política de Privacidade
                    </Link>{" "}
                    desta demonstração local.
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-[10px] text-red-500 font-bold" role="alert">
                    {errors.terms}
                  </p>
                )}

                <div className="flex gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <Info size={14} className="text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-[9px] text-blue-700 leading-relaxed font-medium italic">
                    Cadastro simulado — sem envio de dados. Seus dados informados permanecem somente
                    nesta tela durante o preenchimento.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto flex flex-col gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading || (step === 2 && !acceptedTerms)}
              className="w-full bg-navy text-white h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-navy/90 transition-all active:scale-95 disabled:opacity-50 rovya-shadow"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : step === 1 ? (
                "Continuar"
              ) : (
                "Finalizar Simulação"
              )}
              {!isLoading && <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />}
            </button>

            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-navy transition-colors self-center py-2"
              >
                Corrigir dados anteriores
              </button>
            )}
          </div>
        </form>
      </main>

      <footer className="p-8 text-center mt-auto">
        <div
          className="flex items-center justify-center gap-2 text-[9px] text-slate-300 font-bold uppercase tracking-[0.2em]"
          aria-hidden="true"
        >
          <CheckCircle2 size={12} className="text-rovya-green" />
          Ambiente Seguro de Demonstração
        </div>
      </footer>
    </div>
  );
}
