import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RovyaBrand } from "@/components/RovyaBrand";
import { ChevronLeft, ArrowRight, Loader2, AlertCircle, CheckCircle2, Info, Clock, Ban } from "lucide-react";
import { useState } from "react";
import { useDemo } from "@/state/DemoContext";
import { toast } from "sonner";

export const Route = createFileRoute("/piloto/entrar")({
  component: PilotLogin,
});

type LoginStep = "phone" | "code" | "status";
type AccountStatus = "not_found" | "pending" | "approved" | "suspended" | "blocked";

function PilotLogin() {
  const navigate = useNavigate();
  const { loginPilot } = useDemo();
  
  const [step, setStep] = useState<LoginStep>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<AccountStatus | null>(null);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error("Insira um celular válido");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("code");
    }, 1500);
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("O código deve ter 6 dígitos");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      // MOCK LOGIC: Carlos Henrique (123456)
      if (code === "123456") {
        setStatus("approved");
        setStep("status");
      } else if (code === "000000") {
        setStatus("not_found");
        setStep("status");
      } else if (code === "111111") {
        setStatus("pending");
        setStep("status");
      } else if (code === "222222") {
        setStatus("suspended");
        setStep("status");
      } else if (code === "333333") {
        setStatus("blocked");
        setStep("status");
      } else {
        toast.error("Código inválido. Tente 123456.");
      }
    }, 1500);
  };

  const handleConfirmAccess = () => {
    if (status === "approved") {
      loginPilot();
      navigate({ to: "/piloto" });
    } else {
      setStep("phone");
      setStatus(null);
      setCode("");
    }
  };

  const renderStatus = () => {
    switch (status) {
      case "approved":
        return (
          <StatusCard 
            icon={<CheckCircle2 className="text-rovya-green" size={48} />}
            title="CONTA APROVADA"
            message="Seja bem-vindo de volta, Carlos Henrique. Sua conta está ativa e pronta para operar."
            actionLabel="Acessar Painel"
            onAction={handleConfirmAccess}
          />
        );
      case "pending":
        return (
          <StatusCard 
            icon={<Clock className="text-amber-400" size={48} />}
            title="EM ANÁLISE"
            message="Seus documentos estão sendo validados por nossa equipe. O prazo médio é de 48h úteis."
            actionLabel="Entendido"
            onAction={handleConfirmAccess}
          />
        );
      case "suspended":
        return (
          <StatusCard 
            icon={<AlertCircle className="text-rovya-orange" size={48} />}
            title="CONTA SUSPENSA"
            message="Sua conta foi temporariamente suspensa por violação das políticas de segurança."
            actionLabel="Recorrer"
            onAction={handleConfirmAccess}
            secondaryAction="Saber mais"
          />
        );
      case "blocked":
        return (
          <StatusCard 
            icon={<Ban className="text-red-500" size={48} />}
            title="CONTA BLOQUEADA"
            message="Acesso permanentemente bloqueado por múltiplas ocorrências graves."
            actionLabel="Falar com Suporte"
            onAction={handleConfirmAccess}
          />
        );
      case "not_found":
        return (
          <StatusCard 
            icon={<Info className="text-white/30" size={48} />}
            title="NÃO CADASTRADO"
            message="Este número não possui um cadastro de piloto ativo na plataforma Rovya."
            actionLabel="Quero me Cadastrar"
            onAction={handleConfirmAccess}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-navy text-porcelain font-sans">
      <header className="p-6 flex items-center justify-between">
        <button 
          onClick={() => step === "phone" ? navigate({ to: "/piloto/boas-vindas" }) : setStep("phone")}
          className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <RovyaBrand variant="white" subBrand="Piloto" className="scale-75" />
        <div className="w-12 h-12" /> {/* Spacer */}
      </header>

      <main className="flex-1 flex flex-col px-6 justify-center max-w-lg mx-auto w-full pb-20">
        {step === "phone" && (
          <div className="animate-in fade-in slide-in-from-bottom duration-500">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-2">ENTRAR NO PAINEL</h1>
            <p className="text-sm text-white/40 mb-8">Insira seu número de celular cadastrado para acessar.</p>
            
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className="relative group">
                <input 
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-18 bg-white/5 border border-white/10 rounded-3xl px-6 text-xl font-bold focus:outline-none focus:border-rovya-orange/50 focus:ring-4 focus:ring-rovya-orange/5 transition-all text-porcelain placeholder:text-white/10"
                />
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full h-16 bg-rovya-orange text-white rounded-3xl font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3 hover:bg-rovya-orange/90 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Continuar"}
                {!isLoading && <ArrowRight size={16} strokeWidth={3} />}
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest leading-relaxed">
                Ao continuar, você receberá um SMS de verificação. Tarifas de dados podem ser aplicadas.
              </p>
            </div>
          </div>
        )}

        {step === "code" && (
          <div className="animate-in fade-in slide-in-from-right duration-500">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-2">VERIFICAÇÃO</h1>
            <p className="text-sm text-white/40 mb-8">Enviamos um código de 6 dígitos para o seu celular.</p>
            
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div className="relative">
                <input 
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full h-18 bg-white/5 border border-white/10 rounded-3xl px-6 text-3xl font-black text-center tracking-[0.5em] focus:outline-none focus:border-rovya-orange/50 focus:ring-4 focus:ring-rovya-orange/5 transition-all text-porcelain placeholder:text-white/10"
                />
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full h-16 bg-white text-navy rounded-3xl font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3 hover:bg-porcelain active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
              >
                {isLoading ? <Loader2 className="animate-spin text-navy" size={20} /> : "Verificar Código"}
              </button>
            </form>

            <div className="mt-8 flex flex-col items-center gap-4">
              <button className="text-[10px] text-rovya-orange font-black uppercase tracking-widest hover:underline">
                Reenviar código em 00:45
              </button>
              
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl w-full">
                <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest text-center leading-relaxed">
                  MODO DEMO: Use <span className="text-rovya-orange">123456</span> para aprovado,<br /> 
                  <span className="text-white/60">000000</span> (Novo), <span className="text-white/60">111111</span> (Pendente),<br />
                  <span className="text-white/60">222222</span> (Suspenso), <span className="text-white/60">333333</span> (Bloqueado)
                </p>
              </div>
            </div>
          </div>
        )}

        {step === "status" && status && (
          <div className="animate-in zoom-in-95 duration-500">
            {renderStatus()}
          </div>
        )}
      </main>
    </div>
  );
}

function StatusCard({ 
  icon, 
  title, 
  message, 
  actionLabel, 
  onAction,
  secondaryAction 
}: { 
  icon: React.ReactNode; 
  title: string; 
  message: string; 
  actionLabel: string; 
  onAction: () => void;
  secondaryAction?: string;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 flex flex-col items-center text-center shadow-2xl">
      <div className="mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
        {icon}
      </div>
      <h2 className="text-2xl font-black italic uppercase tracking-tight mb-4 text-porcelain">
        {title}
      </h2>
      <p className="text-sm text-white/40 leading-relaxed font-medium mb-10">
        {message}
      </p>
      
      <div className="w-full flex flex-col gap-3">
        <button 
          onClick={onAction}
          className="w-full h-16 bg-porcelain text-navy rounded-3xl font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center hover:bg-white active:scale-95 transition-all shadow-lg"
        >
          {actionLabel}
        </button>
        
        {secondaryAction && (
          <button className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] py-4 hover:text-white/50 transition-colors">
            {secondaryAction}
          </button>
        )}
      </div>
    </div>
  );
}
