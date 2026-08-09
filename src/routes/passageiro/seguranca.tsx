import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Shield, 
  Share2, 
  Users, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  HeadphonesIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

export const Route = createFileRoute("/passageiro/seguranca")({
  component: SafetyScreen,
});

function SafetyScreen() {
  const navigate = useNavigate();
  const [isEmergencyConfirmOpen, setIsEmergencyConfirmOpen] = useState(false);
  
  const trustedContacts = [
    { id: '1', name: 'Monica', relation: 'Família' }
  ];

  const handleShareRide = () => {
    toast.success("Link de rastreamento enviado aos seus contatos de confiança!");
  };

  const handleEmergencyCall = () => {
    setIsEmergencyConfirmOpen(true);
  };

  const confirmEmergencyCall = () => {
    toast.error("Simulando chamada para 190...");
    setIsEmergencyConfirmOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy">
      <header className="bg-white px-6 py-6 border-b border-slate-100 flex items-center gap-4">
        <button 
          onClick={() => navigate({ to: -1 as any })}
          className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-navy active:scale-95 transition-all"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-black italic tracking-tighter uppercase">Central de Segurança</h1>
      </header>

      <main className="flex-1 p-6 space-y-6">
        {/* Shield Status */}
        <div className="bg-navy rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Shield size={120} />
          </div>
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-blue-400" size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Proteção Ativa</span>
            </div>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-tight">
              Você está sendo<br/>monitorado.
            </h2>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[200px] mt-2">
              Toda a sua rota é gravada e rastreada por nossa central 24h.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Ações Rápidas</h3>
          
          <button 
            onClick={handleShareRide}
            className="w-full bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between group active:scale-[0.98] transition-all shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Share2 size={24} />
              </div>
              <div className="text-left">
                <span className="block text-sm font-black italic tracking-tighter uppercase">Compartilhar Trajeto</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enviar link em tempo real</span>
              </div>
            </div>
            <ArrowRight size={20} className="text-slate-200 group-hover:text-blue-500 transition-colors" />
          </button>

          <div className="w-full bg-white p-5 rounded-3xl border border-slate-100 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-navy">
                  <Users size={24} />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-black italic tracking-tighter uppercase">Contatos de Confiança</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{trustedContacts.length} contato adicionado</span>
                </div>
              </div>
              <button className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-navy border border-slate-100">
                <Lock size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {trustedContacts.map(contact => (
                <div key={contact.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-black">
                      {contact.name[0]}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black uppercase italic">{contact.name}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{contact.relation}</span>
                    </div>
                  </div>
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Critical Actions */}
        <section className="space-y-3 pt-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Suporte e Emergência</h3>
          
          <button 
            onClick={() => toast.info("Conectando com nossa Central de Segurança...")}
            className="w-full bg-white p-5 rounded-3xl border border-slate-100 flex items-center gap-4 active:scale-[0.98] transition-all shadow-sm"
          >
            <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <HeadphonesIcon size={24} />
            </div>
            <div className="text-left">
              <span className="block text-sm font-black italic tracking-tighter uppercase">Falar com Suporte Rovya</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atendimento especializado 24h</span>
            </div>
          </button>

          <button 
            onClick={handleEmergencyCall}
            className="w-full bg-red-50 p-5 rounded-3xl border border-red-100 flex items-center gap-4 active:scale-[0.98] transition-all"
          >
            <div className="h-12 w-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
              <ShieldAlert size={24} />
            </div>
            <div className="text-left">
              <span className="block text-sm font-black italic tracking-tighter uppercase text-red-700">Ligar para Emergência</span>
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Acionar 190 (Polícia Militar)</span>
            </div>
          </button>
        </section>

        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
          <AlertTriangle size={16} className="text-amber-600 shrink-0" />
          <p className="text-[10px] text-amber-800 font-medium leading-relaxed italic">
            A Rovya não é um serviço de segurança pública. Em caso de perigo iminente, sempre acione as autoridades locais através do número 190.
          </p>
        </div>
      </main>

      {/* Confirmation Dialogs */}
      <AlertDialog open={isEmergencyConfirmOpen} onOpenChange={setIsEmergencyConfirmOpen}>
        <AlertDialogContent className="rounded-[32px] p-8 max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black italic uppercase tracking-tight text-red-600 flex items-center gap-2">
              <ShieldAlert size={24} />
              Confirmar Chamada?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 font-medium leading-relaxed pt-2">
              Você está prestes a ligar para o número de emergência 190. Use esta ação apenas em situações críticas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 mt-4">
            <AlertDialogAction 
              onClick={confirmEmergencyCall}
              className="w-full py-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black italic uppercase tracking-widest border-none"
            >
              Ligar Agora
            </AlertDialogAction>
            <AlertDialogCancel className="w-full py-6 rounded-2xl border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Cancelar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}