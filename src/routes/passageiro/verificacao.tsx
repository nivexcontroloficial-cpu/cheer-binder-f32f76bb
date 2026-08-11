import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { RovyaBrand } from "@/components/RovyaBrand";
import { useState, useRef, useEffect } from "react";
import {
  Camera,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Lightbulb,
  UserCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/passageiro/verificacao")({
  component: VerificationScreen,
});

function VerificationScreen() {
  const [step, setStep] = useState(1); // 1: data, 2: photo, 3: success
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    photo: null as string | null,
  });
  const [errors, setErrors] = useState({
    fullName: "",
    birthDate: "",
    photo: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const readerRef = useRef<FileReader | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (readerRef.current) {
        const reader = readerRef.current;
        reader.onload = null;
        reader.onerror = null;
        reader.onabort = null;
        if (reader.readyState === FileReader.LOADING) {
          reader.abort();
        }
        readerRef.current = null;
      }
    };
  }, []);

  const validateStep1 = () => {
    let valid = true;
    const newErrors = { fullName: "", birthDate: "", photo: "" };

    const trimmedName = formData.fullName.trim();
    if (!trimmedName) {
      newErrors.fullName = "Nome completo é obrigatório.";
      valid = false;
    } else if (trimmedName.length > 60) {
      newErrors.fullName = "O nome deve ter no máximo 60 caracteres.";
      valid = false;
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "Data de nascimento é obrigatória.";
      valid = false;
    } else {
      const selectedDate = new Date(formData.birthDate);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.birthDate = "Data de nascimento não pode ser no futuro.";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (!formData.photo) {
        setErrors((prev) => ({
          ...prev,
          photo: "A foto de perfil é obrigatória para a simulação.",
        }));
        return;
      }
      setStep(3);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setErrors((prev) => ({ ...prev, photo: "" }));

    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          photo: "Por favor, selecione apenas arquivos de imagem.",
        }));
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setErrors((prev) => ({ ...prev, photo: "A imagem deve ter no máximo 5MB." }));
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      // Cancel previous read if any
      if (readerRef.current) {
        const prevReader = readerRef.current;
        prevReader.onload = null;
        prevReader.onerror = null;
        prevReader.onabort = null;
        if (prevReader.readyState === FileReader.LOADING) {
          prevReader.abort();
        }
      }

      const reader = new FileReader();
      readerRef.current = reader;

      reader.onload = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result as string }));
        readerRef.current = null;
      };

      reader.onerror = () => {
        setErrors((prev) => ({ ...prev, photo: "Erro ao ler o arquivo localmente." }));
        readerRef.current = null;
      };

      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData({ ...formData, photo: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;
  const progressText =
    step === 1
      ? "Etapa 1: Dados Pessoais"
      : step === 2
        ? "Etapa 2: Foto de Perfil"
        : "Verificação Concluída";

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-navy selection:bg-rovya-orange/20">
      <header className="p-8 pb-4">
        <div className="flex flex-col items-center gap-6">
          <RovyaBrand className="scale-90" aria-hidden="true" />
          <div
            role="progressbar"
            aria-label="Progresso da verificação simulada"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={progressText}
            className="w-full flex gap-2"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-rovya-orange" : "bg-slate-100"}`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Banner de Transparência Obrigatória */}
      <div className="px-8 py-3 bg-rovya-orange/10 border-y border-rovya-orange/20 flex items-start gap-3">
        <AlertCircle size={16} className="text-rovya-orange shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-[10px] font-bold text-rovya-orange leading-tight uppercase tracking-wider">
          Demonstração local: os dados e a foto permanecem somente nesta tela e não são enviados,
          armazenados ou analisados.
        </p>
      </div>

      <main className="flex-1 px-8 py-10 flex flex-col max-w-sm mx-auto w-full">
        {step === 1 && (
          <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <h1 className="text-2xl font-black uppercase tracking-tight italic text-navy leading-tight">
                Verificação visual simulada
              </h1>
              <p className="text-sm text-slate-500">
                Precisamos desses dados para a demonstração do fluxo de segurança.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                >
                  Nome Completo (Use nomes fictícios)
                </label>
                <input
                  id="fullName"
                  type="text"
                  maxLength={60}
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: "" });
                  }}
                  placeholder="Ex: João da Silva"
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                  className={`w-full h-14 px-4 bg-slate-50 border ${errors.fullName ? "border-red-500" : "border-slate-100"} rounded-2xl text-navy font-bold focus:outline-none focus:border-rovya-orange focus:bg-white transition-all`}
                />
                {errors.fullName && (
                  <p
                    id="fullName-error"
                    role="alert"
                    className="text-[10px] text-red-500 font-bold uppercase tracking-wider"
                  >
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="birthDate"
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                >
                  Data de Nascimento
                </label>
                <input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => {
                    setFormData({ ...formData, birthDate: e.target.value });
                    if (errors.birthDate) setErrors({ ...errors, birthDate: "" });
                  }}
                  aria-invalid={!!errors.birthDate}
                  aria-describedby={errors.birthDate ? "birthDate-error" : undefined}
                  className={`w-full h-14 px-4 bg-slate-50 border ${errors.birthDate ? "border-red-500" : "border-slate-100"} rounded-2xl text-navy font-bold focus:outline-none focus:border-rovya-orange focus:bg-white transition-all`}
                />
                {errors.birthDate && (
                  <p
                    id="birthDate-error"
                    role="alert"
                    className="text-[10px] text-red-500 font-bold uppercase tracking-wider"
                  >
                    {errors.birthDate}
                  </p>
                )}
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col gap-2">
                <div className="flex gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-rovya-green shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <p className="text-[10px] text-emerald-800 font-medium leading-relaxed">
                    Telefone fictício verificado na demonstração:{" "}
                    <span className="font-bold text-navy">(43) 999**-**12</span>
                  </p>
                </div>
                <p className="text-[9px] text-emerald-600 italic">
                  Este dado é apenas ilustrativo para o ambiente de teste.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-right-4 duration-500 text-center">
            <div className="space-y-2">
              <h1 className="text-2xl font-black uppercase tracking-tight italic text-navy leading-tight">
                Foto de Perfil Local
              </h1>
              <p className="text-sm text-slate-500">
                A foto ajuda a simular como o piloto te identificaria no embarque.
              </p>
            </div>

            <div className="relative aspect-square w-full max-w-[240px] mx-auto group">
              {formData.photo ? (
                <div className="w-full h-full rounded-[40px] overflow-hidden border-4 border-rovya-orange rovya-shadow-lg relative">
                  <img
                    src={formData.photo}
                    alt="Preview da foto de perfil para simulação"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    aria-label="Remover foto e tirar outra"
                    className="absolute bottom-4 right-4 p-3 bg-white text-navy rounded-full shadow-lg hover:bg-slate-50 transition-all active:scale-95"
                  >
                    <RefreshCw size={20} aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  id="photo-button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-invalid={!!errors.photo}
                  aria-describedby={errors.photo ? "photo-error" : undefined}
                  aria-label="Tirar foto ou selecionar arquivo de imagem para demonstração local"
                  className={`w-full h-full rounded-[40px] bg-slate-50 border-2 border-dashed ${errors.photo ? "border-red-500" : "border-slate-200"} flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-rovya-orange hover:bg-white transition-all group`}
                >
                  <div className="p-5 bg-white rounded-3xl shadow-sm group-hover:scale-110 transition-transform">
                    <Camera size={32} strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Usar câmera ou escolher imagem
                  </span>
                </button>
              )}
              <input
                id="photo-input"
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                capture="user"
                onChange={handlePhotoUpload}
              />
            </div>

            {errors.photo && (
              <p
                id="photo-error"
                role="alert"
                className="text-[10px] text-red-500 font-bold uppercase tracking-wider"
              >
                {errors.photo}
              </p>
            )}

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-left">
                <Lightbulb size={18} className="text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">
                    Dica de Iluminação
                  </p>
                  <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                    Em uma situação real, uma boa luz ajudaria na identificação visual pelo piloto.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-center text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                <AlertCircle size={12} aria-hidden="true" />
                Nenhuma biometria ou análise facial é realizada
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-8 w-full animate-in zoom-in duration-500 text-center items-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
              <UserCheck size={40} className="text-rovya-green" aria-hidden="true" />
            </div>

            <div className="space-y-4">
              <h1 className="text-2xl font-black uppercase tracking-tight italic text-navy leading-tight">
                Identidade verificada — simulação
              </h1>
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4 text-left">
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Demonstração concluída. Esta tela simulou o processo de validação de segurança.
                </p>
                <div className="flex items-start gap-3 text-slate-400">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-[10px] uppercase tracking-wider font-bold">
                    Nenhuma verificação real, biometria ou análise foi realizada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto pt-8 flex flex-col gap-4">
          {step < 3 ? (
            <>
              <button
                type="button"
                onClick={handleNextStep}
                aria-label={
                  step === 1 ? "Prosseguir para a foto" : "Finalizar verificação simulada"
                }
                className="w-full bg-navy text-white h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-navy/90 transition-all active:scale-95 rovya-shadow"
              >
                {step === 1 ? "Prosseguir" : "Finalizar Verificação"}
                <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
              </button>

              <div className="flex justify-center">
                {step === 1 ? (
                  <Link
                    to="/passageiro/cadastro"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-navy transition-colors flex items-center gap-1"
                  >
                    Voltar ao Cadastro
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setErrors({ fullName: "", birthDate: "", photo: "" });
                    }}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-navy transition-colors"
                  >
                    Voltar aos Dados
                  </button>
                )}
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate({ to: "/passageiro/permissoes" })}
              className="w-full bg-rovya-orange text-white h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-rovya-orange/90 transition-all active:scale-95 rovya-shadow"
            >
              Continuar para permissões
              <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
