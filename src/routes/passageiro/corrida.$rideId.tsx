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

  const handleSimulate500m = () => {
    if (hasArrived) return;

    setDistanceMeters(500);
    setProgress(80); // 80% de 2500m é onde começa os 500m
    setEta(1);
    if (!isNearAlertVisible) {
      setIsNearAlertVisible(true);
      toast.info("Simulação: Seu piloto está próximo!", {
        icon: <Info size={16} className="text-blue-500" />,
        duration: 5000,
      });
    }
  };

  const handleResetEmbark = () => {
    setHasArrived(false);
    setIsWaitTimerActive(false);
    setWaitTime(300);
    setProgress(0);
    setDistanceMeters(2500);
    setEta(4);
    setIsNearAlertVisible(false);
  };

  const formatWaitTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleQuickMessage = (msg: string) => {
    toast.success(`Simulação: "${msg}" adicionada apenas à demonstração local. Nada foi enviado.`);
  };

  const handleReportDivergent = () => {
    navigate({ to: "/passageiro/denunciar/$rideId", params: { rideId: rideId || "" } });
  };

  const handleCall = () => {
    toast.info("Chamada protegida simulada. Nenhuma ligação real foi iniciada.");
  };

  const handleChat = () => {
    navigate({ to: "/passageiro/chat/$rideId", params: { rideId: rideId || "" } });
  };

  const handleShare = () => {
    toast.success("Compartilhamento simulado. Nenhum link foi criado, copiado ou enviado.");
  };

  const handleSafety = () => {
    navigate({
      to: "/passageiro/seguranca",
      search: { rideId },
    });
  };

  const handleCancelRide = () => {
    navigate({ to: "/passageiro/cancelar/$rideId", params: { rideId: rideId || "" } });
  };

  if (location.pathname.includes("/em-andamento")) {
    return <Outlet />;
  }

  const rideSummary = {
    price: "R$ 18,00",
    method: "Dinheiro",
    details: "Pagamento presencial demonstrativo",
  };

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

      {/* Mapa Esquemático de Fundo (Tela Cheia) */}
      <div
        className="absolute inset-0 bg-slate-100 z-0"
        role="img"
        aria-label="Mapa esquemático da demonstração"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#111827 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        ></div>

        {/* Rota Animada */}
        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
          <path
            d="M 100 200 L 250 400 L 400 300"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 100 200 L 250 400 L 400 300"
            fill="none"
            stroke="#2F80ED"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="400"
            strokeDashoffset={400 - progress * 4}
            className="transition-all duration-1000 ease-linear"
          />

          {/* Marcador do Piloto (Moto) */}
          <g
            transform={`translate(${100 + progress * 3}, ${200 + progress * 1})`}
            className="transition-all duration-1000 ease-linear"
          >
            <circle r="20" fill="white" className="shadow-lg" />
            <circle
              r="18"
              fill="#F97316"
              className={connection === "reconnecting" ? "animate-pulse opacity-50" : ""}
            />
            <foreignObject x="-10" y="-10" width="20" height="20">
              <Navigation size={20} className="text-white rotate-45" fill="currentColor" />
            </foreignObject>
          </g>

          {/* Marcador de Embarque (Destino do Piloto agora) */}
          <g transform="translate(400, 300)">
            <circle r="8" fill="#2F80ED" className="animate-ping opacity-20" />
            <circle r="4" fill="#2F80ED" />
          </g>
        </svg>

        {/* Indicadores Flutuantes no Mapa */}
        <div className="absolute top-24 left-6 right-6 flex flex-col gap-3">
          {/* Status de Conexão e Última Atualização */}
          <div className="flex flex-col gap-2 self-start">
            <div
              className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-100 shadow-sm flex items-center gap-2"
              aria-live="polite"
            >
              {connection === "stable" && <Signal size={12} className="text-emerald-500" />}
              {connection === "unstable" && <SignalLow size={12} className="text-amber-500" />}
              {connection === "stopped" && <AlertTriangle size={12} className="text-amber-500" />}
              {connection === "reconnecting" && (
                <WifiOff size={12} className="text-red-500 animate-pulse" />
              )}
              <span className="text-[9px] font-black uppercase tracking-widest text-navy">
                {connection === "stable" && "GPS simulado estável"}
                {connection === "unstable" && "GPS simulado instável"}
                {connection === "stopped" && "Piloto simulado parado"}
                {connection === "reconnecting" && "Reconectando simulação..."}
              </span>
            </div>
            {lastUpdate && (
              <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg self-start border border-slate-50 shadow-sm">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">
                  Última atualização simulada: {lastUpdate}
                </span>
              </div>
            )}
          </div>

          {/* Banner de Proximidade (500m) */}
          {distanceMeters <= 500 && !hasArrived && (
            <div
              className="animate-in slide-in-from-top duration-500 bg-rovya-orange text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/20"
              aria-live="polite"
            >
              <div className="bg-white/20 p-2 rounded-xl">
                <Navigation size={18} className="animate-pulse" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.1em]">
                  Piloto Próximo
                </span>
                <span className="text-xs font-bold leading-tight">
                  O Carlos H. está a menos de 500m. (Simulação)
                </span>
              </div>
            </div>
          )}

          {/* Estado de Chegada / Espera */}
          {hasArrived && (
            <div
              className="animate-in zoom-in duration-500 bg-white border-2 border-emerald-500 px-5 py-4 rounded-3xl shadow-2xl flex flex-col gap-3"
              aria-live="polite"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                    Piloto no local
                  </span>
                </div>
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${waitTime < 60 ? "bg-red-50 text-red-600" : "bg-slate-50 text-navy"}`}
                >
                  <Clock size={12} className={waitTime < 60 ? "animate-pulse" : ""} />
                  <span className="text-xs font-black italic">{formatWaitTime(waitTime)}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-navy leading-tight">
                  Confirme piloto e veículo:{" "}
                  <span className="underline decoration-emerald-500 decoration-2 underline-offset-2 tracking-widest">
                    {pilot.name}, {pilot.vehicle.model} {pilot.vehicle.color} ({pilot.vehicle.plate}
                    )
                  </span>
                </p>
                <p className="text-[9px] text-slate-500 font-medium">
                  {waitTime > 0
                    ? "O tempo de espera cortesia está correndo."
                    : "Tempo esgotado. Nesta demonstração, o piloto pode cancelar por não comparecimento."}
                </p>
              </div>
            </div>
          )}

          {/* Card de ETA (Oculto se chegou) */}
          {!hasArrived && (
            <div className="bg-navy text-white px-5 py-3 rounded-2xl shadow-xl self-start flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Chegada em
                </span>
                <span className="text-xl font-black italic tracking-tighter">
                  {eta > 0 ? `${eta} min` : "Chegando!"}
                </span>
              </div>
              <div className="h-8 w-px bg-white/10" aria-hidden="true"></div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Ponto
                </span>
                <span className="text-[10px] font-black uppercase tracking-tight truncate max-w-[120px]">
                  Centro, Jacarezinho
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interface Inferior Interativa */}
      <div className="mt-auto z-10">
        <div
          className={`bg-white rounded-t-[40px] shadow-[0_-20px_40px_rgba(0,0,0,0.1)] transition-all duration-500 border-t border-slate-100 ${isDetailsOpen ? "h-[80vh]" : "h-auto"}`}
        >
          {/* Controles da Simulação */}
          <div className="px-6 py-4 flex flex-wrap gap-2 justify-center border-b border-slate-50 bg-slate-50/50">
            <span className="w-full text-[8px] font-black text-slate-400 uppercase tracking-widest text-center mb-1">
              Controles locais da demonstração
            </span>
            <div className="w-full flex flex-wrap gap-2 justify-center mb-2">
              {[
                { id: "stable", label: "Sinal Estável", icon: Signal },
                { id: "unstable", label: "GPS Instável", icon: SignalLow },
                { id: "stopped", label: "Piloto Parado", icon: AlertTriangle },
                { id: "reconnecting", label: "Reconectando", icon: WifiOff },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setConnection(btn.id as ConnectionStatus)}
                  aria-pressed={connection === btn.id}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase transition-all ${
                    connection === btn.id
                      ? "bg-navy text-white shadow-md scale-105"
                      : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <btn.icon size={10} aria-hidden="true" />
                  {btn.label}
                </button>
              ))}
            </div>
            <div className="w-full flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={handleSimulate500m}
                disabled={hasArrived}
                className="px-3 py-1.5 bg-white text-rovya-orange border border-orange-200 rounded-full text-[9px] font-black uppercase hover:bg-orange-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Simular 500m
              </button>
              <button
                type="button"
                onClick={handlePilotArrival}
                disabled={hasArrived}
                className="px-3 py-1.5 bg-white text-emerald-600 border border-emerald-200 rounded-full text-[9px] font-black uppercase hover:bg-emerald-50 transition-all disabled:opacity-50"
              >
                Simular Chegada
              </button>
              {hasArrived && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsWaitTimerActive(!isWaitTimerActive)}
                    className="px-3 py-1.5 bg-white text-navy border border-slate-200 rounded-full text-[9px] font-black uppercase hover:bg-slate-50 transition-all"
                  >
                    {isWaitTimerActive ? "Pausar Espera" : "Retomar Espera"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWaitTime(300);
                      setIsWaitTimerActive(true);
                    }}
                    className="px-3 py-1.5 bg-white text-navy border border-slate-200 rounded-full text-[9px] font-black uppercase hover:bg-slate-50 transition-all"
                  >
                    Reiniciar Espera
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={handleResetEmbark}
                className="px-3 py-1.5 bg-white text-slate-400 border border-slate-200 rounded-full text-[9px] font-black uppercase hover:bg-slate-50 transition-all"
              >
                Resetar Embarque
              </button>
            </div>
          </div>

          {/* Handle de expansão */}
          <button
            type="button"
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            aria-expanded={isDetailsOpen}
            aria-controls="ride-details-panel"
            aria-label={
              isDetailsOpen ? "Recolher detalhes da corrida" : "Expandir detalhes da corrida"
            }
            className="w-full flex justify-center py-4 cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="w-12 h-1.5 bg-slate-100 rounded-full"></div>
          </button>

          <div id="ride-details-panel" className="px-8 pb-8 space-y-6 overflow-y-auto">
            {/* PIN de Segurança (Aparece após chegada) */}
            {hasArrived && (
              <div
                className="animate-in fade-in slide-in-from-top-4 duration-700 pt-2"
                aria-live="polite"
              >
                <div className="bg-navy rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10" aria-hidden="true">
                    <Lock size={60} />
                  </div>
                  <div className="relative z-10 flex flex-col items-center text-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                      PIN da Demonstração
                    </span>
                    <div
                      className="flex gap-3 my-1"
                      role="img"
                      aria-label={`PIN de segurança: ${pin}`}
                    >
                      {pin.split("").map((digit, i) => (
                        <div
                          key={i}
                          className="w-10 h-14 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center"
                        >
                          <span className="text-2xl font-black italic tracking-tighter">
                            {digit}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-300 font-medium max-w-[200px] leading-relaxed">
                      Confirme Carlos H., Honda CG 160 e placa {pilot.vehicle.plate} antes de
                      informar o PIN ao piloto.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Informações Resumidas do Piloto */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={pilot.avatar}
                    alt="Foto fictícia do piloto Carlos H. para demonstração"
                    className="h-16 w-16 rounded-[22px] object-cover border-2 border-slate-50 shadow-sm"
                  />
                  <div
                    className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg shadow-sm border border-slate-100"
                    aria-hidden="true"
                  >
                    <Star size={10} fill="#F97316" className="text-rovya-orange" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black italic tracking-tighter text-navy">
                      {pilot.name}
                    </h2>
                    <span className="text-xs font-bold text-rovya-orange flex items-center gap-0.5">
                      {pilot.rating.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {pilot.totalRides} Corridas • {pilot.timeAtRovya} na Rovya
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleChat}
                  aria-label="Chat com piloto"
                  className="h-12 w-12 bg-slate-50 text-navy rounded-2xl flex items-center justify-center border border-slate-100 hover:bg-slate-100 transition-all active:scale-95"
                >
                  <MessageSquare size={20} strokeWidth={2.5} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleCall}
                  aria-label="Ligar para piloto"
                  className="h-12 w-12 bg-navy text-white rounded-2xl flex items-center justify-center hover:bg-navy/90 transition-all active:scale-95 shadow-md"
                >
                  <Phone size={20} strokeWidth={2.5} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Ações Rápidas de Chegada */}
            {hasArrived && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-3 pt-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickMessage("Estou indo!")}
                    className="flex-1 py-3 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-navy hover:bg-slate-100 transition-all"
                  >
                    Estou indo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickMessage("Já estou saindo!")}
                    className="flex-1 py-3 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-navy hover:bg-slate-100 transition-all"
                  >
                    Já estou saindo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickMessage("Estou no portão!")}
                    className="flex-1 py-3 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-navy hover:bg-slate-100 transition-all"
                  >
                    Estou no portão
                  </button>
                </div>
                <Button
                  onClick={() =>
                    navigate({
                      to: "/passageiro/corrida/$rideId/em-andamento",
                      params: { rideId },
                    })
                  }
                  className="w-full py-6 rounded-2xl bg-rovya-orange hover:bg-rovya-orange/90 text-white font-black italic uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all"
                >
                  <Navigation size={18} className="mr-2 rotate-45" fill="currentColor" />
                  Simular Início da Corrida
                </Button>
              </div>
            )}

            {/* Veículo e Segurança */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Veículo
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-rovya-orange/10 flex items-center justify-center">
                    <Navigation
                      size={12}
                      className="text-rovya-orange rotate-45"
                      fill="currentColor"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-navy uppercase">
                      {pilot.vehicle.model}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      {pilot.vehicle.color}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 relative overflow-hidden">
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Placa Completa
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-navy tracking-widest">
                    {pilot.vehicle.plate}
                  </span>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                </div>
                {/* Visual da Placa Mercosul simulado */}
                <div className="absolute top-0 right-0 w-12 h-1 bg-blue-600"></div>
              </div>
            </div>

            {/* Ações Secundárias */}
            <div className="flex items-center justify-between gap-4 py-2">
              <button
                type="button"
                onClick={handleShare}
                className="flex-1 flex flex-col items-center gap-2 py-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors"
              >
                <Share2 size={18} className="text-slate-400" aria-hidden="true" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                  Compartilhar
                </span>
              </button>
              <button
                type="button"
                onClick={handleSafety}
                className="flex-1 flex flex-col items-center gap-2 py-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors"
              >
                <ShieldCheck size={18} className="text-rovya-blue" aria-hidden="true" />
                <span className="text-[9px] font-black uppercase tracking-widest text-navy">
                  Segurança
                </span>
              </button>
              <button
                type="button"
                onClick={() => setIsDivergentVehicleAlertOpen(true)}
                className="flex-1 flex flex-col items-center gap-2 py-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors"
              >
                <AlertTriangle size={18} className="text-amber-500" aria-hidden="true" />
                <span className="text-[9px] font-black uppercase tracking-widest text-navy">
                  Piloto ou veículo diferente
                </span>
              </button>
              <button
                type="button"
                onClick={handleCancelRide}
                className="flex-1 flex flex-col items-center gap-2 py-3 bg-white border border-slate-100 rounded-2xl hover:bg-red-50 transition-colors group"
              >
                <X
                  size={18}
                  className="text-slate-300 group-hover:text-red-500"
                  aria-hidden="true"
                />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-red-500">
                  Cancelar
                </span>
              </button>
            </div>

            {/* Área Expansível (Mais Detalhes) */}
            {isDetailsOpen && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 pt-4 border-t border-slate-50">
                {/* Selos e Conquistas */}
                <section>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                    Conquistas do Piloto
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {pilot.badges.map((badge) => (
                      <div
                        key={badge}
                        className="px-3 py-1.5 bg-orange-50 text-rovya-orange rounded-lg text-[9px] font-black uppercase tracking-widest border border-orange-100 flex items-center gap-2"
                      >
                        <Star size={12} fill="currentColor" aria-hidden="true" />
                        {badge}
                      </div>
                    ))}
                    <div className="px-3 py-1.5 bg-blue-50 text-rovya-blue rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100 flex items-center gap-2">
                      <ShieldCheck size={12} fill="currentColor" aria-hidden="true" />
                      Identidade Verificada
                    </div>
                  </div>
                </section>

                {/* Resumo Financeiro da Corrida */}
                <section className="bg-slate-50 rounded-3xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-navy">
                      Resumo do Pagamento
                    </h3>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[8px] font-black uppercase">
                      Presencial
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-500 font-medium uppercase tracking-widest">
                        Preço final simulado
                      </span>
                      <span className="font-black text-navy tracking-tight italic">
                        {rideSummary.price}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-500 font-medium uppercase tracking-widest">
                        Forma Escolhida
                      </span>
                      <span className="font-black text-navy tracking-tight italic">
                        {rideSummary.method}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] border-t border-slate-200 pt-2 mt-2">
                      <span className="text-slate-400 font-bold uppercase tracking-widest">
                        Detalhes
                      </span>
                      <span className="font-bold text-slate-500 italic">{rideSummary.details}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 flex gap-3">
                    <Info size={16} className="text-rovya-blue shrink-0" />
                    <p className="text-[9px] text-slate-500 font-medium leading-relaxed">
                      O valor final é pago diretamente ao Carlos H. no desembarque. A Rovya não
                      retém pagamentos online nesta modalidade.
                    </p>
                  </div>
                </section>

                <div className="pt-4">
                  <p className="text-[8px] text-slate-300 font-bold uppercase tracking-[0.2em] text-center leading-relaxed">
                    DADOS PRIVADOS PROTEGIDOS • NENHUM DOCUMENTO SENSÍVEL EXPOSTO
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog de Veículo Divergente */}
      <AlertDialog open={isDivergentVehicleAlertOpen} onOpenChange={setIsDivergentVehicleAlertOpen}>
        <AlertDialogContent className="rounded-[32px] p-8 max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black italic uppercase tracking-tight text-red-600 flex items-center gap-2">
              <AlertTriangle size={24} aria-hidden="true" />
              Piloto ou Veículo Diferente?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 leading-relaxed pt-2">
              Por sua segurança, nunca embarque em um veículo com placa ou modelo diferente do que
              aparece no app.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex gap-3">
              <ShieldCheck size={18} className="text-red-600 shrink-0" aria-hidden="true" />
              <p className="text-[10px] text-red-700 font-bold leading-relaxed">
                Este motivo não penaliza o passageiro. Nenhuma denúncia real foi enviada nesta
                demonstração.
              </p>
            </div>
          </div>
          <AlertDialogFooter className="flex-col gap-2">
            <AlertDialogAction
              onClick={handleReportDivergent}
              className="w-full py-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black italic uppercase tracking-widest border-none"
            >
              Reportar Problema
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
