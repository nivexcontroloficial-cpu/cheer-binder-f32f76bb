import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronLeft,
  Scale,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle2,
  Send,
  Info,
} from "lucide-react";
import { MOCK_ACCOUNT_HEALTH } from "@/services/mock/account-health";
import { toast } from "sonner";

export const Route = createFileRoute("/passageiro/recursos/$caseId")({
  component: RecursoOcorrencia,
});

function RecursoOcorrencia() {
  const { caseId } = useParams({ from: "/passageiro/recursos/$caseId" });
  const occurrence = MOCK_ACCOUNT_HEALTH.occurrences.find((o) => o.id === caseId);
  const [reason, setReason] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const trimmedReason = reason.trim();
  const isValid = trimmedReason.length >= 10 && trimmedReason.length <= 500;

  const validate = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      setError("Descreva um motivo para continuar.");
    } else if (trimmed.length < 10) {
      setError("O relato deve possuir pelo menos 10 caracteres úteis.");
    } else {
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    // Defensive validation
    const trimmed = reason.trim();
    if (trimmed.length < 10) {
      setError("O relato deve possuir pelo menos 10 caracteres úteis.");
      return;
    }
    if (reason.length > 500) {
      setError("O relato deve ter no máximo 500 caracteres.");
      return;
    }

    setError(null);
    setIsSubmitted(true);
    toast.success("Recurso registrado somente nesta demonstração.");
  };

  const DemoBanner = () => (
    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl mb-6 flex gap-3 items-start">
      <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
      <p className="text-[11px] font-bold text-amber-800 leading-tight uppercase tracking-tight">
        Demonstração local: este recurso não será enviado nem analisado por uma equipe real.
      </p>
    </div>
  );

  if (!occurrence) {
    return (
      <div className="max-w-lg mx-auto py-12 px-6 flex flex-col items-center text-center">
        <DemoBanner />
        <div className="h-20 w-20 rounded-[32px] bg-slate-50 flex items-center justify-center mb-6">
          <AlertCircle className="text-slate-400 h-10 w-10" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-4 text-navy">
          Ocorrência simulada não encontrada
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          Nenhuma consulta real foi realizada. Os IDs válidos para esta demonstração são "occ-1" e
          "occ-2".
        </p>
        <Link
          to="/passageiro/saude-da-conta"
          className="w-full py-4 bg-navy text-white font-black uppercase rounded-2xl flex items-center justify-center min-h-[44px]"
        >
          Voltar para Saúde da Conta
        </Link>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div
        className="max-w-lg mx-auto py-12 px-6 flex flex-col items-center text-center"
        role="status"
      >
        <DemoBanner />
        <div className="h-20 w-20 rounded-[32px] bg-emerald-50 flex items-center justify-center mb-6">
          <CheckCircle2 className="text-emerald-500 h-10 w-10" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-4 text-navy">
          Recurso simulado registrado
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          O texto foi mantido somente no estado desta tela. Nada foi enviado e nenhuma análise real
          será realizada.
        </p>
        <Link
          to="/passageiro/saude-da-conta"
          className="w-full py-4 bg-navy text-white font-black uppercase rounded-2xl flex items-center justify-center min-h-[44px]"
        >
          Voltar para Saúde da Conta
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-6 px-4">
      <DemoBanner />
      <header className="flex items-center gap-4 mb-8">
        <Link
          to="/passageiro/saude-da-conta"
          className="p-2 -ml-2 text-slate-400 min-w-[44px] min-h-[44px] flex items-center justify-center focus:ring-2 focus:ring-rovya-orange rounded-full"
          aria-label="Voltar para Saúde da Conta"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </Link>
        <h1 className="text-xl font-black uppercase tracking-tighter">Detalhes e Recurso</h1>
      </header>

      <section className="bg-white border border-slate-100 rounded-[32px] p-6 mb-8 rovya-shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
            <Scale size={20} aria-hidden="true" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Tipo (Fictício)
            </p>
            <p className="font-bold text-navy">
              {occurrence.type === "cancellation" ? "Cancelamento" : "Outro"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-300" aria-hidden="true" />
            <span className="text-xs text-slate-500">
              {new Date(occurrence.date).toLocaleDateString("pt-BR")} (Dados fictícios)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className="text-red-400" aria-hidden="true" />
            <span className="text-xs font-bold text-red-500">
              Impacto simulado: {occurrence.impactScore}
            </span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
          <p className="text-xs text-slate-600 leading-relaxed italic">
            "{occurrence.description}"
          </p>
        </div>
        {occurrence.rideId && (
          <p className="text-[10px] font-bold text-slate-400 uppercase">
            Referência fictícia: {occurrence.rideId}
          </p>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4 px-2">
          <FileText size={16} className="text-navy" aria-hidden="true" />
          <h2 className="text-sm font-black uppercase tracking-wider text-navy">
            Contestar Ocorrência
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl mb-4">
            <div className="flex gap-3">
              <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-[11px] font-bold text-blue-800 leading-relaxed uppercase tracking-tight">
                Instrução demonstrativa: descreva o motivo. Motivos de segurança ou operacionais são
                exemplos fictícios nesta tela.
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="reason"
              className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1"
            >
              Seu Relato
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => {
                const val = e.target.value;
                if (val.length <= 500) {
                  setReason(val);
                  if (touched) validate(val);
                }
              }}
              onBlur={() => {
                setTouched(true);
                validate(reason);
              }}
              placeholder="Descreva seu motivo aqui..."
              maxLength={500}
              aria-invalid={!!error}
              aria-describedby={error ? "reason-error reason-counter" : "reason-counter"}
              className={`w-full min-h-[150px] p-4 bg-white border rounded-2xl text-sm focus:ring-2 focus:ring-rovya-orange outline-none transition-all resize-none ${
                error && touched ? "border-red-500 bg-red-50/10" : "border-slate-200"
              }`}
            />
            <div className="flex justify-between items-center px-1">
              <div id="reason-counter" className="text-[10px] font-bold text-slate-400 uppercase">
                {trimmedReason.length} de 500 caracteres
              </div>
              {error && (
                <p
                  id="reason-error"
                  role="alert"
                  className="text-[10px] font-bold text-red-500 uppercase"
                >
                  {error}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-4 font-black uppercase rounded-2xl flex items-center justify-center gap-2 transition-all min-h-[44px] ${
              isValid
                ? "bg-navy text-white hover:bg-slate-800 active:scale-95 focus:ring-2 focus:ring-rovya-orange"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Send size={16} aria-hidden="true" />
            Registrar Recurso Simulado
          </button>
        </form>
      </section>
    </div>
  );
}
