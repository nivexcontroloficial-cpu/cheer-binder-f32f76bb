import {
  createFileRoute,
  useNavigate,
  useParams,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
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
  Star,
  Info,
  X,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/passageiro/corrida/$rideId")({
  component: ActiveRideScreen,
});

type ConnectionStatus = "stable" | "unstable" | "stopped" | "reconnecting";

function ActiveRideScreen() {
  const { rideId } = useParams({ from: "/passageiro/corrida/$rideId" });
  const navigate = useNavigate();
  const location = useLocation();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [connection, setConnection] = useState<ConnectionStatus>("stable");
  const [eta, setEta] = useState(4);
  const [distanceMeters, setDistanceMeters] = useState(2500); // Começa com 2.5km
  const [progress, setProgress] = useState(0); // 0 a 100
  const [hasArrived, setHasArrived] = useState(false);
  const [isNearAlertVisible, setIsNearAlertVisible] = useState(false);
  const [waitTime, setWaitTime] = useState(300); // 5 minutos em segundos
  const [isWaitTimerActive, setIsWaitTimerActive] = useState(false);
  const [pin] = useState("4827");
  const [isDivergentVehicleAlertOpen, setIsDivergentVehicleAlertOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(
    new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
  );

  // Dados Mock Obrigatórios do Piloto
  const pilot = {
    name: "Carlos H.",
    rating: 4.96,
    totalRides: 842,
    timeAtRovya: "1 ano",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
    badges: ["Top Piloto", "Seguro"],
    vehicle: {
      model: "Honda CG 160",
      color: "Vermelha",
      plate: "ABC1D23",
    },
  };

  // Simulação de movimento e conexão
  useEffect(() => {
    // Listeners do Simulador
    const handleSimulateArrival = () => {
      handlePilotArrival();
    };

    const handleSimulateTimeOut = () => {
      setWaitTime(0);
      toast.error("Simulação: Tempo de espera esgotado.");
    };

    window.addEventListener("simular-chegada", handleSimulateArrival);
    window.addEventListener("simular-tempo-esgotado", handleSimulateTimeOut);

    if (hasArrived)
      return () => {
        window.removeEventListener("simular-chegada", handleSimulateArrival);
        window.removeEventListener("simular-tempo-esgotado", handleSimulateTimeOut);
      };

    const interval = setInterval(() => {
      // Movimento simulado
      if (connection === "stable" || connection === "unstable") {
        setProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + 0.8;
        });

        // Atualiza distância baseada no progresso (de 2500m até 0m)
        setDistanceMeters((prev) => {
          const next = 2500 - progress * 25;
          return next < 0 ? 0 : next;
        });

        // Atualiza horário sempre que houver movimento
        setLastUpdate(
          new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        );

        // Alerta de 500m
        if (distanceMeters <= 500 && distanceMeters > 450 && !isNearAlertVisible) {
          setIsNearAlertVisible(true);
          toast.info("Seu piloto está próximo! Prepare-se para o embarque.", {
            icon: <Info size={16} className="text-blue-500" />,
            duration: 5000,
          });
        }

        // Atualiza ETA conforme progride
        if (progress > 25 && eta === 4) setEta(3);
        if (progress > 50 && eta === 3) setEta(2);
        if (progress > 75 && eta === 2) setEta(1);
        if (progress >= 95 && eta === 1) setEta(0);
      }
    }, 1500);

    return () => {
      clearInterval(interval);
      window.removeEventListener("simular-chegada", handleSimulateArrival);
      window.removeEventListener("simular-tempo-esgotado", handleSimulateTimeOut);
    };
  }, [progress, connection, eta, distanceMeters, hasArrived, isNearAlertVisible]);

  // Cronômetro de espera
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isWaitTimerActive && waitTime > 0) {
      timer = setInterval(() => {
        setWaitTime((prev) => prev - 1);
      }, 1000);
    } else if (waitTime === 0 && isWaitTimerActive) {
      toast.error(
        "Tempo esgotado. Nesta demonstração, o piloto pode cancelar por não comparecimento.",
        {
          duration: 8000,
        },
      );
      setIsWaitTimerActive(false); // Para o timer no zero
    }
    return () => clearInterval(timer);
  }, [isWaitTimerActive, waitTime]);

  const handlePilotArrival = () => {
    setHasArrived(true);
    setEta(0);
    setProgress(100);
    setDistanceMeters(0);
    setWaitTime(300);
    setIsWaitTimerActive(true);
    toast.success("O piloto Carlos H. chegou ao local de embarque!", {
      duration: 5000,
      icon: <CheckCircle2 className="text-emerald-500" />,
    });
  };

  const handleSafety = () => {
    navigate({
      to: "/passageiro/seguranca",
      search: { rideId },
    });
  };

  const handleStartRide = () => {
    navigate({
      to: "/passageiro/corrida/$rideId/em-andamento",
      params: { rideId },
    });
  };

  if (location.pathname.includes("/em-andamento")) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy overflow-hidden">
      {/* Banner de Transparência */}
      <div className="z-50 bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-start gap-2 animate-in fade-in duration-700">
        <Info size={14} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="text-[9px] font-bold text-amber-900 leading-tight">
          Demonstração local: piloto, trajeto, localização e comunicação são simulados. Nenhum GPS
          real está ativo.
        </p>
      </div>

      <div className="flex-1 relative">
         <div className="p-6">
           <Button onClick={handleStartRide}>Simular Início da Corrida</Button>
           <Button onClick={handleSafety}>Segurança</Button>
         </div>
      </div>
    </div>
  );
}
