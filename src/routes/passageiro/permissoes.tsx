import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RovyaBrand } from "@/components/RovyaBrand";
import { useState } from "react";
import { MapPin, Camera, Bell, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/passageiro/permissoes")({
  component: PermissionsScreen,
});

type SimulatedPermission = "pending" | "allowed" | "denied";

function PermissionsScreen() {
  const [location, setLocation] = useState<SimulatedPermission>("pending");
  const [camera, setCamera] = useState<SimulatedPermission>("pending");
  const [notifications, setNotifications] = useState<SimulatedPermission>("pending");

  const navigate = useNavigate();

  const handleFinish = () => {
    toast.success("Preferências simuladas concluídas. Nenhuma permissão real foi solicitada.");
    navigate({ to: "/passageiro/inicio" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-navy selection:bg-rovya-orange/20">
      <header className="p-8 pb-4">
        <div className="flex flex-col items-center gap-6">
          <RovyaBrand className="scale-90" />
        </div>
      </header>

      <main className="flex-1 px-8 py-10 flex flex-col max-w-sm mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-4 mb-10">
          <h1 className="text-2xl font-black uppercase tracking-tight italic text-navy leading-tight">
            Transparência e Controle
          </h1>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3 items-start">
            <AlertCircle size={18} className="text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-[10px] text-blue-700 font-bold leading-relaxed uppercase tracking-wider">
              Demonstração local: estes controles não solicitam permissões reais do aparelho.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <PermissionSection
            id="location"
            icon={<MapPin size={22} />}
            title="Localização"
            description="Simula a localização durante o uso para demonstrar a escolha de origem e o acompanhamento da corrida."
            state={location}
            onAllow={() => setLocation("allowed")}
            onDeny={() => setLocation("denied")}
            allowedText="Estado simulado: localização permitida durante o uso. Nenhum GPS foi acessado."
            deniedText="Você poderá informar origem e destino manualmente nesta demonstração."
          />

          <PermissionSection
            id="camera"
            icon={<Camera size={22} />}
            title="Câmera"
            description="Simula a permissão de câmera usada no preview local da foto."
            state={camera}
            onAllow={() => setCamera("allowed")}
            onDeny={() => setCamera("denied")}
            allowedText="Estado simulado: câmera permitida. A câmera não foi aberta nesta tela."
            deniedText="Você poderá continuar sem capturar uma nova foto."
          />

          <PermissionSection
            id="notifications"
            icon={<Bell size={22} />}
            title="Notificações"
            description="Simula avisos sobre chegada do piloto e atualizações da corrida."
            state={notifications}
            onAllow={() => setNotifications("allowed")}
            onDeny={() => setNotifications("denied")}
            allowedText="Estado simulado: notificações permitidas. Nenhuma notificação do aparelho foi enviada."
            deniedText="Os avisos continuarão aparecendo somente dentro das telas da demonstração."
          />
        </div>

        <div className="mt-auto pt-10 flex flex-col gap-6">
          <div
            className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl"
            role="status"
          >
            <ShieldCheck size={20} className="text-rovya-green shrink-0" aria-hidden="true" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest">
                Identidade verificada — simulação
              </p>
              <p className="text-[9px] text-emerald-700 font-medium italic">
                Nenhuma verificação real foi realizada.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            className="w-full bg-navy text-white h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-navy/90 transition-all active:scale-95 rovya-shadow"
          >
            Concluir e Começar
            <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      </main>
    </div>
  );
}

interface PermissionSectionProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  state: SimulatedPermission;
  onAllow: () => void;
  onDeny: () => void;
  allowedText: string;
  deniedText: string;
}

function PermissionSection({
  id,
  icon,
  title,
  description,
  state,
  onAllow,
  onDeny,
  allowedText,
  deniedText,
}: PermissionSectionProps) {
  const statusText =
    state === "allowed"
      ? allowedText
      : state === "denied"
        ? deniedText
        : "Nenhuma decisão simulada foi selecionada.";

  return (
    <section
      aria-labelledby={`${id}-title`}
      className={`p-5 rounded-[24px] border transition-all flex gap-4 ${state === "allowed" ? "bg-white border-rovya-orange shadow-sm" : state === "denied" ? "bg-slate-50 border-slate-200" : "bg-slate-50 border-slate-100"}`}
    >
      <div
        className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center transition-colors ${state === "allowed" ? "bg-rovya-orange text-white" : "bg-white text-slate-300 shadow-sm"}`}
        aria-hidden="true"
      >
        {icon}
      </div>

      <div className="flex-1 space-y-3">
        <div className="space-y-1">
          <h2
            id={`${id}-title`}
            className="text-[11px] font-black uppercase tracking-wider text-navy"
          >
            {title}
          </h2>
          <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{description}</p>
        </div>

        <div className="space-y-3">
          <div
            role="group"
            aria-label={`Controles de simulação para ${title}`}
            className="grid grid-cols-1 gap-2"
          >
            <button
              type="button"
              onClick={onAllow}
              aria-pressed={state === "allowed"}
              className={`w-full min-h-11 whitespace-normal px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all focus-visible:ring-2 focus-visible:ring-rovya-orange focus-visible:outline-none ${state === "allowed" ? "bg-rovya-orange text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              Permitir na demonstração
            </button>
            <button
              type="button"
              onClick={onDeny}
              aria-pressed={state === "denied"}
              className={`w-full min-h-11 whitespace-normal px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none ${state === "denied" ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              Agora não
            </button>
          </div>

          <div
            aria-live="polite"
            className={`text-[9px] font-bold italic leading-tight ${state === "allowed" ? "text-rovya-orange" : state === "denied" ? "text-slate-500" : "text-slate-400"}`}
          >
            {statusText}
          </div>
        </div>
      </div>
    </section>
  );
}
