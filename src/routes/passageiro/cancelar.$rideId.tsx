import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Info, AlertTriangle, XCircle, ChevronRight } from "lucide-react";
import { calculateCancellationConsequence } from "@/services/mock/account-health";

export const Route = createFileRoute("/passageiro/cancelar/$rideId")({
  component: CancelarCorrida,
});

function CancelarCorrida() {
  const { rideId } = useParams({ from: "/passageiro/cancelar/$rideId" });
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const reasons = [
    { id: "desistencia", label: "Desistência" },
    { id: "demora", label: "Demora para aceitar" },
    { id: "piloto_parado", label: "Piloto parado" },
    { id: "veiculo_divergente", label: "Veículo diferente" },
    { id: "seguranca", label: "Insegurança" },
    { id: "pagamento", label: "Divergência de pagamento" },
  ];

  const consequence = selectedReason ? calculateCancellationConsequence("arrived", selectedReason) : null;

  return (
    <div className="max-w-lg mx-auto py-6">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate({ to: "/passageiro/corrida/$rideId/em-andamento", params: { rideId } })} className="p-2 -ml-2 text-slate-400">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter">Cancelar Corrida</h1>
      </header>

      <div className="space-y-4 mb-8">
        <p className="text-sm font-bold text-slate-600">Por que você deseja cancelar?</p>
        <div className="grid grid-cols-1 gap-2">
          {reasons.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedReason(r.id)}
              className={`p-4 flex items-center justify-between border rounded-2xl transition-all ${
                selectedReason === r.id ? "border-rovya-orange bg-orange-50/50" : "border-slate-100 hover:bg-slate-50"
              }`}
            >
              <span className="font-bold text-sm">{r.label}</span>
              {selectedReason === r.id && <div className="h-4 w-4 rounded-full bg-rovya-orange" />}
            </button>
          ))}
        </div>
      </div>

      {consequence && (
        <div className={`p-4 rounded-2xl border ${consequence.impact === 'high' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'} mb-8`}>
          <div className="flex gap-3">
            <Info className={`h-5 w-5 ${consequence.impact === 'high' ? 'text-red-500' : 'text-blue-500'}`} />
            <div>
              <p className={`font-black uppercase text-xs mb-1 ${consequence.impact === 'high' ? 'text-red-700' : 'text-blue-700'}`}>
                {consequence.impact === 'high' ? 'Atenção' : 'Consequência'}
              </p>
              <p className="text-sm text-slate-700">{consequence.message}</p>
              {!consequence.canCancelFree && (
                <p className="mt-2 font-bold text-sm text-slate-900">Taxa de cancelamento: R$ {consequence.fee.toFixed(2)}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <button 
        disabled={!selectedReason}
        onClick={() => navigate({ to: "/passageiro/inicio" })}
        className="w-full py-4 bg-rovya-red text-white font-black uppercase rounded-2xl hover:bg-red-700 disabled:opacity-50"
      >
        Confirmar Cancelamento
      </button>
    </div>
  );
}
