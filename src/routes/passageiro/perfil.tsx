import React, { useState, useMemo } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  User,
  MapPin,
  CreditCard,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Lock,
  Phone,
  AlertCircle,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/passageiro/perfil")({
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Rafael");
  const [tempName, setTempName] = useState("Rafael");

  const initials = useMemo(() => {
    const trimmed = name.trim();
    const parts = trimmed.split(/\s+/).filter(Boolean);
    const first = parts[0] || "";
    const second = parts[1] || "";

    if (!first) return "P";

    if (!second) {
      return first.slice(0, 2).toUpperCase();
    }

    const firstChar = first[0] || "";
    const secondChar = second[0] || "";

    return (firstChar + secondChar).toUpperCase();
  }, [name]);

  const handleLogout = () => {
    toast.info("Saída simulada. Nenhuma sessão real foi encerrada.", {
      duration: 4000,
    });
    navigate({ to: "/passageiro/entrar" });
  };

  const handleSaveName = () => {
    const trimmedName = tempName.trim();

    if (!trimmedName) {
      toast.error("O nome não pode ser vazio.");
      setTempName(name);
      return;
    }

    setName(trimmedName);
    setIsEditing(false);
    toast.success("Nome alterado somente nesta demonstração.");
  };

  const handleCancelEdit = () => {
    setTempName(name);
    setIsEditing(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-[calc(80px+env(safe-area-inset-bottom))]">
      {/* Banner de aviso de demonstração */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-[24px] mb-8 flex gap-3">
        <Info size={18} className="text-blue-500 shrink-0" aria-hidden="true" />
        <p className="text-[11px] font-bold text-blue-700 leading-tight">
          Demonstração local: os dados e as ações deste perfil são simulados e não alteram uma conta
          real.
        </p>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="mb-4">
          <div
            className="h-24 w-24 rounded-[32px] bg-navy border-4 border-white shadow-xl overflow-hidden flex items-center justify-center font-black text-2xl text-white"
            aria-hidden="true"
          >
            {initials}
          </div>
        </div>

        {isEditing ? (
          <div className="flex flex-col items-center gap-2 w-full max-w-xs">
            <div className="w-full">
              <label htmlFor="profile-name" className="sr-only">
                Nome do passageiro
              </label>
              <Input
                id="profile-name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                maxLength={30}
                placeholder="Seu nome"
                className="text-center h-10 rounded-xl font-bold text-navy"
                autoFocus
              />
            </div>
            <div className="flex gap-2 w-full">
              <Button
                type="button"
                onClick={handleCancelEdit}
                variant="ghost"
                className="flex-1 text-[10px] font-black uppercase"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleSaveName}
                className="flex-1 bg-navy text-white text-[10px] font-black uppercase rounded-xl"
              >
                Salvar
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h1 className="text-2xl font-black tracking-tight text-navy uppercase italic">
                {name}
              </h1>
              <div
                className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100"
                aria-label="Perfil verificado somente para simulação"
              >
                <CheckCircle2 size={12} className="text-blue-500" aria-hidden="true" />
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">
                  Simulação
                </span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              Perfil Fictício — Demonstração
            </p>
            <button
              type="button"
              onClick={() => {
                setTempName(name);
                setIsEditing(true);
              }}
              className="mt-2 text-[9px] font-black text-blue-500 uppercase tracking-widest hover:underline focus-visible:ring-2 focus-visible:ring-rovya-orange outline-none rounded-sm px-1 min-h-[44px] min-w-[44px]"
            >
              Editar Nome
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">
            Conta e Segurança
          </h2>
          <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden">
            <ProfileItem
              icon={<Phone size={18} aria-hidden="true" />}
              label="Telefone"
              value="(43) 999**-**12"
              readOnly
            />
            <ProfileLink
              to="/passageiro/locais-salvos"
              icon={<MapPin size={18} aria-hidden="true" />}
              label="Locais Salvos"
              description="Casa, Trabalho, Favoritos"
            />
            <div className="flex items-center justify-between p-5 border-b border-slate-50 last:border-0 opacity-80">
              <div className="flex items-center gap-4">
                <div className="text-slate-400">
                  <CreditCard size={18} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-black text-navy leading-none mb-1">
                    Formas presenciais — demonstração
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    Nenhuma transação financeira ocorre
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">
            Privacidade
          </h2>
          <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden">
            <ProfileLink
              to="/passageiro/saude-da-conta"
              icon={<Shield size={18} aria-hidden="true" />}
              label="Saúde da Conta"
              description="Score simulado (Demonstração)"
            />

            <ProfileLink
              to="/passageiro/privacidade"
              icon={<Lock size={18} aria-hidden="true" />}
              label="Dados Pessoais"
              description="Gerenciar informações"
            />
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">
            Suporte
          </h2>
          <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden">
            <ProfileLink
              to="/passageiro/suporte"
              icon={<HelpCircle size={18} aria-hidden="true" />}
              label="Ajuda"
              description="FAQ, Central de suporte"
            />
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">
            Gestão de Conta
          </h2>
          <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden">
            <button
              type="button"
              onClick={() => toast.info("Simulação local: nenhuma conta foi excluída.")}
              className="w-full flex items-center justify-between p-5 hover:bg-red-50 transition-colors focus-visible:ring-2 focus-visible:ring-rovya-orange outline-none min-h-[44px]"
            >
              <div className="flex items-center gap-4 text-red-400">
                <AlertCircle size={18} aria-hidden="true" />
                <span className="text-sm font-bold text-red-600">Simular exclusão de conta</span>
              </div>
              <ChevronRight size={18} className="text-red-200" aria-hidden="true" />
            </button>
          </div>
        </section>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-5 bg-rose-50 text-rose-600 rounded-[28px] flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-colors active:scale-95 mb-8 outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
        >
          <LogOut size={18} aria-hidden="true" />
          Sair da demonstração
        </button>
      </div>

      <p className="text-center text-[9px] text-slate-300 font-bold uppercase tracking-widest mb-4">
        Rovya App v1.0.4 • Ambiente de demonstração
      </p>
    </div>
  );
}

function ProfileItem({
  icon,
  label,
  value,
  readOnly = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  readOnly?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-5 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-4">
        <div className="text-slate-400">{icon}</div>
        <div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">
            {label}
          </p>
          <p className="text-xs font-bold text-navy">{value}</p>
        </div>
      </div>
      {readOnly && <Lock size={14} className="text-slate-200" aria-hidden="true" />}
    </div>
  );
}

function ProfileLink({
  to,
  icon,
  label,
  description,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between p-5 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors active:bg-slate-100 outline-none focus-visible:bg-slate-50"
    >
      <div className="flex items-center gap-4">
        <div className="text-slate-400">{icon}</div>
        <div>
          <p className="text-sm font-black text-navy leading-none mb-1">{label}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            {description}
          </p>
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-200" aria-hidden="true" />
    </Link>
  );
}
