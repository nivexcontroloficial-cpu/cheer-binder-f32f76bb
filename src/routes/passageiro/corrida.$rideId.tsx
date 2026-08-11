import {
  createFileRoute,
  useNavigate,
  useParams,
  Outlet,
  useLocation,
  Link,
  useSearch,
} from "@tanstack/react-router";
import { ACTIVE_PASSENGER_DEMO_RIDE } from "@/data/passenger-demo-rides";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  MessageSquare,
  Phone,
  ShieldCheck,
  Share2,
  AlertTriangle,
  Clock,
  Navigation,
  Signal,
  SignalLow,
  WifiOff,
  Info,
  Navigation as NavigationIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";

const searchSchema = z.object({
  technical: z.boolean().default(false),
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

  const [connection, setConnection] = useState<ConnectionStatus>("stable");
  const [eta, setEta] = useState(4);
  const [distanceMeters, setDistanceMeters] = useState(2500);
  const [progress, setProgress] = useState(0);
  const [hasArrived, setHasArrived] = useState(false);
  const [isNearAlertVisible, setIsNearAlertVisible] = useState(false);
  const [waitTime, setWaitTime] = useState(300);
  const [isWaitTimerActive, setIsWaitTimerActive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState("10:00");
  
  const timerRef = useRef<NodeJS.Timeout>();

  const pilot = {
    name: ACTIVE_PASSENGER_DEMO_RIDE.driver.name,
    vehicle: {
      model: ACTIVE_PASSENGER_DEMO_RIDE.vehicle.model,
      color: ACTIVE_PASSENGER_DEMO_RIDE.vehicle.color,
      plate: ACTIVE_PASSENGER_DEMO_RIDE.vehicle.plate,
    },
  };

  useEffect(() => {
    if (!isValidRide || technical) return;

    // Progressão automática
    const startProgress = () => {
        // Intervalo 8s para 500m (aproximadamente)
        timerRef.current = setTimeout(() => {
            handleSimulate500m();
            
            // Intervalo 8s (16s totais) para chegada
            timerRef.current = setTimeout(() => {
                handlePilotArrival();
            }, 8000);
        }, 8000);
    };

    startProgress();

    return () => {
        if(timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isValidRide, technical]);

  useEffect(() => {
    if (!isValidRide || !technical) return;

    const interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 100 : prev + 0.8));
        setDistanceMeters((prev) => {
          const next = 2500 - progress * 25;
          return next < 0 ? 0 : next;
        });
        setLastUpdate(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", hour12: false }));
    }, 1500);

    return () => clearInterval(interval);
  }, [isValidRide, technical, progress]);

  const handlePilotArrival = () => {
    setHasArrived(true);
    setEta(0);
    setProgress(100);
    setDistanceMeters(0);
    setWaitTime(300);
    setIsWaitTimerActive(true);
    toast.success(`O piloto ${pilot.name} chegou ao local de embarque!`, {
      duration: 5000,
    });
  };

  const handleSimulate500m = () => {
    if (hasArrived) return;
    setDistanceMeters(500);
    setProgress(80);
    setEta(1);
    setIsNearAlertVisible(true);
    toast.info("Seu piloto está próximo!", { duration: 5000 });
  };

  const handleResetEmbark = () => {
    setHasArrived(false);
    setIsWaitTimerActive(false);
    setWaitTime(300);
    setProgress(0);
    setDistanceMeters(2500);
    setEta(ACTIVE_PASSENGER_DEMO_RIDE.duration);
    setIsNearAlertVisible(false);
  };

  const formatWaitTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isNestedRideRoute = location.pathname.endsWith("/em-andamento") || location.pathname.endsWith("/concluida");

  if (isNestedRideRoute) return <Outlet />;

  if (!isValidRide) {
    return (
      <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy p-8 items-center justify-center text-center">
        <h1 className="text-xl font-black italic uppercase tracking-tight mb-2">Corrida simulada não encontrada</h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy overflow-hidden">
      <h1 className="sr-only">Piloto a caminho</h1>
      
      {/* Mapa */}
      <div className="absolute inset-0 bg-slate-100 z-0">
        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
           <path d="M 100 200 L 250 400 L 400 300" fill="none" stroke="#E2E8F0" strokeWidth="8" />
           <path d="M 100 200 L 250 400 L 400 300" fill="none" stroke="#2F80ED" strokeWidth="8" strokeDasharray="400" strokeDashoffset={400 - progress * 4} className="transition-all duration-1000" />
        </svg>
      </div>

      <div className="z-10 relative flex-1 p-6">
        {distanceMeters <= 500 && !hasArrived && (
            <div className="bg-rovya-orange text-white px-4 py-3 rounded-2xl shadow-xl" role="status" aria-live="polite">
                Piloto Próximo: O {pilot.name} está a menos de 500m.
            </div>
        )}
        
        {hasArrived && (
            <div className="bg-white p-5 rounded-3xl shadow-2xl" role="status" aria-live="polite">
                Piloto no local: {pilot.name}, {pilot.vehicle.model} {pilot.vehicle.color} ({pilot.vehicle.plate})
            </div>
        )}
      </div>

      {technical && (
        <div className="z-20 bg-slate-900 text-white p-4 m-4 rounded-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2">Ferramentas técnicas da demonstração</p>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={handleSimulate500m} size="sm">Simular 500m</Button>
            <Button onClick={handlePilotArrival} size="sm">Simular Chegada</Button>
            <Button onClick={handleResetEmbark} size="sm">Resetar Embarque</Button>
          </div>
        </div>
      )}
    </div>
  );
}
