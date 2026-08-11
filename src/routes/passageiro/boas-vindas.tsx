import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RovyaBrand } from "@/components/RovyaBrand";
import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/passageiro/boas-vindas")({
  component: WelcomeScreen,
});

const ONBOARDING_STEPS = [
  {
    title: "Vá a qualquer lugar com segurança",
    description:
      "Simulação de pilotos verificados e monitoramento demonstrativo para sua tranquilidade em cada trajeto.",
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Economia e transparência",
    description:
      "Preços justos e simulação de pagamento direto ao piloto, sem taxas ocultas ou surpresas.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Mobilidade na palma da sua mão",
    description:
      "Simulação de chamada em segundos e acompanhamento fictício em tempo real pelo aplicativo.",
    image:
      "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=800",
  },
];

function WelcomeScreen() {
  const [step, setStep] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white animate-in fade-in duration-500">
        <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-700">
          <RovyaBrand className="scale-150" />
          <div className="mt-8 flex gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-rovya-orange animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-rovya-orange animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-rovya-orange animate-bounce"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      navigate({ to: "/passageiro/entrar" });
    }
  };

  const currentStep = ONBOARDING_STEPS[step] || { title: "", description: "", image: "" };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-navy selection:bg-rovya-orange/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative flex-1 overflow-hidden">
        {/* Top Image */}
        <div className="h-[55vh] w-full overflow-hidden relative">
          <img 
            src={currentStep.image} 
            alt="Onboarding" 
            className="h-full w-full object-cover transition-all duration-700 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-8 pt-0 flex flex-col items-center text-center">
          <div className="flex gap-2 mb-8">
            {ONBOARDING_STEPS.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 transition-all duration-300 rounded-full ${i === step ? 'w-8 bg-rovya-orange' : 'w-1.5 bg-slate-200'}`}
              />
            ))}
          </div>

          <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-tight mb-4 max-w-xs transition-all duration-500">
            {currentStep.title}
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs transition-all duration-500">
            {currentStep.description}
          </p>
          <p className="text-[10px] font-bold text-rovya-orange uppercase tracking-widest mb-12 animate-pulse">
            Demonstração local: os recursos apresentados neste onboarding utilizam
            dados fictícios.
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-8 pb-12 bg-white flex flex-col gap-4">
        <button
          type="button"
          onClick={handleNext}
          className="w-full bg-navy text-white h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-navy/90 transition-all active:scale-95 rovya-shadow"
        >
          {step === ONBOARDING_STEPS.length - 1
            ? "Entrar na demonstração"
            : "Próximo"}
          <ChevronRight size={16} strokeWidth={2.5} aria-hidden="true" />
        </button>

        {step === ONBOARDING_STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => navigate({ to: "/passageiro/cadastro" })}
            className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] text-rovya-orange hover:bg-rovya-orange/5 transition-all border-2 border-dashed border-rovya-orange/20"
          >
            Criar conta simulada
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate({ to: "/passageiro/entrar" })}
            className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] text-slate-400 hover:bg-slate-50 transition-all"
          >
            Pular Introdução
          </button>
        )}
      </div>
    </div>
  );
}
