import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import {
  Shield,
  Share2,
  Users,
  Phone,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  HeadphonesIcon,
} from "lucide-react";
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
import { z } from "zod";

export const Route = createFileRoute("/passageiro/seguranca")({
  validateSearch: z.object({ rideId: z.string().optional() }),
  component: SafetyScreen,
});

function SafetyScreen() {
  const navigate = useNavigate();
  const { rideId } = useSearch({ from: "/passageiro/seguranca" });
  const [isEmergencyConfirmOpen, setIsEmergencyConfirmOpen] = useState(false);

  const handleBack = () => {
    if (rideId) navigate({ to: "/passageiro/corrida/$rideId/em-andamento", params: { rideId } });
    else navigate({ to: "/passageiro/inicio" });
  };

  return (
    <div className="flex flex-col bg-porcelain font-sans text-navy p-6 min-h-screen">
      <button
        type="button"
        onClick={handleBack}
        className="mb-6 flex items-center gap-2 text-sm font-black uppercase text-navy"
      >
        Voltar
      </button>

      <div className="bg-navy rounded-[32px] p-8 text-white shadow-2xl mb-8">
        <h2 className="text-2xl font-black italic uppercase">Central de Segurança</h2>
        <p className="text-xs text-slate-400 mt-2">
          Demonstração local — nenhum rastreamento real está ativo.
        </p>
      </div>

      <section className="space-y-4">
        <button
          type="button"
          onClick={() => toast.success("Prévia simulada criada. Nada foi enviado.")}
          className="w-full bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
              <Share2 size={24} />
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
          className="w-full bg-white p-5 rounded-3xl border border-slate-100 flex items-center gap-4"
        >
          <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
            <HeadphonesIcon size={24} />
          </div>
          <div>
            <span className="block text-sm font-black italic uppercase">Falar com suporte</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Central de ajuda</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setIsEmergencyConfirmOpen(true)}
          className="w-full bg-red-50 p-5 rounded-3xl border border-red-100 flex items-center gap-4"
        >
          <div className="bg-red-100 p-3 rounded-2xl text-red-600">
            <ShieldAlert size={24} />
          </div>
          <div>
            <span className="block text-sm font-black italic uppercase text-red-700">
              Emergência
            </span>
            <span className="text-[10px] font-bold text-red-400 uppercase">Simulação</span>
          </div>
        </button>
      </section>

      <AlertDialog open={isEmergencyConfirmOpen} onOpenChange={setIsEmergencyConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emergência simulada</AlertDialogTitle>
            <AlertDialogDescription>
              Simulação encerrada. Nenhuma ligação foi aberta e nenhuma autoridade foi contatada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Fechar</AlertDialogCancel>
            <AlertDialogAction onClick={() => setIsEmergencyConfirmOpen(false)}>
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
