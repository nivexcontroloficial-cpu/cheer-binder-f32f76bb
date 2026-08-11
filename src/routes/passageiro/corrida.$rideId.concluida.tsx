import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { COMPLETED_PASSENGER_DEMO_RIDE } from "@/data/passenger-demo-rides";
import {
  CheckCircle2,
  Star,
  MapPin,
  Clock,
  Navigation,
  Wallet,
  Info,
  RefreshCw,
  Home,
  ShieldAlert,
  ArrowRight,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDemo } from "@/state/DemoContext";
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

export const Route = createFileRoute("/passageiro/corrida/$rideId/concluida")({
  component: RideCompletedScreen,
});

const CURRENCY = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const COMPLIMENTS = [
  "Educado",
  "Direção segura",
  "Veículo limpo",
  "Pontual",
  "Boa comunicação",
] as const;

const COMMENT_MAX = 240;

const RIDE_SUMMARY = {
  id: COMPLETED_PASSENGER_DEMO_RIDE.id,
  origin: COMPLETED_PASSENGER_DEMO_RIDE.origin.address,
  destination: COMPLETED_PASSENGER_DEMO_RIDE.destination.address,
  distance: `${COMPLETED_PASSENGER_DEMO_RIDE.distance.toString().replace(".", ",")} km`,
  duration: `${COMPLETED_PASSENGER_DEMO_RIDE.duration} min`,
  fare: COMPLETED_PASSENGER_DEMO_RIDE.fare,
  paymentMethod: COMPLETED_PASSENGER_DEMO_RIDE.paymentMethod,
  pilot: {
    name: COMPLETED_PASSENGER_DEMO_RIDE.driver.name,
    initials: "CH",
    vehicle: `${COMPLETED_PASSENGER_DEMO_RIDE.vehicle.model} — ${COMPLETED_PASSENGER_DEMO_RIDE.vehicle.plate}`,
  },
};

