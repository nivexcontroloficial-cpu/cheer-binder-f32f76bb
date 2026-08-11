import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Info, AlertCircle } from "lucide-react";
import { calculateCancellationConsequence } from "@/services/mock/account-health";
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
import { toast } from "sonner";

export const Route = createFileRoute("/passageiro/cancelar/$rideId")({
  component: CancelarCorrida,
});

function CancelarCorrida() {
  const { rideId } = useParams({ from: "/passageiro/cancelar/$rideId" });
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const isValidRide = rideId === "ride-active-mock";

  const reasons = [
    { id: "desistencia", label: "Desisti da corrida" },
    { id: "demora", label: "Demora do piloto" },
    { id: "pilot_asked", label: "Piloto pediu para cancelar" },
    { id: "different_vehicle", label: "Veículo diferente" },
    { id: "safety_concern", label: "Questão de segurança" },
    { id: "pagamento", label: "Divergência de pagamento" },
  ];

  const consequence =
    selectedReason && isValidRide
      ? calculateCancellationConsequence("arrived", selectedReason)
      : null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (!isValidRide) {
    return (
      <div className="flex min-h-screen flex-col bg-white p-6 items-center text-center justify-center font-sans">
        <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3 items-center max-w-sm">
          <Info size={18} className="text-amber-600 shrink-0" aria-hidden="true" />
          <p className="text-[10px] text-amber-700 font-black uppercase tracking-wider text-left">
            Aviso: Demonstração local do sistema Rovya.
          </p>
        </div>

        <div className="h-20 w-20 bg-slate-50 rounded-[32px] flex items-center justify-center mb-6">
          <AlertCircle size={40} className="text-slate-300" aria-hidden="true" />
        </div>

        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-navy mb-4">
          Corrida simulada não encontrada
        </h1>

        <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-[280px]">
          Nenhuma corrida real foi consultada. Este identificador não corresponde à corrida ativa da
          demo.
        </p>

        <div className="w-full space-y-3 max-w-xs">
          <Link
            to="/passageiro/corridas"
            className="w-full flex items-center justify-center bg-navy text-white h-14 rounded-2xl font-black uppercase italic tracking-widest focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none transition-all hover:bg-navy/90 min-h-[44px]"
          >
            Ver Corridas
          </Link>
          <Link
            to="/passageiro/inicio"
            className="w-full flex items-center justify-center bg-white border border-slate-200 text-slate-500 h-14 rounded-2xl font-black uppercase italic tracking-widest focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none transition-all hover:bg-slate-50 min-h-[44px]"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-6 px-4 pb-24">
      <header className="flex items-center gap-4 mb-8">
        <button
          type="button"
          aria-label="Voltar para a corrida"
          onClick={() =>
            navigate({
              to: "/passageiro/corrida/$rideId/em-andamento",
              params: { rideId },
            })
          }
          className="p-2 -ml-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter">Cancelar Corrida</h1>
      </header>

      <div className="mb-6 p-3 bg-rovya-navy/5 border border-rovya-navy/10 rounded-xl">
        <p className="text-xs font-bold text-rovya-navy flex items-center gap-2">
          <Info size={14} />
          Cenário simulado: piloto no local
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <p className="text-sm font-bold text-slate-600">Por que você deseja cancelar?</p>
        <div className="grid grid-cols-1 gap-2">
          {reasons.map((r) => (
            <button
              type="button"
              key={r.id}
              aria-pressed={selectedReason === r.id}
              aria-label={`Motivo: ${r.label}`}
              onClick={() => setSelectedReason(r.id)}
              className={`p-4 flex items-center justify-between border rounded-2xl transition-all ${
                selectedReason === r.id
                  ? "border-rovya-orange bg-orange-50/50"
                  : "border-slate-100 hover:bg-slate-50"
              }`}
            >
              <span className="font-bold text-sm text-left">{r.label}</span>
              {selectedReason === r.id && (
                <div className="h-4 w-4 rounded-full bg-rovya-orange shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {consequence && (
        <div
          className={`p-4 rounded-2xl border ${
            consequence.impact === "high"
              ? "bg-red-50 border-red-200"
              : "bg-blue-50 border-blue-200"
          } mb-8`}
        >
          <div className="flex gap-3">
            <Info
              className={`h-5 w-5 shrink-0 ${
                consequence.impact === "high" ? "text-red-500" : "text-blue-500"
              }`}
            />
            <div>
              <p
                className={`font-black uppercase text-xs mb-1 ${
                  consequence.impact === "high" ? "text-red-700" : "text-blue-700"
                }`}
              >
                Estimativa simulada
              </p>
              <p className="text-sm text-slate-700 leading-tight">{consequence.message}</p>
              {!consequence.canCancelFree && (
                <p className="mt-2 font-bold text-sm text-slate-900">
                  Taxa de cancelamento: {formatCurrency(consequence.fee)}
                </p>
              )}
              <p className="mt-2 text-[10px] text-slate-500 leading-tight">
                * Nenhuma taxa real será cobrada e nenhuma conta real será afetada nesta
                demonstração.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t md:relative md:bg-transparent md:border-0 md:p-0">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              disabled={!selectedReason}
              className="w-full py-4 bg-rovya-red text-white font-black uppercase rounded-2xl hover:bg-red-700 disabled:opacity-50 transition-colors shadow-lg shadow-red-200 md:shadow-none"
            >
              Confirmar Cancelamento
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-3xl max-w-[90%] md:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-black uppercase tracking-tighter">
                Confirmar cancelamento simulado?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-600">
                Nenhuma corrida real será cancelada e nenhuma cobrança será realizada nesta
                demonstração local.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col md:flex-row gap-2">
              <AlertDialogCancel type="button" className="rounded-xl font-bold border-slate-200">
                Voltar
              </AlertDialogCancel>
              <AlertDialogAction
                type="button"
                onClick={() => {
                  toast.info("Cancelamento simulado: nenhuma corrida real foi cancelada.");
                  window.location.href = "/passageiro/inicio";
                }}
                className="rounded-xl bg-rovya-red text-white font-black uppercase hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
              >
                Confirmar simulação
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
