import {
  createFileRoute,
  useNavigate,
  useParams,
  Outlet,
  useLocation,
  useSearch,
  Link,
} from "@tanstack/react-router";
import { ACTIVE_PASSENGER_DEMO_RIDE } from "@/data/passenger-demo-rides";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  calculateRideFare,
  getPaymentLabel,
  rideQuoteSearchSchema,
  getQuoteParams,
} from "@/lib/passenger-demo-ride-quote";
import {
  Info,
  Navigation as NavigationIcon,
  Phone,
  MessageSquare,
  Shield,
  X,
  Star,
  Clock,
  MapPin,
  ChevronRight,
  Bike,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/passageiro/corrida/$rideId")({
  component: ActiveRideScreen,
  validateSearch: (search) => rideQuoteSearchSchema.parse(search),
});

function ActiveRideScreen() {
  const { rideId } = useParams({ from: "/passageiro/corrida/$rideId" });
  const search = useSearch({ from: "/passageiro/corrida/$rideId" });
  const navigate = useNavigate();
  const location = useLocation();

  const isValidRide = useMemo(() => rideId === ACTIVE_PASSENGER_DEMO_RIDE.id, [rideId]);

  const [progress, setProgress] = useState(0);
  const [hasArrived, setHasArrived] = useState(false);
  const [isWaitTimerActive, setIsWaitTimerActive] = useState(false);
  const [pinConfirmed, setPinConfirmed] = useState(false);

  const timer500mRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const timerArrivalRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const autoPinConfirmRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { finalFare } = useMemo(() => calculateRideFare(search.promoCode), [search.promoCode]);

  const paymentLabel = useMemo(() => getPaymentLabel(search.paymentMethod), [search.paymentMethod]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

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

  useEffect(() => {
    if (!isValidRide || search.technical || hasArrived) return;

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
  }, [isValidRide, search.technical, hasArrived]);

  const handlePilotArrival = useCallback(() => {
    if (autoPinConfirmRef.current) return;
    
    autoPinConfirmRef.current = setTimeout(() => {
      setPinConfirmed(true);
      toast.success("PIN confirmado pelo piloto — simulação.");
      navigate({
        to: "/passageiro/corrida/$rideId/em-andamento",
        params: { rideId },
        search: getQuoteParams(search),
      });
    }, 10000);
  }, [rideId, search, navigate]);

  useEffect(() => {
    if (!isValidRide || search.technical || !hasArrived || pinConfirmed) return;
    handlePilotArrival();

    return () => {
      if (autoPinConfirmRef.current) clearTimeout(autoPinConfirmRef.current);
    };
  }, [isValidRide, search.technical, hasArrived, pinConfirmed, handlePilotArrival]);

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
    <main className="flex min-h-screen flex-col bg-porcelain font-sans text-navy overflow-hidden relative">
      <header className="bg-white px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 z-50">
        <div className="flex flex-col">
          <h1 className="text-[11px] font-black uppercase tracking-widest italic text-rovya-blue">
            Piloto a Caminho
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {hasArrived ? "Aguardando embarque" : "Chega em 2 min"}
          </p>
        </div>
      </header>

      <div className="z-10 bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-start gap-2">
        <Info size={14} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="text-[9px] font-bold text-amber-900 leading-tight">
          Demonstração local: fluxo simulado de embarque.
        </p>
      </div>

      <div className="flex-1 relative bg-slate-100 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#111827 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
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

        <div className="absolute inset-x-6 bottom-6 space-y-4">
          {hasArrived && !pinConfirmed && (
            <div className="bg-white border-2 border-emerald-500 p-5 rounded-3xl shadow-2xl space-y-3 animate-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-[11px] font-black uppercase text-emerald-600">
                Aguardando confirmação do piloto
              </h2>
              <p className="text-[10px] text-slate-600">
                Informe o PIN{" "}
                <span className="font-bold text-navy">{ACTIVE_PASSENGER_DEMO_RIDE.pin}</span> ao
                piloto.
              </p>
              <p className="text-[10px] font-bold text-navy">
                Confirme: {pilot.name}, {pilot.vehicle.model} {pilot.vehicle.plate}
              </p>
            </div>
          )}

          <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                  <div className="text-navy font-black text-xl italic uppercase">
                    {pilot.name.charAt(0)}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-navy uppercase italic">
                      {pilot.name}
                    </span>
                    <div className="flex items-center gap-0.5 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black">
                      <Star size={10} fill="currentColor" />
                      4.96
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {pilot.vehicle.model} • {pilot.vehicle.plate}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={`tel:${ACTIVE_PASSENGER_DEMO_RIDE.driver.phone}`}
                  className="h-12 w-12 bg-slate-50 text-navy rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors border border-slate-100"
                >
                  <Phone size={20} />
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-50 pt-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                  Cotação Fixa
                </span>
                <span className="text-xl font-black text-navy italic tracking-tight">
                  {formatCurrency(finalFare)}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic text-right">
                  Pagamento
                </span>
                <span className="text-[10px] font-black text-rovya-blue uppercase tracking-widest text-right">
                  {paymentLabel}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/passageiro/chat/$rideId"
                params={{ rideId }}
                search={(prev: any) => getQuoteParams(prev)}
                className="bg-slate-50 text-navy py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors border border-slate-100"
              >
                <MessageSquare size={16} />
                Chat
              </Link>
              <Link
                to="/passageiro/seguranca"
                search={(prev: any) => getQuoteParams(prev)}
                className="bg-rovya-blue/5 text-rovya-blue py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-rovya-blue/10 transition-colors border border-rovya-blue/10"
              >
                <Shield size={16} />
                Segurança
              </Link>
            </div>

            <Link
              to="/passageiro/cancelar/$rideId"
              params={{ rideId }}
              search={(prev: any) => getQuoteParams(prev)}
              className="w-full text-slate-300 py-2 font-black uppercase tracking-widest text-[9px] text-center hover:text-red-400 transition-colors"
            >
              Cancelar Corrida
            </Link>
          </div>
        </div>
      </div>

      {search.technical && (
        <div className="z-50 fixed bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-sm text-white p-6 rounded-[32px] border border-white/10 shadow-2xl">
          <h2 className="text-[10px] font-black uppercase text-amber-500 mb-4 tracking-widest">
            Ferramentas técnicas
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handlePilotArrival()}
              variant="outline"
              className="h-11 bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              Simular Chegada
            </Button>
            <Button
              onClick={() => {
                setPinConfirmed(true);
                navigate({
                  to: "/passageiro/corrida/$rideId/em-andamento",
                  params: { rideId },
                  search: getQuoteParams({ ...search, technical: true }),
                });
              }}
              variant="outline"
              className="h-11 bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              Forçar Início
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