function RideCompletedScreen() {
  const { rideId } = useParams({ from: "/passageiro/corrida/$rideId/concluida" });
  const navigate = useNavigate();
  const { rides, addRideToHistory } = useDemo();

  const isValidRide = useMemo(() => rideId === COMPLETED_PASSENGER_DEMO_RIDE.id, [rideId]);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedCompliments, setSelectedCompliments] = useState<string[]>([]);
  const [isConfirmPaymentDialogOpen, setIsConfirmPaymentDialogOpen] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const toggleCompliment = (tag: string) => {
    setSelectedCompliments((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const ensureRideInHistory = () => {
    if (!isValidRide) return;
    if (rides.some((r) => r.id === RIDE_SUMMARY.id)) return;
    addRideToHistory({
      id: RIDE_SUMMARY.id,
      passengerId: "p1",
      origin: { address: RIDE_SUMMARY.origin, lat: 0, lng: 0 },
      destination: { address: RIDE_SUMMARY.destination, lat: 0, lng: 0 },
      status: "completed",
      fare: RIDE_SUMMARY.fare,
      distance: COMPLETED_PASSENGER_DEMO_RIDE.distance,
      duration: COMPLETED_PASSENGER_DEMO_RIDE.duration,
      requestedAt: COMPLETED_PASSENGER_DEMO_RIDE.requestedAt,
      completedAt: COMPLETED_PASSENGER_DEMO_RIDE.completedAt || new Date().toISOString(),
      driverId: COMPLETED_PASSENGER_DEMO_RIDE.driver.id,
    });
  };

  const handleFinish = () => {
    if (!isValidRide) return;
    if (!paymentConfirmed) {
      setIsConfirmPaymentDialogOpen(true);
      return;
    }

    ensureRideInHistory();
    if (rating > 0) {
      toast.success("Avaliação simulada registrada apenas nesta demonstração.");
    } else {
      toast.success("Corrida simulada concluída sem avaliação.");
    }
    navigate({ to: "/passageiro/inicio" });
  };

  const confirmPayment = () => {
    if (!isValidRide) return;
    setPaymentConfirmed(true);
    setIsConfirmPaymentDialogOpen(false);
    toast.success("Confirmação local registrada. Nenhum pagamento foi processado.");
  };

  if (!isValidRide) {
    return (
      <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy p-8 items-center justify-center text-center">
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-[32px] shadow-sm max-w-sm">
          <Info size={32} className="text-amber-600 mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-xl font-black italic uppercase tracking-tight mb-2">
            Corrida simulada não encontrada
          </h1>
          <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
            Aviso de demonstração local: nenhuma corrida real foi consultada.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/passageiro/corridas"
              className="w-full h-11 flex items-center justify-center bg-navy text-white rounded-2xl font-black uppercase text-[9px] tracking-widest min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              Ver histórico simulado
            </Link>
            <Link
              to="/passageiro/inicio"
              className="w-full h-11 flex items-center justify-center bg-white border border-slate-200 text-navy rounded-2xl font-black uppercase text-[9px] tracking-widest min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy pb-10">
      {/* Header Sucesso */}
      <div className="bg-navy pt-16 pb-12 px-8 rounded-b-[48px] text-white flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none"
          aria-hidden="true"
        >
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>

        <div className="bg-emerald-500 p-4 rounded-3xl mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-in zoom-in duration-700">
          <CheckCircle2 size={40} strokeWidth={2.5} aria-hidden="true" />
        </div>

        <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Chegamos!</h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          Corrida fictícia #{RIDE_SUMMARY.id}
        </p>
      </div>

      <div className="px-6 -mt-8 space-y-6 relative z-10">
        {/* Aviso de transparência */}
        <div className="bg-amber-50 border border-amber-100 rounded-[24px] p-4 flex gap-3">
          <Info size={16} className="text-amber-600 shrink-0" aria-hidden="true" />
          <p className="text-[10px] font-bold text-amber-700 leading-relaxed">
            Demonstração local: nenhum pagamento ou avaliação real será processado ou enviado.
          </p>
        </div>

        {/* Piloto */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 flex items-center gap-4">
          <div
            className="h-14 w-14 rounded-2xl bg-navy text-white flex items-center justify-center font-black italic text-lg"
            aria-hidden="true"
          >
            {RIDE_SUMMARY.pilot.initials}
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Piloto fictício
            </span>
            <span className="text-sm font-black italic text-navy">{RIDE_SUMMARY.pilot.name}</span>
            <span className="text-[10px] font-bold text-slate-400">
              {RIDE_SUMMARY.pilot.vehicle}
            </span>
          </div>
        </div>

        {/* Card de Pagamento Presencial */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Valor fixado
              </span>
              <span className="text-3xl font-black italic tracking-tighter text-navy">
                {CURRENCY.format(RIDE_SUMMARY.fare)}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Pagamento presencial
              </span>
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 mt-1">
                <Wallet size={14} className="text-blue-600" aria-hidden="true" />
                <span className="text-[10px] font-black uppercase tracking-tight text-blue-700">
                  {RIDE_SUMMARY.paymentMethod}
                </span>
              </div>
            </div>
          </div>

          {!paymentConfirmed ? (
            <Button
              type="button"
              onClick={() => setIsConfirmPaymentDialogOpen(true)}
              className="w-full py-7 rounded-2xl bg-navy text-white font-black italic uppercase tracking-widest shadow-lg"
            >
              Paguei diretamente ao piloto
            </Button>
          ) : (
            <div
              role="status"
              aria-live="polite"
              className="w-full py-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center gap-3 text-emerald-700"
            >
              <CheckCircle2 size={18} aria-hidden="true" />
              <span className="text-xs font-black uppercase tracking-widest">
                Confirmação local registrada
              </span>
            </div>
          )}

          <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3">
            <Info size={16} className="text-blue-500 shrink-0" aria-hidden="true" />
            <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
              Nesta demonstração o pagamento acontece diretamente entre passageiro e piloto. A Rovya
              não processa nem verifica valores.
            </p>
          </div>
        </div>

        {/* Avaliação opcional */}
        <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 flex flex-col items-center">
          <h2 className="text-sm font-black italic uppercase tracking-tight text-navy mb-1">
            Como foi sua viagem?
          </h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-6">
            Avaliação opcional — pode ser pulada
          </p>

          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`Avaliar com ${star} ${star === 1 ? "estrela" : "estrelas"}`}
                aria-pressed={rating === star}
                onClick={() => setRating(star)}
                className="transition-transform active:scale-90 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
              >
                <Star
                  size={40}
                  fill={rating >= star ? "#F97316" : "none"}
                  className={rating >= star ? "text-rovya-orange" : "text-slate-200"}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>

          <div className="w-full space-y-6">
            <div className="flex flex-wrap justify-center gap-2">
              {COMPLIMENTS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={selectedCompliments.includes(tag)}
                  onClick={() => toggleCompliment(tag)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-navy ${
                    selectedCompliments.includes(tag)
                      ? "bg-navy text-white"
                      : "bg-slate-50 text-slate-400 border border-slate-100"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="ride-comment"
                className="block text-[9px] font-black text-slate-400 uppercase tracking-widest"
              >
                Comentário (opcional)
              </label>
              <textarea
                id="ride-comment"
                maxLength={COMMENT_MAX}
                placeholder="Algum comentário adicional? (Opcional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full min-h-[100px] bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-medium placeholder:text-slate-300 focus:ring-navy focus:border-navy"
              />
              <p className="text-[9px] font-bold text-slate-400 text-right">
                {comment.length}/{COMMENT_MAX} caracteres
              </p>
            </div>
          </div>
        </div>

        {/* Recibo visual de demonstração */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-navy">
              Recibo visual de demonstração
            </h3>
            <FileText size={14} className="text-slate-400" aria-hidden="true" />
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div
                className="h-6 w-6 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <MapPin size={12} className="text-emerald-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  Origem
                </span>
                <span className="text-[11px] font-bold text-navy">{RIDE_SUMMARY.origin}</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="h-6 w-6 rounded-lg bg-blue-50 flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <MapPin size={12} className="text-blue-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  Destino
                </span>
                <span className="text-[11px] font-bold text-navy">{RIDE_SUMMARY.destination}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Distância
              </span>
              <div className="flex items-center gap-2 text-navy">
                <Navigation
                  size={14}
                  className="rotate-45"
                  fill="currentColor"
                  aria-hidden="true"
                />
                <span className="text-xs font-black italic">{RIDE_SUMMARY.distance}</span>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Duração
              </span>
              <div className="flex items-center gap-2 text-navy">
                <Clock size={14} aria-hidden="true" />
                <span className="text-xs font-black italic">{RIDE_SUMMARY.duration}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-[9px] text-slate-500 font-bold leading-relaxed text-center">
              Este resumo não é documento fiscal nem comprovante de pagamento processado pela Rovya.
            </p>
          </div>
        </div>

        {/* Ações Finais */}
        <div className="flex flex-col gap-3">
          <Button
            type="button"
            onClick={handleFinish}
            className="w-full py-7 rounded-2xl bg-navy text-white font-black italic uppercase tracking-widest shadow-xl"
          >
            {rating > 0 ? "Enviar avaliação e concluir" : "Concluir sem avaliar"}
            <ArrowRight size={18} className="ml-2" aria-hidden="true" />
          </Button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate({ to: "/passageiro/confirmar-corrida" })}
              className="flex-1 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-navy flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
            >
              <RefreshCw size={14} aria-hidden="true" />
              Repetir rota
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/passageiro/inicio" })}
              className="flex-1 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-navy flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
            >
              <Home size={14} aria-hidden="true" />
              Voltar ao início
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate({ to: "/passageiro/denunciar/$rideId", params: { rideId } })}
            className="w-full flex items-center justify-center gap-2 py-4 text-red-500 text-[10px] font-black uppercase tracking-widest focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded-2xl"
          >
            <ShieldAlert size={16} aria-hidden="true" />
            Denunciar esta corrida
          </button>
        </div>
      </div>

      {/* Dialog de Confirmação de Pagamento */}
      <AlertDialog open={isConfirmPaymentDialogOpen} onOpenChange={setIsConfirmPaymentDialogOpen}>
        <AlertDialogContent className="rounded-[32px] p-8 max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black italic uppercase tracking-tight text-navy">
              Confirmar pagamento presencial?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 leading-relaxed pt-2">
              Você declara, apenas nesta demonstração, que pagou{" "}
              <span className="text-navy font-bold italic">
                {CURRENCY.format(RIDE_SUMMARY.fare)}
              </span>{" "}
              diretamente ao piloto {RIDE_SUMMARY.pilot.name} via {RIDE_SUMMARY.paymentMethod}. A
              Rovya não processou dinheiro, o aplicativo não verificou a transação e esta
              confirmação existe somente nesta demonstração.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex-col gap-2">
            <AlertDialogAction
              onClick={confirmPayment}
              className="w-full py-6 rounded-2xl bg-navy text-white font-black italic uppercase tracking-widest border-none"
            >
              Paguei diretamente ao piloto
            </AlertDialogAction>
            <AlertDialogCancel className="w-full py-6 rounded-2xl border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Ainda não paguei
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
