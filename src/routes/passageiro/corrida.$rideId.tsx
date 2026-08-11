import {
  createFileRoute,
  useNavigate,
  useParams,
  Outlet,
  useLocation,
  useSearch,
} from "@tanstack/react-router";
import { ACTIVE_PASSENGER_DEMO_RIDE } from "@/data/passenger-demo-rides";
import { useState, useEffect, useMemo, useRef } from "react";
import { Info, Navigation as NavigationIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";

const searchSchema = z.object({
  technical: z.boolean().catch(false).default(false),
});

export const Route = createFileRoute("/passageiro/corrida/$rideId")({
  component: ActiveRideScreen,
  validateSearch: (search) => searchSchema.parse(search),
});

type ConnectionStatus = "stable" | "unstable" | "stopped" | "reconnecting";

function ActiveRideScreen() {
  const { rideId } = useParams({ from: "/passageiro/corrida/$rideId" });
  const { technical } = useSearch({ from: "/passageiro/corrida/$rideId" });
  const navigate = useNavigate();
  const location = useLocation();

  const isValidRide = useMemo(() => rideId === ACTIVE_PASSENGER_DEMO_RIDE.id, [rideId]);

  const [progress, setProgress] = useState(0);
  const [hasArrived, setHasArrived] = useState(false);
  const [isWaitTimerActive, setIsWaitTimerActive] = useState(false);
  const [waitTime, setWaitTime] = useState(300);
  const [pinConfirmed, setPinConfirmed] = useState(false);

  const timer500mRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const timerArrivalRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const autoPinConfirmRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const pilot = {
    name: ACTIVE_PASSENGER_DEMO_RIDE.driver.name,
    vehicle: {
      model: ACTIVE_PASSENGER_DEMO_RIDE.vehicle.model,
      color: ACTIVE_PASSENGER_DEMO_RIDE.vehicle.color,
      plate: ACTIVE_PASSENGER_DEMO_RIDE.vehicle.plate,
    },
  };

  const handlePilotArrival = () => {
    setHasArrived(true);
    setProgress(100);
    setIsWaitTimerActive(true);
    toast.success(`O piloto ${pilot.name} chegou!`, { duration: 5000 });
  };

  // Normal mode: auto-progress
  useEffect(() => {
    if (!isValidRide || technical || hasArrived) return;

    timer500mRef.current = setTimeout(() => {
      toast.info("Piloto próximo!");
    }, 8000);

    timerArrivalRef.current = setTimeout(() => {
      handlePilotArrival();
    }, 16000);

    return () => {
      if (timer500mRef.current) clearTimeout(timer500mRef.current);
      if (timerArrivalRef.current) clearTimeout(timerArrivalRef.current);
    };
  }, [isValidRide, technical, hasArrived]);

  // Normal mode: auto-confirm PIN
  useEffect(() => {
    if (!isValidRide || technical || !hasArrived || pinConfirmed) return;

    autoPinConfirmRef.current = setTimeout(() => {
      setPinConfirmed(true);
      toast.success("PIN confirmado pelo piloto — simulação.");
      navigate({
        to: "/passageiro/corrida/$rideId/em-andamento",
        params: { rideId },
        search: (prev: any) => prev,
      });
    }, 10000);

    return () => {
      if (autoPinConfirmRef.current) clearTimeout(autoPinConfirmRef.current);
    };
  }, [isValidRide, technical, hasArrived, pinConfirmed, rideId, navigate]);

  const isNestedRideRoute =
    location.pathname.endsWith("/em-andamento") || location.pathname.endsWith("/concluida");

  if (isNestedRideRoute) return <Outlet />;

  if (!isValidRide) {
    return (
      <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy p-8 items-center justify-center text-center">
        <h1 className="text-xl font-black italic uppercase tracking-tight mb-2">
          Corrida simulada não encontrada
        </h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy overflow-hidden relative">
      <h1 className="sr-only">Corrida simulada</h1>

      <div className="z-50 bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-start gap-2">
        <Info size={14} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="text-[9px] font-bold text-amber-900 leading-tight">
          Demonstração local: fluxo simulado de embarque.
        </p>
      </div>

      <div className="absolute inset-0 bg-slate-100 z-0">
        <svg className="absolute inset-0 w-full h-full">
          <path
            d="M 100 200 L 250 400 L 400 300"
            fill="none"
            stroke="#2F80ED"
            strokeWidth="8"
            strokeDasharray="400"
            strokeDashoffset={400 - progress * 4}
            className="transition-all duration-1000"
          />
        </svg>
      </div>

      <div className="z-10 relative flex-1 p-6 pb-[env(safe-area-inset-bottom)] flex flex-col justify-end">
        {hasArrived && !pinConfirmed && (
          <div
            className="bg-white border-2 border-emerald-500 p-5 rounded-3xl shadow-2xl space-y-3"
            role="status"
            aria-live="polite"
          >
            <h2 className="text-[11px] font-black uppercase text-emerald-600">
              Aguardando confirmação do piloto
            </h2>
            <p className="text-[10px] text-slate-600">
              Informe o PIN{" "}
              <span className="font-bold text-navy">{ACTIVE_PASSENGER_DEMO_RIDE.pin}</span> ao
              piloto. A corrida começará após a confirmação.
            </p>
            <p className="text-[10px] font-bold text-navy">
              Confirme: {pilot.name}, {pilot.vehicle.model} {pilot.vehicle.plate}
            </p>
          </div>
        )}
      </div>

      {technical && (
        <div className="z-20 bg-slate-900/95 backdrop-blur-sm text-white p-6 m-4 rounded-[32px] border border-white/10 shadow-2xl">
          <h2 className="text-[10px] font-black uppercase text-amber-500 mb-4">
            Ferramentas técnicas
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => handlePilotArrival()} variant="outline" className="h-11">
              Simular Chegada
            </Button>
            <Button
              onClick={() => {
                setPinConfirmed(true);
                navigate({
                  to: "/passageiro/corrida/$rideId/em-andamento",
                  params: { rideId },
                  search: { technical: true },
                });
              }}
              variant="outline"
              className="h-11"
            >
              Forçar Início
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
