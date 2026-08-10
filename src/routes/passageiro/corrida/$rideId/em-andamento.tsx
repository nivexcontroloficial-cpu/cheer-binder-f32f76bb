import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Shield, MapPin, Navigation, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/passageiro/corrida/$rideId/em-andamento")({
  component: InProgressRideScreen,
});

function InProgressRideScreen() {
  const { rideId } = useParams({ from: "/passageiro/corrida/$rideId/em-andamento" });
  const navigate = useNavigate();
  const [progress, setProgress] = useState(35);
  const [eta, setEta] = useState(12);
  const [gpsStatus, setGpsStatus] = useState<"stable" | "unstable">("stable");
  const [isDesvioOpen, setIsDesvioOpen] = useState(false);
  const [isAltDestConfirmOpen, setIsAltDestConfirmOpen] = useState(false);
  const [destination, setDestination] = useState("Vila Setti, Jacarezinho");
  const [price, setPrice] = useState(18.0);
  const [isEncerrarConfirmOpen, setIsEncerrarConfirmOpen] = useState(false);
  const [desvioResult, setDesvioResult] = useState<string | null>(null);

  useEffect(() => {
    if (gpsStatus === "unstable") return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + 0.5;
      });
      setEta((prev) => {
        if (prev <= 2) return 2;
        return prev > 5 ? prev - 1 : prev;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [gpsStatus]);

  const pilot = {
    name: "Carlos H.",
    initials: "CH",
    vehicle: "Honda CG 160 • ABC1D23",
  };

  const applyAltDestination = () => {
    setDestination("Shopping Jacarezinho, Centro");
    setPrice(21.0);
    setIsAltDestConfirmOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-navy relative overflow-hidden">
      <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-start gap-2 animate-in fade-in duration-700">
        <Info size={14} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="text-[9px] font-bold text-amber-900 leading-tight">
          Demonstração local: trajeto, GPS, preço e ações são simulados.
        </p>
      </div>

      <div className="flex-1 bg-slate-50 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(#111827 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <svg className="absolute inset-0 w-full h-full p-20" aria-hidden="true">
          <path
            d="M 50 400 Q 200 300 350 100"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M 50 400 Q 200 300 350 100"
            fill="none"
            stroke="#F97316"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="500"
            strokeDashoffset={500 - progress * 5}
            className="transition-all duration-1000 ease-linear"
          />
          <g
            transform={`translate(${50 + progress * 3}, ${400 - progress * 3})`}
            className="transition-all duration-1000 ease-linear"
          >
            <circle r="12" fill="white" className="shadow-md" />
            <circle r="10" fill="#F97316" />
            <Navigation
              size={12}
              className="text-white absolute -translate-x-1.5 -translate-y-1.5 rotate-45"
              fill="currentColor"
            />
          </g>
          <g transform="translate(350, 100)">
            <circle r="8" fill="#F97316" className="animate-ping opacity-20" />
            <MapPin
              size={24}
              className="text-navy -translate-x-3 -translate-y-6"
              fill="currentColor"
            />
          </g>
        </svg>

        <div className="absolute top-8 left-6 right-6">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-slate-100">
            <h1 className="text-xl font-black italic uppercase tracking-tight text-navy mb-4">
              Corrida em andamento
            </h1>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mt-1">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Origem
                  </span>
                  <span className="text-sm font-bold text-navy italic">Centro, Jacarezinho</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mt-1">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Destino
                  </span>
                  <span className="text-sm font-bold text-navy italic">{destination}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className={gpsStatus === "unstable" ? "text-red-500" : "text-slate-400"}>
                    {gpsStatus === "unstable" ? "GPS Instável — Simulado" : "Progresso do Trajeto"}
                  </span>
                  <span className="text-navy italic">{eta} min restantes</span>
                </div>
                <Progress
                  value={progress}
                  className="h-2 bg-slate-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white px-6 pb-8 pt-4 space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-t-[40px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-navy text-white flex items-center justify-center text-xl font-black italic">
              {pilot.initials}
            </div>
            <div>
              <h3 className="text-lg font-black italic tracking-tighter text-navy">{pilot.name}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {pilot.vehicle}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
              Valor
            </span>
            <span className="text-xl font-black italic text-navy">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setGpsStatus((s) => (s === "stable" ? "unstable" : "stable"))}
            aria-pressed={gpsStatus === "unstable"}
            className="bg-slate-50 border border-slate-100 rounded-2xl p-3 font-black text-[9px] uppercase text-navy hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-navy"
          >
            {gpsStatus === "stable" ? "Simular GPS Instável" : "Restaurar sinal"}
          </button>
          <button
            type="button"
            onClick={() => setIsDesvioOpen(true)}
            className="bg-slate-50 border border-slate-100 rounded-2xl p-3 font-black text-[9px] uppercase text-navy hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-navy"
          >
            Simular desvio
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsAltDestConfirmOpen(true)}
          className="w-full h-12 bg-white border-2 border-dashed border-navy text-navy rounded-2xl font-black uppercase text-[10px] hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-navy"
        >
          Solicitar alteração de destino — simulado
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => navigate({ to: "/passageiro/seguranca", search: { rideId } })}
            className="h-12 bg-slate-50 text-navy rounded-2xl font-black uppercase text-[9px] flex items-center justify-center gap-2 hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-navy"
            aria-label="Central de Segurança"
          >
            <Shield size={14} /> Segurança
          </button>
          <button
            type="button"
            onClick={() =>
              navigate({ to: "/passageiro/denunciar/$rideId", params: { rideId: rideId || "" } })
            }
            className="h-12 bg-slate-50 text-navy rounded-2xl font-black uppercase text-[9px] flex items-center justify-center gap-2 hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-navy"
            aria-label="Reportar problema"
          >
            <AlertTriangle size={14} /> Denunciar
          </button>
        </div>

        <Button
          onClick={() => setIsEncerrarConfirmOpen(true)}
          className="w-full h-14 bg-navy text-white rounded-2xl font-black uppercase italic text-[11px] hover:bg-navy/90 transition-all active:scale-[0.98]"
        >
          Encerrar corrida simulada
        </Button>
      </div>

      <Dialog open={isDesvioOpen} onOpenChange={setIsDesvioOpen}>
        <DialogContent className="rounded-[32px] p-8 border-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-black italic uppercase tracking-tight text-navy">
              Desvio de rota simulado
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium">
              Detectamos uma alteração no trajeto simulado. Está tudo bem?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 pt-4">
            <Button
              onClick={() => {
                setIsDesvioOpen(false);
                setDesvioResult("Evento de rota simulado marcado como seguro.");
              }}
              className="w-full py-6 rounded-2xl bg-navy text-white font-black italic uppercase tracking-widest text-[11px]"
            >
              Está tudo bem
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsDesvioOpen(false);
                setDesvioResult("Atendimento simulado solicitado. Nenhuma equipe real foi acionada.");
              }}
              className="w-full py-6 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-500"
            >
              Preciso de ajuda
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAltDestConfirmOpen} onOpenChange={setIsAltDestConfirmOpen}>
        <AlertDialogContent className="rounded-[32px] p-8 border-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black italic uppercase tracking-tight text-navy">
              Alterar Destino?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 font-medium pt-2">
              <span className="block mb-2">Destino atual: Vila Setti, Jacarezinho</span>
              <span className="block font-bold text-navy italic">
                Novo destino: Shopping Jacarezinho, Centro
              </span>
              <span className="block mt-2">Valor atual: R$ 18,00</span>
              <span className="block font-bold text-emerald-600 italic">Novo valor: R$ 21,00</span>
              <span className="block mt-4 text-[9px] uppercase tracking-widest">
                Nenhuma solicitação real foi enviada.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 mt-4">
            <AlertDialogAction
              onClick={applyAltDestination}
              className="w-full py-6 rounded-2xl bg-navy text-white font-black italic uppercase tracking-widest text-[11px] border-none"
            >
              Confirmar Alteração
            </AlertDialogAction>
            <AlertDialogCancel className="w-full py-6 rounded-2xl border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Voltar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isEncerrarConfirmOpen} onOpenChange={setIsEncerrarConfirmOpen}>
        <AlertDialogContent className="rounded-[32px] p-8 border-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black italic uppercase tracking-tight text-navy">
              Encerrar corrida?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 font-medium pt-2">
              Esta ação concluirá a simulação da corrida atual.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 mt-4">
            <AlertDialogAction
              onClick={() =>
                navigate({ to: "/passageiro/corrida/$rideId/concluida", params: { rideId } })
              }
              className="w-full py-6 rounded-2xl bg-navy text-white font-black italic uppercase tracking-widest text-[11px] border-none"
            >
              Confirmar Encerramento
            </AlertDialogAction>
            <AlertDialogCancel className="w-full py-6 rounded-2xl border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Voltar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
