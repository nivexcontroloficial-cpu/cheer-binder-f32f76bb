import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RovyaBrand } from "@/components/RovyaBrand";
import { ChevronLeft, Camera, RefreshCcw, Check, User, ShieldCheck, AlertCircle, Info, ScanFace } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useDemo } from "@/state/DemoContext";
import { toast } from "sonner";

export const Route = createFileRoute("/piloto/cadastro/foto")({
  component: PilotRegistrationPhoto,
});

type PhotoStep = "instruction" | "camera" | "preview" | "liveness";

function PilotRegistrationPhoto() {
  const navigate = useNavigate();
  const { pilotRegistration, updatePilotRegistration } = useDemo();
  
  const [step, setStep] = useState<PhotoStep>(pilotRegistration.fotoUrl ? "preview" : "instruction");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: 400, height: 400 } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStep("camera");
    } catch (err) {
      toast.error("Erro ao acessar a câmera. Verifique as permissões.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const takePhoto = () => {
    // Simulated photo taking - in a real app we'd capture the canvas
    // For demo, we just use a placeholder or the video stream current state
    stopCamera();
    updatePilotRegistration({ fotoUrl: "captured-mock-url" });
    setStep("preview");
  };

  const handleLiveness = () => {
    setStep("liveness");
    setTimeout(() => {
      toast.success("Prova de vida concluída!");
      setTimeout(() => {
         navigate({ to: "/piloto/entrar" });
         toast("Cadastro enviado para análise!", {
           description: "Acompanhe o status fazendo login com seu celular.",
           icon: <ShieldCheck className="text-rovya-green" />
         });
      }, 1500);
    }, 3000);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-navy text-porcelain font-sans">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-navy/80 backdrop-blur-md z-10">
        <button 
          onClick={() => step === "camera" ? setStep("instruction") : navigate({ to: "/piloto/cadastro/pessoal" })}
          className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rovya-orange mb-1">Passo 2 de 2</p>
          <div className="flex gap-1.5">
            <div className="h-1 w-8 bg-rovya-orange rounded-full" />
            <div className="h-1 w-8 bg-rovya-orange rounded-full" />
          </div>
        </div>
        <div className="w-12 h-12" />
      </header>

      <main className="flex-1 flex flex-col px-6 pt-4 pb-20 max-w-lg mx-auto w-full items-center">
        {step === "instruction" && (
          <div className="w-full animate-in fade-in slide-in-from-bottom duration-500">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-2 text-center">FOTO DE PERFIL</h1>
            <p className="text-sm text-white/40 mb-10 text-center">
              Esta foto será visível para o passageiro. Use um local iluminado e não use óculos escuros ou boné.
            </p>

            <div className="space-y-4 mb-12">
              <TipItem icon={<Check className="text-rovya-green" size={16} />} text="Rosto centralizado e visível" />
              <TipItem icon={<Check className="text-rovya-green" size={16} />} text="Fundo neutro e boa iluminação" />
              <TipItem icon={<AlertCircle className="text-rovya-orange" size={16} />} text="Evite acessórios que cubram o rosto" />
            </div>

            <div className="relative w-48 h-48 mx-auto mb-12">
              <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full animate-pulse" />
              <div className="absolute inset-4 bg-white/5 rounded-full flex items-center justify-center">
                 <User size={64} className="text-white/10" />
              </div>
            </div>

            <button 
              onClick={startCamera}
              className="w-full h-16 bg-porcelain text-navy rounded-3xl font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3 hover:bg-white active:scale-95 transition-all shadow-xl"
            >
              <Camera size={20} />
              Abrir Câmera
            </button>
          </div>
        )}

        {step === "camera" && (
          <div className="w-full animate-in zoom-in-95 duration-500 flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-[320px] rounded-[48px] overflow-hidden border-4 border-rovya-orange shadow-[0_0_50px_rgba(249,115,22,0.3)] mb-10">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover scale-x-[-1]"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-[80%] h-[80%] border-2 border-white/30 border-dashed rounded-full" />
              </div>
            </div>

            <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-10 text-center animate-pulse">
              Centralize seu rosto no círculo
            </p>

            <button 
              onClick={takePhoto}
              className="h-20 w-20 rounded-full bg-white border-8 border-white/20 flex items-center justify-center active:scale-90 transition-all shadow-2xl"
            >
              <div className="h-full w-full rounded-full border-2 border-navy/10" />
            </button>
          </div>
        )}

        {step === "preview" && (
          <div className="w-full animate-in fade-in slide-in-from-bottom duration-500 flex flex-col items-center">
             <h2 className="text-2xl font-black italic uppercase tracking-tight mb-8">FICOU BOA?</h2>
             
             <div className="relative w-64 h-64 mb-12">
                <div className="absolute inset-0 bg-rovya-orange rounded-[64px] blur-3xl opacity-20" />
                <div className="relative w-full h-full bg-white/5 rounded-[64px] border-2 border-white/10 overflow-hidden">
                   {/* Simulated captured image */}
                   <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <User size={80} className="text-white/20" />
                      <p className="absolute bottom-4 text-[10px] font-black uppercase tracking-widest text-white/40">Foto Capturada</p>
                   </div>
                </div>
                <div className="absolute -bottom-4 -right-4 h-12 w-12 bg-rovya-green rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-navy">
                   <Check size={24} className="text-white" strokeWidth={3} />
                </div>
             </div>

             <div className="w-full space-y-4">
                <button 
                  onClick={handleLiveness}
                  className="w-full h-16 bg-rovya-orange text-white rounded-3xl font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3 hover:bg-rovya-orange/90 active:scale-95 transition-all"
                >
                  Confirmar Foto
                </button>
                <button 
                  onClick={startCamera}
                  className="w-full h-16 bg-white/5 text-white/60 rounded-3xl font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3 hover:bg-white/10 active:scale-95 transition-all"
                >
                  <RefreshCcw size={16} />
                  Tirar Outra
                </button>
             </div>
          </div>
        )}

        {step === "liveness" && (
          <div className="w-full animate-in zoom-in-95 duration-500 flex flex-col items-center">
             <div className="h-20 w-20 bg-rovya-orange/10 rounded-full flex items-center justify-center mb-8">
                <ScanFace size={40} className="text-rovya-orange animate-pulse" />
             </div>
             <h2 className="text-2xl font-black italic uppercase tracking-tight mb-2">PROVA DE VIDA</h2>
             <p className="text-sm text-white/40 mb-12 text-center">
                Mova levemente a cabeça em círculos para validarmos sua identidade em tempo real.
             </p>

             <div className="relative w-full aspect-square max-w-[280px]">
                <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                <div className="absolute inset-0 rounded-full border-t-4 border-rovya-orange animate-spin duration-[2000ms]" />
                <div className="absolute inset-4 rounded-full bg-white/5 flex items-center justify-center overflow-hidden">
                   <div className="w-full h-full bg-gradient-to-tr from-navy to-white/5 opacity-50" />
                </div>
             </div>
             
             <p className="mt-12 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                Processando biometria simulada...
             </p>
          </div>
        )}
      </main>

      <div className="p-6">
        <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl">
          <Info size={16} className="text-white/30 shrink-0" />
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider leading-relaxed">
            Sua foto é usada para o passageiro te reconhecer no embarque e para conferência de identidade.
          </p>
        </div>
      </div>
    </div>
  );
}

function TipItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
      {icon}
      <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">{text}</span>
    </div>
  );
}
