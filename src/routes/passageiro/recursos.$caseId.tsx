import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Scale, Calendar, FileText, AlertCircle, CheckCircle2, Send, Info } from "lucide-react";
import { MOCK_ACCOUNT_HEALTH } from "@/services/mock/account-health";
import { toast } from "sonner";

export const Route = createFileRoute("/passageiro/recursos/$caseId")({
  component: RecursoOcorrencia,
});

function RecursoOcorrencia() {
  const { caseId } = useParams({ from: "/passageiro/recursos/$caseId" });
  const navigate = useNavigate();
  const occurrence = MOCK_ACCOUNT_HEALTH.occurrences.find(o => o.id === caseId);
  const [reason, setReason] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!occurrence) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Ocorrência não encontrada.</p>
        <button onClick={() => navigate({ to: "/passageiro/saude-da-conta" })} className="mt-4 text-rovya-orange font-bold uppercase text-xs">Voltar</button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.length < 10) {
      toast.error("Por favor, descreva o motivo com mais detalhes.");
      return;
    }
    setIsSubmitted(true);
    toast.success("Recurso enviado para análise humana.");
  };

  if (isSubmitted) {
    return (
      <div className="max-w-lg mx-auto py-12 px-6 flex flex-col items-center text-center">
        <div className="h-20 w-20 rounded-[32px] bg-emerald-50 flex items-center justify-center mb-6">
          <CheckCircle2 className="text-emerald-500 h-10 w-10" />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-4 text-navy">Recurso Enviado</h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          Sua contestação foi recebida e será analisada por nossa equipe de governança. 
          Você receberá uma notificação assim que houver um parecer.
        </p>
        <button 
          onClick={() => navigate({ to: "/passageiro/saude-da-conta" })}
          className="w-full py-4 bg-navy text-white font-black uppercase rounded-2xl"
        >
          Voltar para Saúde da Conta
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-6">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate({ to: "/passageiro/saude-da-conta" })} className="p-2 -ml-2 text-slate-400">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter">Detalhes e Recurso</h1>
      </header>

      <section className="bg-white border border-slate-100 rounded-[32px] p-6 mb-8 rovya-shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
            <Scale size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo de Ocorrência</p>
            <p className="font-bold text-navy">{occurrence.type === 'cancellation' ? 'Cancelamento' : 'Outro'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-300" />
            <span className="text-xs text-slate-500">{new Date(occurrence.date).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className="text-red-400" />
            <span className="text-xs font-bold text-red-500">Impacto: {occurrence.impactScore}</span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
          <p className="text-xs text-slate-600 leading-relaxed italic">"{occurrence.description}"</p>
        </div>
        {occurrence.rideId && (
          <p className="text-[10px] font-bold text-slate-400 uppercase">Ref: {occurrence.rideId}</p>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4 px-2">
          <FileText size={16} className="text-navy" />
          <h2 className="text-sm font-black uppercase tracking-wider text-navy">Contestar Ocorrência</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl mb-4">
            <div className="flex gap-3">
              <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed">
                Descreva por que você acredita que esta ocorrência é indevida. 
                Erros de sistema ou motivos de segurança não são penalizados.
              </p>
            </div>
          </div>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Descreva seu motivo aqui..."
            className="w-full min-h-[150px] p-4 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-rovya-orange outline-none transition-all"
          />

          <button 
            type="submit"
            className="w-full py-4 bg-navy text-white font-black uppercase rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95"
          >
            <Send size={16} />
            Enviar para Análise
          </button>
        </form>
      </section>
    </div>
  );
}
