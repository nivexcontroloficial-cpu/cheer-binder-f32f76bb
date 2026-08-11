import { createFileRoute, useNavigate, useParams, Link, useSearch } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Shield, MapPin, Navigation, AlertTriangle, Info } from "lucide-react";
import { ACTIVE_PASSENGER_DEMO_RIDE } from "@/data/passenger-demo-rides";
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
import { z } from "zod";

const searchSchema = z.object({
  technical: z.boolean().default(false),
});

export const Route = createFileRoute("/passageiro/corrida/$rideId/em-andamento")({
  component: InProgressRideScreen,
  validateSearch: (search) => searchSchema.parse(search),
});

function InProgressRideScreen() {
  const { rideId } = useParams({ from: "/passageiro/corrida/$rideId/em-andamento" });
  const { technical } = useSearch({ from: "/passageiro/corrida/$rideId/em-andamento" });
  const navigate = useNavigate();

  const isValidRide = useMemo(() => rideId === ACTIVE_PASSENGER_DEMO_RIDE.id, [rideId]);

  const [progress, setProgress] = useState(35);
  const [eta, setEta] = useState(12);
  const [gpsStatus, setGpsStatus] = useState<"stable" | "unstable">("stable");
  const [isDesvioOpen, setIsDesvioOpen] = useState(false);
  const [isAltDestConfirmOpen, setIsAltDestConfirmOpen] = useState(false);
  const [destination, setDestination] = useState(ACTIVE_PASSENGER_DEMO_RIDE.destination.address);
  const [price, setPrice] = useState(ACTIVE_PASSENGER_DEMO_RIDE.fare);
  const [isEncerrarConfirmOpen, setIsEncerrarConfirmOpen] = useState(false);
  const [desvioResult, setDesvioResult] = useState<string | null>(null);

  useEffect(() => {
    if (!isValidRide || gpsStatus === "unstable") return;
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
  }, [gpsStatus, isValidRide]);

  if (!isValidRide) {
    return (
      <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy p-8 items-center justify-center text-center">
        <h1 className="text-xl font-black italic uppercase tracking-tight mb-2">Corrida simulada não encontrada</h1>
      </div>
    );
  }

  const pilot = {
    name: ACTIVE_PASSENGER_DEMO_RIDE.driver.name,
    initials: "CH",
    vehicle: `${ACTIVE_PASSENGER_DEMO_RIDE.vehicle.model} • ${ACTIVE_PASSENGER_DEMO_RIDE.vehicle.plate}`,
  };

  const applyAltDestination = () => {
    setDestination("Shopping Jacarezinho — Centro, Jacarezinho");
    setPrice(21.0);
    setIsAltDestConfirmOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-navy relative overflow-hidden">
      <h1 className="sr-only">Corrida em andamento</h1>
      
      <div className="flex-1 bg-slate-50 relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full p-20" aria-hidden="true">
           <path d="M 50 400 Q 200 300 350 100" fill="none" stroke="#E2E8F0" strokeWidth="6" />
        </svg>

        <div className="absolute top-8 left-6 right-6">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-slate-100">
            <h2 className="text-xl font-black italic uppercase tracking-tight text-navy mb-4">Corrida em andamento — {rideId}</h2>
            <div className="space-y-2">
                <Progress value={progress} className="h-2 bg-slate-100" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white px-6 pb-8 pt-4 space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-t-[40px]">
        <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black italic tracking-tighter text-navy">{pilot.name}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pilot.vehicle}</p>
            </div>
        </div>

        {technical && (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setGpsStatus((s) => (s === "stable" ? "unstable" : "stable"))}
              className="bg-slate-900 text-white rounded-2xl p-3 font-black text-[9px] uppercase"
            >
              {gpsStatus === "stable" ? "Simular GPS Instável" : "Restaurar sinal"}
            </button>
            <button
              type="button"
              onClick={() => setIsDesvioOpen(true)}
              className="bg-slate-900 text-white rounded-2xl p-3 font-black text-[9px] uppercase"
            >
              Simular desvio
            </button>
          </div>
        )}

        <Button
          onClick={() => setIsEncerrarConfirmOpen(true)}
          className="w-full h-14 bg-navy text-white rounded-2xl font-black uppercase italic text-[11px]"
        >
          Encerrar corrida simulada
        </Button>
      </div>

      <Dialog open={isDesvioOpen} onOpenChange={setIsDesvioOpen}>
        <DialogContent className="rounded-[32px] p-8">
           <DialogHeader>
             <DialogTitle>Desvio de rota simulado</DialogTitle>
           </DialogHeader>
           <Button onClick={() => setIsDesvioOpen(false)}>Está tudo bem</Button>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isEncerrarConfirmOpen} onOpenChange={setIsEncerrarConfirmOpen}>
        <AlertDialogContent className="rounded-[32px] p-8">
            <AlertDialogHeader>
              <AlertDialogTitle>Encerrar corrida?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => navigate({ to: "/passageiro/corrida/$rideId/concluida", params: { rideId }, search: technical ? { technical } : undefined })}>Confirmar</AlertDialogAction>
              <AlertDialogCancel>Voltar</AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
