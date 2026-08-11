import { createFileRoute, useNavigate, useParams, Link, useSearch, Outlet } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useRef } from "react";
import { Shield, Info } from "lucide-react";
import { ACTIVE_PASSENGER_DEMO_RIDE, COMPLETED_PASSENGER_DEMO_RIDE } from "@/data/passenger-demo-rides";
import {
  calculateRideFare,
  getPaymentLabel,
  rideQuoteSearchSchema,
  getQuoteParams,
} from "@/lib/passenger-demo-ride-quote";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/passageiro/corrida/$rideId/em-andamento")({
  component: InProgressRideScreen,
  validateSearch: (search) => rideQuoteSearchSchema.parse(search),
});

function InProgressRideScreen() {
  const { rideId } = useParams({ from: "/passageiro/corrida/$rideId/em-andamento" });
  const search = useSearch({ from: "/passageiro/corrida/$rideId/em-andamento" });
  const navigate = useNavigate();

  const isValidRide = useMemo(() => rideId === ACTIVE_PASSENGER_DEMO_RIDE.id, [rideId]);

  const [progress, setProgress] = useState(35);
  const isFinishedRef = useRef(false);

  const { finalFare } = useMemo(
    () => calculateRideFare(search.promoCode),
    [search.promoCode]
  );

  const paymentLabel = useMemo(
    () => getPaymentLabel(search.paymentMethod),
    [search.paymentMethod]
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  useEffect(() => {
    if (!isValidRide) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (next >= 100 && !isFinishedRef.current) {
            isFinishedRef.current = true;
            toast.success("Corrida encerrada pelo piloto — simulação.");
            navigate({
                to: "/passageiro/corrida/$rideId/concluida",
                params: { rideId: COMPLETED_PASSENGER_DEMO_RIDE.id },
                search: (prev: any) => getQuoteParams(prev),
            });
            return 100;
        }
        return next > 100 ? 100 : next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isValidRide, navigate, rideId]);

  if (!isValidRide) {
    return (
      <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy p-8 items-center justify-center text-center">
        <h1 className="text-xl font-black italic uppercase mb-2">Corrida não encontrada</h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-navy relative overflow-hidden">
      <h1 className="sr-only">Corrida em andamento</h1>
      
      <div className="flex-1 bg-slate-50 relative">
        <div className="absolute top-8 left-6 right-6">
          <div className="bg-white/95 rounded-3xl p-6 shadow-xl border border-slate-100">
            <h2 className="text-xl font-black italic uppercase text-navy mb-4">Corrida {rideId}</h2>
            <Progress value={progress} className="h-2 bg-slate-100" />
            
            <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                  Preço Final
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
          </div>
        </div>
      </div>

      <div className="bg-white px-6 pb-[env(safe-area-inset-bottom)] pt-4 space-y-4 shadow-2xl rounded-t-[40px]">
        <div className="space-y-1 py-2 px-2">
            <h2 className="text-sm font-black text-navy uppercase">Corrida em andamento</h2>
            <p className="text-xs text-slate-500">O encerramento será confirmado pelo piloto nesta demonstração.</p>
        </div>

        {search.technical && (
          <div className="p-6 bg-slate-900 rounded-[32px] border border-white/10 shadow-xl m-2">
            <h3 className="text-[10px] font-black uppercase text-amber-500 mb-4 flex items-center gap-2 tracking-widest">
              <Shield size={12} />
              Ferramentas técnicas
            </h3>
            <Button
              onClick={() => {
                if (isFinishedRef.current) return;
                isFinishedRef.current = true;
                navigate({
                    to: "/passageiro/corrida/$rideId/concluida",
                    params: { rideId: COMPLETED_PASSENGER_DEMO_RIDE.id },
                    search: (prev: any) => getQuoteParams({ ...prev, technical: true })
                });
              }}
              className="w-full bg-navy text-white h-11 border border-white/10"
            >
              Encerrar corrida — teste
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
