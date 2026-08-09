import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RovyaBrand } from "@/components/RovyaBrand";
import { useState } from "react";
import { MapPin, Camera, Bell, ShieldCheck, Check, X, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/permissions")({
  component: PermissionsScreen,
});

function PermissionsScreen() {
  const [permissions, setPermissions] = useState({
    location: false,
    camera: true, // Já usamos na etapa anterior, simulando aprovação
    notifications: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions({ ...permissions, [key]: !permissions[key] });
  };

  const handleFinish = () => {
    if (!permissions.location) {
      toast.error("A localização é necessária para chamar um piloto.");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Configurações salvas!");
      navigate({ to: "/passageiro" });
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-navy selection:bg-rovya-orange/20">
      <header className="p-8 pb-4">
        <div className="flex flex-col items-center gap-6">
          <RovyaBrand className="scale-90" />
        </div>
      </header>

      <main className="flex-1 px-8 py-10 flex flex-col max-w-sm mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-2 mb-10">
          <h1 className="text-2xl font-black uppercase tracking-tight italic text-navy leading-tight">
            Transparência e Controle
          </h1>
          <p className="text-sm text-slate-500">
            A Rovya utiliza apenas o necessário para sua segurança e conveniência.
          </p>
        </div>

        <div className="space-y-4">
          <PermissionCard 
            icon={<MapPin size={22} />}
            title="Localização"
            description="Necessário para localizar pilotos próximos e monitorar sua corrida em tempo real."
            active={permissions.location}
            onToggle={() => togglePermission('location')}
            required
          />

          <PermissionCard 
            icon={<Camera size={22} />}
            title="Câmera"
            description="Usada para sua foto de perfil e para scanear QR codes de segurança durante o embarque."
            active={permissions.camera}
            onToggle={() => togglePermission('camera')}
          />

          <PermissionCard 
            icon={<Bell size={22} />}
            title="Notificações"
            description="Receba avisos sobre a chegada do piloto, promoções e alertas críticos de segurança."
            active={permissions.notifications}
            onToggle={() => togglePermission('notifications')}
          />
        </div>

        <div className="mt-auto pt-10 flex flex-col gap-6">
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <ShieldCheck size={20} className="text-rovya-green shrink-0" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest">Identidade Verificada</p>
              <p className="text-[9px] text-emerald-700 font-medium italic">Selo de segurança ativo em seu perfil.</p>
            </div>
          </div>

          <button 
            onClick={handleFinish}
            disabled={isLoading}
            className="w-full bg-navy text-white h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-navy/90 transition-all active:scale-95 disabled:opacity-50 rovya-shadow"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Concluir e Começar"}
            {!isLoading && <ArrowRight size={18} strokeWidth={2.5} />}
          </button>
        </div>
      </main>
    </div>
  );
}

function PermissionCard({ icon, title, description, active, onToggle, required }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  active: boolean;
  onToggle: () => void;
  required?: boolean;
}) {
  return (
    <div 
      onClick={onToggle}
      className={`p-5 rounded-[24px] border transition-all cursor-pointer group flex gap-4 ${active ? 'bg-white border-rovya-orange shadow-sm' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}
    >
      <div className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center transition-colors ${active ? 'bg-rovya-orange text-white' : 'bg-white text-slate-300 shadow-sm'}`}>
        {icon}
      </div>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-black uppercase tracking-wider text-navy">
            {title}
            {required && <span className="ml-1 text-rovya-orange">*</span>}
          </h3>
          <div className={`h-6 w-10 rounded-full p-1 transition-colors flex items-center ${active ? 'bg-rovya-orange' : 'bg-slate-200'}`}>
            <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform flex items-center justify-center ${active ? 'translate-x-4' : 'translate-x-0'}`}>
              {active ? <Check size={8} className="text-rovya-orange" /> : <X size={8} className="text-slate-300" />}
            </div>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </div>
  );
}
