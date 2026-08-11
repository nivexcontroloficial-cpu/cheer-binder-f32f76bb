import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { RovyaBrand } from "@/components/RovyaBrand";
import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  Phone,
  Chrome,
  Apple,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/passageiro/entrar")({
  component: LoginScreen,
});

type LoginMode = "options" | "phone" | "otp";

function LoginScreen() {
  const [mode, setMode] = useState<LoginMode>("options");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const navigate = useNavigate();

  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const currentTimers = timersRef.current;
    return () => {
      currentTimers.forEach(clearTimeout);
    };
  }, []);

  const addTimer = (timer: NodeJS.Timeout) => {
    timersRef.current.push(timer);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setError("Informe um número de telefone válido");
      return;
    }
    setError(null);
    setIsLoading(true);

    // Simula envio de SMS local
    const timer = setTimeout(() => {
      setIsLoading(false);
      setMode("otp");
      toast.success("Simulação local: nenhum SMS foi enviado. Use o código 123456.");
    }, 1500);
    addTimer(timer);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== "123456") {
      setError("Código inválido. Tente 123456 para testes.");
      return;
    }
    setError(null);
    setIsLoading(true);

    // Simula validação e login local
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast.success("Acesso simulado autorizado!");
      navigate({ to: "/passageiro/verificacao" });
    }, 2000);
    addTimer(timer);
  };

  const renderOptions = () => (
    <div className="flex flex-col gap-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-4 p-4 bg-rovya-orange/5 border border-rovya-orange/10 rounded-2xl">
        <p className="text-[10px] font-bold text-rovya-orange uppercase tracking-widest text-center leading-relaxed">
          Demonstração local: nenhum SMS, login social ou autenticação real será realizado. Use
          somente dados fictícios.
        </p>
      </div>

      <h2 className="text-xl font-black uppercase tracking-tight italic mb-2 text-navy">
        Como deseja entrar?
      </h2>

      <div className="flex items-start gap-3 mb-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-all focus-within:border-rovya-orange/30">
        <div className="flex items-center h-5">
          <input
            id="terms-checkbox"
            type="checkbox"
            checked={hasAcceptedTerms}
            onChange={(e) => setHasAcceptedTerms(e.target.checked)}
            className="h-5 w-5 rounded-lg border-slate-200 text-navy focus:ring-rovya-orange transition-all cursor-pointer"
          />
        </div>
        <label
          htmlFor="terms-checkbox"
          className="text-[11px] font-bold text-slate-500 leading-snug cursor-pointer select-none"
        >
          Li os{" "}
          <Link
            to="/passageiro/termos"
            className="text-navy underline decoration-rovya-orange underline-offset-4"
          >
            Termos de Uso
          </Link>{" "}
          e a{" "}
          <Link
            to="/passageiro/privacidade"
            className="text-navy underline decoration-rovya-orange underline-offset-4"
          >
            Política de Privacidade
          </Link>{" "}
          desta demonstração.
        </label>
      </div>

      <button
        type="button"
        disabled={!hasAcceptedTerms}
        onClick={() => setMode("phone")}
        className="w-full h-14 bg-navy text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center px-6 gap-4 hover:bg-navy/90 transition-all active:scale-[0.98] rovya-shadow disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed"
      >
        <Phone size={18} strokeWidth={2.5} aria-hidden="true" />
        Continuar com Telefone
      </button>

      <div className="flex items-center gap-4 my-2">
        <div className="h-px flex-1 bg-slate-100" />
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">ou</span>
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      <button
        type="button"
        disabled={!hasAcceptedTerms}
        onClick={() => {
          toast.info("Demonstração: entrada com Google simulada");
          navigate({ to: "/passageiro/verificacao" });
        }}
        className="w-full h-14 bg-white border border-slate-200 text-navy rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center px-6 gap-4 hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed"
      >
        <Chrome size={18} strokeWidth={2.5} aria-hidden="true" />
        Entrar com Google
      </button>

      <button
        type="button"
        disabled={!hasAcceptedTerms}
        onClick={() => {
          toast.info("Demonstração: entrada com Apple simulada");
          navigate({ to: "/passageiro/verificacao" });
        }}
        className="w-full h-14 bg-white border border-slate-200 text-navy rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center px-6 gap-4 hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed"
      >
        <Apple size={18} strokeWidth={2.5} aria-hidden="true" />
        Entrar com Apple
      </button>

      <div className="mt-8 flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={() => navigate({ to: "/passageiro/cadastro" })}
          className="text-[11px] font-black uppercase tracking-widest text-rovya-orange hover:opacity-80 transition-opacity flex items-center gap-2"
        >
          Criar conta simulada
          <ArrowRight size={14} strokeWidth={3} aria-hidden="true" />
        </button>
      </div>
    </div>
  );

  const renderPhoneForm = () => (
    <form
      onSubmit={handlePhoneSubmit}
      className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-left-4 duration-500"
    >
      <div className="space-y-2">
        <label
          htmlFor="phone-input"
          className="text-xl font-black uppercase tracking-tight italic text-navy block"
        >
          Seu número fictício
        </label>
        <p className="text-sm text-slate-500">Utilize um número fictício para esta demonstração.</p>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-slate-100 pr-3">
          <span className="text-sm font-black text-navy">BR +55</span>
        </div>
        <input
          id="phone-input"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="(00) 00000-0000"
          className="w-full h-16 pl-24 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-navy font-bold focus:outline-none focus:border-rovya-orange focus:bg-white transition-all"
          autoFocus
        />
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 text-rovya-red text-[10px] font-bold uppercase tracking-widest bg-rovya-red/5 p-3 rounded-xl border border-rovya-red/10 animate-in shake duration-300"
        >
          <AlertCircle size={14} aria-hidden="true" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-navy text-white h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-navy/90 transition-all active:scale-95 disabled:opacity-50 rovya-shadow"
      >
        {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Enviar Código"}
        {!isLoading && <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />}
      </button>

      <button
        type="button"
        onClick={() => setMode("options")}
        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-navy transition-colors self-center"
      >
        Voltar para opções
      </button>
    </form>
  );

  const renderOtpForm = () => (
    <form
      onSubmit={handleOtpSubmit}
      className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-right-4 duration-500"
    >
      <div className="space-y-2 text-center">
        <div className="h-14 w-14 bg-rovya-orange/10 rounded-2xl flex items-center justify-center text-rovya-orange mx-auto mb-4">
          <CheckCircle2 size={24} strokeWidth={2.5} aria-hidden="true" />
        </div>
        <label
          htmlFor="otp-input"
          className="text-xl font-black uppercase tracking-tight italic text-navy block"
        >
          Verificação Simulada
        </label>
        <p className="text-sm text-slate-500 text-center">
          Simulação local: nenhum SMS foi enviado. <br />
          Use o código <span className="text-navy font-bold">123456</span>.
        </p>
      </div>

      <input
        id="otp-input"
        type="text"
        maxLength={6}
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        placeholder="000000"
        className="w-full h-20 text-center text-3xl font-black tracking-[0.5em] bg-slate-50 border border-slate-100 rounded-2xl text-navy focus:outline-none focus:border-rovya-orange focus:bg-white transition-all"
        autoFocus
      />

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 text-rovya-red text-[10px] font-bold uppercase tracking-widest bg-rovya-red/5 p-3 rounded-xl border border-rovya-red/10 animate-in shake duration-300"
        >
          <AlertCircle size={14} aria-hidden="true" />
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <button
          type="submit"
          disabled={isLoading || otp.length < 6}
          className="w-full bg-navy text-white h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-navy/90 transition-all active:scale-95 disabled:opacity-50 rovya-shadow"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Verificar Código"}
        </button>

        <button
          type="button"
          onClick={() => {
            setOtp("");
            toast.info("Simulação local: nenhum SMS foi reenviado. Use 123456.");
          }}
          className="text-[10px] font-black uppercase tracking-widest text-rovya-orange hover:opacity-80 transition-opacity self-center"
        >
          Não recebi o código. Reenviar.
        </button>
      </div>

      <button
        type="button"
        onClick={() => setMode("phone")}
        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-navy transition-colors self-center mt-4"
      >
        Alterar número de telefone
      </button>
    </form>
  );

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-navy selection:bg-rovya-orange/20">
      <header className="p-8">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Voltar"
            onClick={() =>
              mode === "options" ? navigate({ to: "/passageiro/boas-vindas" }) : setMode("options")
            }
            className="p-2 -ml-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 focus:outline-none focus:ring-2 focus:ring-rovya-orange"
          >
            <ChevronLeft size={24} strokeWidth={2.5} aria-hidden="true" />
          </button>
          <RovyaBrand className="scale-75 origin-right" />
        </div>
      </header>

      <main className="flex-1 px-8 flex flex-col items-center justify-center max-w-sm mx-auto w-full pb-20">
        {mode === "options" && renderOptions()}
        {mode === "phone" && renderPhoneForm()}
        {mode === "otp" && renderOtpForm()}
      </main>

      <footer className="p-8 text-center text-[9px] text-slate-300 font-bold uppercase tracking-[0.2em]">
        Ambiente de Demonstração Seguro
      </footer>
    </div>
  );
}
