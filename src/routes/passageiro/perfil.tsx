import React from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { 
  User, 
  MapPin, 
  CreditCard, 
  Shield, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  Camera, 
  Star,
  CheckCircle2,
  Lock,
  Phone,
  AlertCircle
} from "lucide-react";

import { useDemo } from "@/state/DemoContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/passageiro/perfil")({
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { resetData } = useDemo();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Rafael");
  const [tempName, setTempName] = useState("Rafael");
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleLogout = () => {
    resetData();
    navigate({ to: '/passageiro/entrar' });
    toast.success("Sessão encerrada");
  };

  const handleSaveName = () => {
    setName(tempName);
    setIsEditing(false);
    toast.success("Perfil atualizado");
  };

  const handlePhotoClick = () => {
    toast.info("Simulando abertura de câmera...");
    // Mock de troca de foto
    setTimeout(() => {
      setAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150");
      toast.success("Foto atualizada localmente");
    }, 1500);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div className="h-24 w-24 rounded-[32px] bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <User size={40} className="text-slate-300" />
            )}
          </div>
          <button 
            onClick={handlePhotoClick}
            className="absolute -bottom-1 -right-1 h-8 w-8 rounded-xl bg-navy text-white flex items-center justify-center shadow-lg border-2 border-white active:scale-90 transition-transform"
          >
            <Camera size={14} />
          </button>
        </div>

        {isEditing ? (
          <div className="flex flex-col items-center gap-2 w-full max-w-xs">
            <Input 
              value={tempName} 
              onChange={(e) => setTempName(e.target.value)}
              className="text-center h-10 rounded-xl font-bold text-navy"
              autoFocus
            />
            <div className="flex gap-2 w-full">
              <Button onClick={() => setIsEditing(false)} variant="ghost" className="flex-1 text-[10px] font-black uppercase">Cancelar</Button>
              <Button onClick={handleSaveName} className="flex-1 bg-navy text-white text-[10px] font-black uppercase rounded-xl">Salvar</Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h1 className="text-2xl font-black tracking-tight text-navy uppercase italic">{name}</h1>
              <CheckCircle2 size={16} className="text-blue-500" />
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <Star size={10} className="fill-rovya-orange text-rovya-orange" />
              4.9 • Passageiro Nível 4
            </p>
            <button 
              onClick={() => { setTempName(name); setIsEditing(true); }}
              className="mt-2 text-[9px] font-black text-blue-500 uppercase tracking-widest hover:underline"
            >
              Editar Nome
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Conta e Segurança</h2>
          <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden">
            <ProfileItem 
              icon={<Phone size={18} />} 
              label="Telefone" 
              value="(43) 999**-**12" 
              readOnly
            />
            <ProfileLink 
              to="/passageiro/locais-salvos" 
              icon={<MapPin size={18} />} 
              label="Locais Salvos" 
              description="Casa, Trabalho, Favoritos"
            />
            <ProfileLink 
              to="/passageiro" 
              icon={<CreditCard size={18} />} 
              label="Formas de Pagamento" 
              description="Dinheiro, Pix, Máquina"
            />
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Privacidade</h2>
          <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden">
            <ProfileLink 
              to="/passageiro/saude-da-conta" 
              icon={<Shield size={18} />} 
              label="Saúde da Conta" 
              description="Score excelente, ocorrências"
            />

            <ProfileLink 
              to="/passageiro" 
              icon={<Lock size={18} />} 
              label="Dados Pessoais" 
              description="Gerenciar informações"
            />
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Suporte</h2>
          <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden">
            <ProfileLink 
              to="/passageiro/suporte" 
              icon={<HelpCircle size={18} />} 
              label="Ajuda" 
              description="FAQ, Central de suporte"
            />
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Gestão de Conta</h2>
          <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden">
             <button 
              onClick={() => toast.warning("Simulando fluxo de exclusão de conta...")}
              className="w-full flex items-center justify-between p-5 hover:bg-red-50 transition-colors"
            >
              <div className="flex items-center gap-4 text-red-400">
                <AlertCircle size={18} />
                <span className="text-sm font-bold text-red-600">Excluir Minha Conta</span>
              </div>
              <ChevronRight size={18} className="text-red-200" />
            </button>
          </div>
        </section>


        <button 
          onClick={handleLogout}
          className="w-full py-5 bg-rose-50 text-rose-600 rounded-[28px] flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-colors active:scale-95 mb-8"
        >
          <LogOut size={18} />
          Encerrar Sessão
        </button>
      </div>

      <p className="text-center text-[9px] text-slate-300 font-bold uppercase tracking-widest mb-4">
        Rovya App v1.0.4 • Mock Environment
      </p>
    </div>
  );
}

function ProfileItem({ icon, label, value, readOnly = false }: { icon: React.ReactNode, label: string, value: string, readOnly?: boolean }) {
  return (
    <div className="flex items-center justify-between p-5 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-4">
        <div className="text-slate-400">{icon}</div>
        <div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">{label}</p>
          <p className="text-xs font-bold text-navy">{value}</p>
        </div>
      </div>
      {readOnly && <Lock size={14} className="text-slate-200" />}
    </div>
  );
}

function ProfileLink({ to, icon, label, description }: { to: string, icon: React.ReactNode, label: string, description: string }) {
  return (
    <Link to={to} className="flex items-center justify-between p-5 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors active:bg-slate-100">
      <div className="flex items-center gap-4">
        <div className="text-slate-400">{icon}</div>
        <div>
          <p className="text-sm font-black text-navy leading-none mb-1">{label}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{description}</p>
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-200" />
    </Link>
  );
}
