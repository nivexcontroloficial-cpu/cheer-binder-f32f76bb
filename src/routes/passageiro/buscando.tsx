import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { ACTIVE_PASSENGER_DEMO_RIDE } from "@/data/passenger-demo-rides";
import {
  rideQuoteSearchSchema,
  getQuoteParams,
} from "@/lib/passenger-demo-ride-quote";
import {
  X,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Search,
  CheckCircle2,
  Bike,
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
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/passageiro/buscando")({
  validateSearch: (search) => rideQuoteSearchSchema.parse(search),
  component: SearchingRideScreen,
});

type SearchStatus = "searching" | "expanding" | "few_drivers" | "no_drivers" | "error" | "accepted";

function SearchingRideScreen() {
  const navigate = useNavigate();
  const { technical } = Route.useSearch();
  const [status, setStatus] = useState<SearchStatus>("searching");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const autoAcceptTimerRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cronômetro de tempo decorrido e transições automáticas da demo
  useEffect(() => {
    const isActive = ["searching", "expanding", "few_drivers"].includes(status);

    if (isActive) {
      elapsedTimerRef.current = setInterval(() => {
        setElapsedTime((prev) => {
          const next = prev + 1;

          // Transições automáticas baseadas no tempo para a experiência normal
          if (status === "searching" && next >= 10) {
            setStatus("expanding");
          } else if (status === "expanding" && next >= 25) {
            setStatus("few_drivers");
          } else if (status === "few_drivers" && next >= 45) {
            setStatus("no_drivers");
          }

          return next;
        });
      }, 1000);
    }

    return () => {
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    };
  }, [status]);

  // Timer de aceite automático único (apenas se não houver interação técnica)
  useEffect(() => {
    if (status === "searching") {
      autoAcceptTimerRef.current = setTimeout(() => {
        setStatus("accepted");
        toast.success(`${ACTIVE_PASSENGER_DEMO_RIDE.driver.name} aceitou esta corrida simulada.`);
      }, 15000); // Aceite automático em 15s para a demo
    }

    return () => {
      if (autoAcceptTimerRef.current) clearTimeout(autoAcceptTimerRef.current);
    };
  }, [status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCancel = () => {
    if (!cancelReason) {
      toast.error("Por favor, selecione um motivo.");
      return;
    }

    toast.info(
      "Cancelamento simulado registrado. Nenhuma penalidade foi aplicada à Saúde da Conta.",
    );
    navigate({ to: "/passageiro/inicio" });
  };

  const handleRetry = () => {
    setElapsedTime(0);
    setStatus("searching");
    toast.success("Reiniciando busca simulada...");
  };

  const triggerStatus = (newStatus: SearchStatus) => {
    // Ação técnica manual anula o aceite automático
    if (autoAcceptTimerRef.current) {
      clearTimeout(autoAcceptTimerRef.current);
      autoAcceptTimerRef.current = null;
    }

    setStatus(newStatus);
    if (newStatus === "accepted") {
      toast.success(`${ACTIVE_PASSENGER_DEMO_RIDE.driver.name} aceitou esta corrida simulada.`);
    }
  };

  useEffect(() => {
    let transitionTimer: NodeJS.Timeout;

    if (status === "accepted") {
      transitionTimer = setTimeout(() => {
        navigate({
          to: "/passageiro/corrida/$rideId",
          params: { rideId: ACTIVE_PASSENGER_DEMO_RIDE.id },
          search: (prev: any) => getQuoteParams({
            ...prev,
            technical: false
          }),
        });
      }, 3000);
    }

    return () => {
      if (transitionTimer) clearTimeout(transitionTimer);
    };
  }, [status, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy">
      {/* Banner de Transparência dentro do fluxo, abaixo do cabeçalho corrigido no layout abaixo */}
      <header className="bg-white px-6 pt-5 pb-2 border-b border-slate-100 sticky top-0 z-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col" role="status" aria-live="polite">
            <h1 className="text-[11px] font-black uppercase tracking-widest italic text-rovya-blue">
              Buscando Piloto
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {formatTime(elapsedTime)} decorridos
            </p>
          </div>
          {status !== "accepted" && (
            <button
              type="button"
              onClick={() => setIsCancelDialogOpen(true)}
              aria-label="Cancelar solicitação de corrida"
              className="h-11 w-11 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all focus:ring-2 focus:ring-red-500 outline-none"
            >
              <X size={20} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Aviso Demonstrativo reposicionado */}
        <div
          className="bg-rovya-blue/10 px-4 py-2 rounded-xl mb-2"
          role="status"
          aria-live="polite"
        >
          <p className="text-[9px] font-bold text-rovya-blue uppercase tracking-tight text-center">
            Pedido simulado. Nenhuma corrida real foi solicitada.
          </p>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-6 space-y-6">
        {/* Mapa Esquemático Animado */}
        <div
          className="h-64 bg-slate-100 rounded-[40px] relative overflow-hidden border border-slate-200 shadow-inner"
          role="img"
          aria-label="Mapa esquemático — nenhum GPS real foi acessado"
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(#111827 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
            aria-hidden="true"
          ></div>

          <div className="absolute top-4 left-6 z-10">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 bg-white/50 backdrop-blur-sm px-2 py-1 rounded-full border border-white/50">
              Mapa esquemático — nenhum GPS real foi acessado
            </span>
          </div>

          {/* Pulso de Busca */}
          <div className="absolute inset-0 flex items-center justify-center">
            {["searching", "expanding", "few_drivers"].includes(status) && (
              <>
                <div
                  className="absolute h-32 w-32 border-2 border-rovya-blue rounded-full animate-ping opacity-20"
                  aria-hidden="true"
                ></div>
                <div
                  className="absolute h-48 w-48 border border-rovya-blue rounded-full animate-ping opacity-10 delay-700"
                  aria-hidden="true"
                ></div>
                <div
                  className="absolute h-64 w-64 border border-rovya-blue rounded-full animate-ping opacity-5 delay-1000"
                  aria-hidden="true"
                ></div>
              </>
            )}

            {/* Ícone Central (Passageiro) */}
            <div className="relative z-10 h-12 w-12 bg-white rounded-2xl shadow-xl flex items-center justify-center border-2 border-rovya-blue">
              <div
                className="h-4 w-4 bg-rovya-blue rounded-full animate-pulse"
                aria-hidden="true"
              ></div>
            </div>

            {/* Pilotos Próximos Fictícios (Apenas visuais) */}
            {["searching", "expanding", "few_drivers"].includes(status) && (
              <>
                <div
                  className="absolute top-12 left-20 animate-bounce delay-100 opacity-40"
                  aria-hidden="true"
                >
                  <Bike size={20} className="text-slate-400 rotate-12" />
                </div>
                <div
                  className="absolute bottom-16 right-16 animate-pulse delay-500 opacity-60"
                  aria-hidden="true"
                >
                  <Bike size={20} className="text-slate-500 -rotate-45" />
                </div>
                {status === "expanding" && (
                  <div
                    className="absolute top-40 left-10 animate-pulse delay-300 opacity-30"
                    aria-hidden="true"
                  >
                    <Bike size={20} className="text-slate-300 rotate-90" />
                  </div>
                )}
              </>
            )}

            {status === "accepted" && (
              <div className="absolute top-10 right-20 animate-in zoom-in-50 duration-500">
                <div className="bg-navy p-3 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-rovya-orange">
                  <Bike className="text-rovya-orange" size={24} aria-hidden="true" />
                  <div className="flex flex-col pr-2">
                    <span className="text-[10px] font-black text-white uppercase italic">
                      Piloto a caminho
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                      {ACTIVE_PASSENGER_DEMO_RIDE.vehicle.model} •{" "}
                      {ACTIVE_PASSENGER_DEMO_RIDE.driver.name}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Overlay de Status */}
          <div className="absolute bottom-6 left-6 right-6">
            <div
              className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-white shadow-lg flex items-center gap-4"
              role="status"
              aria-live="polite"
            >
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                  ["error", "no_drivers"].includes(status)
                    ? "bg-red-50 text-red-500"
                    : status === "accepted"
                      ? "bg-emerald-50 text-emerald-500"
                      : "bg-blue-50 text-rovya-blue"
                }`}
              >
                {status === "searching" && (
                  <Search size={20} className="animate-pulse" aria-hidden="true" />
                )}
                {status === "expanding" && (
                  <Search size={20} className="animate-spin-slow" aria-hidden="true" />
                )}
                {status === "few_drivers" && <AlertTriangle size={20} aria-hidden="true" />}
                {status === "no_drivers" && <AlertTriangle size={20} aria-hidden="true" />}
                {status === "error" && <AlertTriangle size={20} aria-hidden="true" />}
                {status === "accepted" && <CheckCircle2 size={20} aria-hidden="true" />}
              </div>
              <div className="flex-1">
                <h2 className="text-[11px] font-black uppercase tracking-tight">
                  {status === "searching" && "Procurando pilotos"}
                  {status === "expanding" && "Ampliando busca simulada"}
                  {status === "few_drivers" && "Poucos pilotos disponíveis"}
                  {status === "no_drivers" && "Nenhum piloto encontrado"}
                  {status === "error" && "Falha simulada de conexão"}
                  {status === "accepted" && "Piloto aceitou"}
                </h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  {status === "searching" && "Buscando o melhor piloto para você"}
                  {status === "expanding" && "Verificando pilotos em bairros vizinhos"}
                  {status === "few_drivers" && "Aguardando disponibilidade na região"}
                  {status === "no_drivers" && "Tente novamente em alguns instantes"}
                  {status === "error" && "Não foi possível completar a busca simulada"}
                  {status === "accepted" &&
                    `${ACTIVE_PASSENGER_DEMO_RIDE.driver.name} aceitou esta corrida simulada.`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo da Corrida */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-rovya-blue">
                <Bike size={18} aria-hidden="true" />
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-tight">
                  Rovya Moto
                </span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                  Preço fixo simulado
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-lg font-black italic text-navy tracking-tighter">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                  ACTIVE_PASSENGER_DEMO_RIDE.fare,
                )}
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                {ACTIVE_PASSENGER_DEMO_RIDE.paymentMethod}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rovya-orange" aria-hidden="true"></div>
              <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
                {ACTIVE_PASSENGER_DEMO_RIDE.destination.address}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={12} className="text-rovya-blue" aria-hidden="true" />
              <p className="text-[10px] font-black uppercase tracking-widest text-navy">
                {ACTIVE_PASSENGER_DEMO_RIDE.origin.address}
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-50">
            <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest text-center">
              Pagamento presencial demonstrativo
            </p>
          </div>
        </div>

        {/* Mensagem de Segurança */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
          <ShieldCheck size={18} className="text-rovya-blue shrink-0" aria-hidden="true" />
          <p className="text-[9px] text-blue-800 font-medium leading-relaxed">
            Demonstração de segurança: nenhum acompanhamento ou contato real está ativo.
          </p>
        </div>

        {/* Controles da Demonstração - Apenas no modo técnico */}
        {technical && (
          <div
            className="mt-auto pt-6 border-t border-slate-100 bg-slate-50/50 rounded-b-[40px] p-4 -mx-6 -mb-6"
            aria-label="Ferramentas técnicas da demonstração"
          >
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center mb-4 italic">
              Ferramentas técnicas da demonstração
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl text-[8px] font-black uppercase h-11 border-slate-200 focus:ring-2 focus:ring-rovya-blue"
                onClick={() => triggerStatus("expanding")}
                disabled={status === "accepted"}
              >
                Ampliar Busca
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl text-[8px] font-black uppercase h-11 border-slate-200 focus:ring-2 focus:ring-rovya-blue"
                onClick={() => triggerStatus("few_drivers")}
                disabled={status === "accepted"}
              >
                Poucos Pilotos
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl text-[8px] font-black uppercase h-11 border-slate-200 focus:ring-2 focus:ring-rovya-blue"
                onClick={() => triggerStatus("no_drivers")}
                disabled={status === "accepted"}
              >
                Nenhum Piloto
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl text-[8px] font-black uppercase h-11 border-slate-200 focus:ring-2 focus:ring-rovya-blue"
                onClick={() => triggerStatus("error")}
                disabled={status === "accepted"}
              >
                Erro Simulado
              </Button>
              <Button
                type="button"
                variant="default"
                className="bg-emerald-600 hover:bg-emerald-700 rounded-xl text-[8px] font-black uppercase h-11 col-span-2 focus:ring-2 focus:ring-emerald-500"
                onClick={() => triggerStatus("accepted")}
                disabled={status === "accepted"}
              >
                Aceite Simulado
              </Button>
              {(status === "no_drivers" || status === "error") && (
                <Button
                  type="button"
                  variant="default"
                  className="bg-navy rounded-xl text-[9px] font-black uppercase h-12 gap-2 col-span-2 mt-2 focus:ring-2 focus:ring-navy shadow-lg"
                  onClick={handleRetry}
                >
                  <RotateCcw size={14} aria-hidden="true" />
                  Tentar Novamente
                </Button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Dialog de Cancelamento */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent className="rounded-[32px] p-8 max-w-[90vw] sm:max-w-md border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black italic uppercase tracking-tight text-navy">
              Cancelar Solicitação?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 leading-relaxed pt-2">
              Demonstração local: O cancelamento não gera taxas nesta simulação.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-6">
            <RadioGroup value={cancelReason} onValueChange={setCancelReason} className="space-y-3">
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer focus-within:ring-2 focus-within:ring-rovya-orange transition-all">
                <RadioGroupItem
                  value="too_long"
                  id="too_long"
                  className="text-rovya-orange border-slate-300"
                />
                <Label
                  htmlFor="too_long"
                  className="flex-1 text-[11px] font-bold uppercase tracking-wider text-navy cursor-pointer"
                >
                  Demora na busca
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer focus-within:ring-2 focus-within:ring-rovya-orange transition-all">
                <RadioGroupItem
                  value="mistake"
                  id="mistake"
                  className="text-rovya-orange border-slate-300"
                />
                <Label
                  htmlFor="mistake"
                  className="flex-1 text-[11px] font-bold uppercase tracking-wider text-navy cursor-pointer"
                >
                  Pedi por engano
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer focus-within:ring-2 focus-within:ring-rovya-orange transition-all">
                <RadioGroupItem
                  value="other_app"
                  id="other_app"
                  className="text-rovya-orange border-slate-300"
                />
                <Label
                  htmlFor="other_app"
                  className="flex-1 text-[11px] font-bold uppercase tracking-wider text-navy cursor-pointer"
                >
                  Consegui outro transporte
                </Label>
              </div>
            </RadioGroup>
          </div>

          <AlertDialogFooter className="flex-col sm:flex-row gap-3">
            <AlertDialogCancel asChild>
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl h-14 text-[11px] font-black uppercase border-slate-200 mt-0 hover:bg-slate-50"
              >
                Manter Busca
              </Button>
            </AlertDialogCancel>
            <Button
              type="button"
              onClick={handleCancel}
              className="bg-red-500 text-white rounded-2xl h-14 px-6 text-[11px] font-black uppercase tracking-widest hover:bg-red-600 transition-all flex-1 shadow-lg shadow-red-100"
            >
              Confirmar Cancelamento
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
