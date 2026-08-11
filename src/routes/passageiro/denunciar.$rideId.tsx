import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ShieldAlert,
  ChevronRight,
  FileText,
  Camera,
  Send,
  Info,
  CheckCircle2,
  Lock,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { CATEGORIES } from "@/services/mock/support";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/passageiro/denunciar/$rideId")({
  component: DenunciarScreen,
});

function DenunciarScreen() {
  const { rideId } = useParams({ from: "/passageiro/denunciar/$rideId" });
  const navigate = useNavigate();
  const [step, setStep] = useState<"category" | "details" | "success">("category");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [hasEvidence, setHasEvidence] = useState(false);
  const [touched, setTouched] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const isValidRide = rideId === "ride-active-mock" || rideId === "RY-2026-00842";

  const validateDescription = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return "Descreva o ocorrido para continuar.";
    }
    if (trimmed.length < 10) {
      return "O relato deve possuir pelo menos 10 caracteres úteis.";
    }
    if (trimmed.length > 500) {
      return "O relato não deve exceder 500 caracteres.";
    }
    return null;
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    if (newVal.length <= 500) {
      setDescription(newVal);
      if (touched) {
        setValidationError(validateDescription(newVal));
      }
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setValidationError(validateDescription(description));
  };

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    setStep("details");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateDescription(description);
    if (error) {
      setTouched(true);
      setValidationError(error);
      toast.error(error);
      return;
    }
    setStep("success");
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
          Nenhuma corrida real foi consultada. Este identificador não corresponde a uma corrida
          válida para denúncia na demo.
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

  if (step === "success") {
    return (
      <div className="flex min-h-screen flex-col bg-white p-6 items-center text-center justify-center animate-in fade-in duration-500">
        <div className="h-20 w-20 bg-emerald-50 rounded-[32px] flex items-center justify-center mb-6">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-navy mb-4">
          Simulação concluída
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-[280px]">
          Esta é uma demonstração. Geramos o identificador simulado{" "}
          <span className="text-navy font-bold">PR-DEMO-001</span>. Nenhuma denúncia real foi
          registrada.
        </p>
        <div className="w-full space-y-3">
          <Link
            to="/passageiro/saude-da-conta"
            className="w-full flex items-center justify-center bg-navy text-white h-14 rounded-2xl font-black uppercase italic tracking-widest focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none min-h-[44px]"
          >
            Ver protocolos simulados
          </Link>
          <Link
            to="/passageiro/inicio"
            className="w-full flex items-center justify-center text-slate-400 font-bold uppercase text-[10px] focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none min-h-[44px]"
          >
            Voltar para o Início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy">
      <header className="bg-white px-6 py-6 border-b border-slate-100 flex items-center gap-4">
        <button
          type="button"
          onClick={() =>
            step === "details"
              ? setStep("category")
              : navigate({
                  to: "/passageiro/corrida/$rideId/em-andamento",
                  params: { rideId },
                })
          }
          className="h-11 w-11 bg-slate-50 rounded-xl flex items-center justify-center text-navy hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
          aria-label={
            step === "details" ? "Voltar para seleção de categoria" : "Voltar para a corrida"
          }
        >
          <ArrowLeft size={20} strokeWidth={2.5} aria-hidden="true" />
        </button>
        <h1 className="text-xl font-black italic tracking-tighter uppercase">
          {step === "category" ? "Denunciar" : "Detalhes"}
        </h1>
      </header>

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3 items-center">
          <Info size={18} className="text-amber-600 shrink-0" aria-hidden="true" />
          <p className="text-[10px] text-amber-700 font-black uppercase tracking-wider">
            Demonstração local: nenhuma denúncia real será enviada.
          </p>
        </div>

        {step === "category" ? (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3 mb-2">
              <EyeOff size={18} className="text-slate-400 shrink-0" aria-hidden="true" />
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic">
                Simulação de privacidade: em um ambiente real, seus dados seriam protegidos.
              </p>
            </div>

            <h2 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 px-2">
              Selecione uma categoria (Simulado)
            </h2>
            <div className="grid gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className="w-full bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between group active:scale-[0.98] transition-all hover:border-navy focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
                >
                  <span className="text-sm font-bold text-navy">{cat.label}</span>
                  <ChevronRight size={18} className="text-slate-200" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <FileText size={20} aria-hidden="true" />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Categoria selecionada
                  </span>
                  <span className="text-sm font-bold text-navy">
                    {CATEGORIES.find((c) => c.id === selectedCategory)?.label}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label
                    htmlFor="description-input"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                  >
                    Relato detalhado (Mínimo 10 caracteres)
                  </label>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest ${
                      description.length >= 500 ? "text-red-500" : "text-slate-400"
                    }`}
                    id="description-counter"
                    role="status"
                    aria-live="polite"
                  >
                    {description.length}/500 caracteres
                  </span>
                </div>
                <textarea
                  id="description-input"
                  value={description}
                  onChange={handleDescriptionChange}
                  onBlur={handleBlur}
                  maxLength={500}
                  aria-invalid={!!validationError}
                  aria-describedby={`description-counter${validationError ? " description-error" : ""}`}
                  placeholder="Descreva o que aconteceu para fins de demonstração..."
                  className={`w-full min-h-[150px] p-4 bg-slate-50 border rounded-2xl text-sm focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none transition-all ${
                    validationError ? "border-red-500" : "border-slate-100"
                  }`}
                />
                {validationError && (
                  <p
                    id="description-error"
                    className="text-[10px] font-black text-red-500 uppercase tracking-widest"
                    role="alert"
                  >
                    {validationError}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                  Simular Anexo de Evidências
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setHasEvidence(true);
                    toast.info("Demonstração: Nenhum arquivo foi acessado ou enviado.");
                  }}
                  className="w-full h-24 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-50 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
                  aria-label="Simular anexo de foto ou vídeo"
                >
                  <Camera size={24} className="text-slate-300" aria-hidden="true" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Foto ou Vídeo (Simulado)
                  </span>
                </button>
                {hasEvidence && (
                  <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Camera size={16} className="text-blue-400" aria-hidden="true" />
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase">
                      Evidência simulada (não armazenada)
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
              <Lock size={16} className="text-blue-600 shrink-0" aria-hidden="true" />
              <p className="text-[10px] text-blue-800 font-medium leading-relaxed italic">
                Nota: Esta interface demonstra como relatos seriam tratados. Nesta versão local,
                nada é enviado.
              </p>
            </div>

            <Button
              type="submit"
              disabled={!!validateDescription(description)}
              className="w-full bg-navy text-white h-14 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
            >
              <Send size={18} aria-hidden="true" />
              Finalizar Simulação
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}
