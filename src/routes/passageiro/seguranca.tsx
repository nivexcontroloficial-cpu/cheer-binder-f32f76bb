import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { Share2, ShieldAlert, HeadphonesIcon } from "lucide-react";
import {
  rideQuoteSearchSchema,
  getQuoteParams,
} from "@/lib/passenger-demo-ride-quote";
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
import { z } from "zod";

export const Route = createFileRoute("/passageiro/seguranca")({
  validateSearch: (search) => rideQuoteSearchSchema.parse(search),
  component: SafetyScreen,
});

function SafetyScreen() {
  const navigate = useNavigate();
  const { rideId } = useSearch({ from: "/passageiro/seguranca" });
  const [isEmergencyConfirmOpen, setIsEmergencyConfirmOpen] = useState(false);
  const [shareResult, setShareResult] = useState<string | null>(null);
  const [emergencyResult, setEmergencyResult] = useState<string | null>(null);

  const handleBack = () => {
    if (rideId) navigate({ to: "/passageiro/corrida/$rideId", params: { rideId }, search: (prev: any) => getQuoteParams(prev) });
    else navigate({ to: "/passageiro/inicio" });
  };

  return (
    <div className="flex flex-col bg-porcelain font-sans text-navy p-6 min-h-screen">
      <button
        type="button"
        onClick={handleBack}
        className="mb-6 flex items-center gap-2 text-sm font-black uppercase text-navy min-w-[44px] min-h-[44px] focus-visible:ring-2 focus-visible:ring-rovya-orange outline-none rounded-xl"
        aria-label="Voltar para a tela anterior"
      >
        Voltar
      </button>

      <div className="bg-navy rounded-[32px] p-8 text-white shadow-2xl mb-8">
        <h1 className="text-2xl font-black italic uppercase">Central de Segurança</h1>
        <p className="text-xs text-slate-400 mt-2">
          Demonstração local — nenhum rastreamento real está ativo.
        </p>
      </div>

      {shareResult && (
        <div
          role="status"
          aria-live="polite"
          className="mb-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-xs font-bold text-emerald-700"
        >
          {shareResult}
        </div>
      )}

      {emergencyResult && (
        <div
          role="status"
          aria-live="polite"
          className="mb-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-xs font-bold text-red-700"
        >
          {emergencyResult}
        </div>
      )}

      <section className="space-y-4">
        <button
          type="button"
          onClick={() => setShareResult("Prévia simulada criada. Nada foi enviado.")}
          className="w-full bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between min-h-[44px] focus-visible:ring-2 focus-visible:ring-rovya-orange focus-visible:ring-offset-2 outline-none"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
              <Share2 size={24} aria-hidden="true" />
            </div>
            <div>
              <span className="block text-sm font-black italic uppercase">
                Compartilhar trajeto
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Prévia simulada
              </span>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate({ to: "/passageiro/suporte" })}
          className="w-full bg-white p-5 rounded-3xl border border-slate-100 flex items-center gap-4 min-h-[44px] focus-visible:ring-2 focus-visible:ring-rovya-orange focus-visible:ring-offset-2 outline-none text-left"
        >
          <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
            <HeadphonesIcon size={24} aria-hidden="true" />
          </div>
          <div>
            <span className="block text-sm font-black italic uppercase">Falar com suporte</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Central de ajuda</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setIsEmergencyConfirmOpen(true)}
          className="w-full bg-red-50 p-5 rounded-3xl border border-red-100 flex items-center gap-4 min-h-[44px] focus-visible:ring-2 focus-visible:ring-rovya-orange focus-visible:ring-offset-2 outline-none text-left"
        >
          <div className="bg-red-100 p-3 rounded-2xl text-red-600">
            <ShieldAlert size={24} aria-hidden="true" />
          </div>
          <div>
            <span className="block text-sm font-black italic uppercase text-red-700">
              Emergência
            </span>
            <span className="text-[10px] font-bold text-red-400 uppercase">Simulação</span>
          </div>
        </button>
      </section>

      <section className="mt-8">
        <h3 className="text-sm font-black italic uppercase">Contatos de confiança</h3>
        <div className="bg-white p-4 rounded-3xl mt-2 border border-slate-100">
          <span className="block font-bold">Monica — Família</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            Contato mockado — nenhum telefone real cadastrado
          </span>
        </div>
      </section>

      <AlertDialog open={isEmergencyConfirmOpen} onOpenChange={setIsEmergencyConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja executar a simulação de emergência?</AlertDialogTitle>
            <AlertDialogDescription>
              Nenhuma ligação será aberta e nenhuma autoridade será contatada. Esta ação é apenas
              uma demonstração local.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsEmergencyConfirmOpen(false);
                setEmergencyResult(
                  "Simulação encerrada. Nenhuma ligação foi aberta e nenhuma autoridade foi contatada.",
                );
              }}
            >
              Sim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
