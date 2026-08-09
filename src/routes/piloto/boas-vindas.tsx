import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RovyaBrand } from "@/components/RovyaBrand";
import { Bike, ShieldCheck, ArrowRight, CheckCircle2, MapPin, Smartphone } from "lucide-react";
import { useState, useEffect } from "react";
import { useDemo } from "@/state/DemoContext";

export const Route = createFileRoute("/piloto/boas-vindas")({
  head: () => ({
    title: "Seja um Piloto Rovya",
    meta: [
      {
        name: "description",
        content: "Cadastre-se para pilotar na plataforma Rovya.",
      },
    ],
  }),
  component: PilotWelcome,
});

function PilotWelcome() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "SUA MOTO, SUAS REGRAS",
      description: "Ganhe dinheiro pilotando em sua cidade com total liberdade de horários e transparência operacional.",
      icon: <Bike className="h-10 w-10 text-rovya-orange" strokeWidth={1.5} />,
      badge: "PLATAFORMA PREMIUM"
    },
    {
      title: "SEGURANÇA EM PRIMEIRO LUGAR",
      description: "Monitoramento em tempo real, suporte dedicado e seguros inclusos em cada viagem realizada.",
      icon: <ShieldCheck className="h-10 w-10 text-rovya-orange" strokeWidth={1.5} />,
      badge: "PROTEÇÃO TOTAL"
    },
    {
      title: "GANHOS TRANSPARENTES",
      description: "Veja quanto vai ganhar antes de aceitar. Pagamento simplificado e extrato detalhado no app.",
      icon: <CheckCircle2 className="h-10 w-10 text-rovya-orange" strokeWidth={1.5} />,
      badge: "PÓS-PAGO"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-navy text-porcelain font-sans overflow-hidden">
      {/* Top Brand */}
      <div className="pt-12 pb-8 flex justify-center animate-in fade-in slide-in-from-top duration-700">
        <RovyaBrand variant="white" subBrand="Piloto" />
      </div>

      {/* Hero / Carousel */}
      <main className="flex-1 flex flex-col px-6 justify-center max-w-lg mx-auto w-full">
        <div className="relative min-h-[300px] flex flex-col items-center text-center">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`absolute inset-0 flex flex-col items-center transition-all duration-700 ${
                index === currentStep 
                  ? "opacity-100 translate-x-0 scale-100" 
                  : "opacity-0 translate-x-12 scale-95 pointer-events-none"
              }`}
            >
              <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6">
                <span className="text-[9px] font-black tracking-[0.2em] uppercase text-white/50">{step.badge}</span>
              </div>
              <div className="h-20 w-20 rounded-[28px] bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-2xl shadow-black/50">
                {step.icon}
              </div>
              <h2 className="text-3xl font-black tracking-tighter mb-4 italic uppercase leading-none">
                {step.title}
              </h2>
              <p className="text-sm text-white/40 leading-relaxed font-medium">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {steps.map((_, i) => (
            <div 
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentStep ? "w-8 bg-rovya-orange" : "w-2 bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Requirements Note */}
        <div className="mt-12 p-4 bg-white/5 border border-white/5 rounded-2xl flex items-start gap-3">
          <MapPin size={16} className="text-white/30 shrink-0 mt-0.5" />
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider leading-relaxed">
            A disponibilidade de novos cadastros depende da demanda ativa em sua cidade.
          </p>
        </div>
      </main>

      {/* CTAs */}
      <div className="p-6 pb-12 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
        <button 
          onClick={() => navigate({ to: "/piloto/entrar" })}
          className="w-full h-16 bg-porcelain text-navy rounded-3xl font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3 hover:bg-white active:scale-95 transition-all shadow-xl shadow-black/20"
        >
          Já sou cadastrado
          <ArrowRight size={16} strokeWidth={3} />
        </button>
        
        <button 
          onClick={() => navigate({ to: "/piloto/entrar" })} // Reusing entry for demo flow
          className="w-full h-16 bg-white/5 text-porcelain border border-white/10 rounded-3xl font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3 hover:bg-white/10 active:scale-95 transition-all"
        >
          Quero ser piloto
          <Smartphone size={16} strokeWidth={2} className="text-white/40" />
        </button>
      </div>
    </div>
  );
}
