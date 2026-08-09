import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { 
  Power, 
  Map as MapIcon, 
  TrendingUp, 
  Clock, 
  Bike, 
  AlertTriangle,
  Wifi,
  Signal,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign
} from "lucide-react";
import { useState, useEffect } from "react";
import { useDemo } from "@/state/DemoContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/piloto/operacao")({
  head: () => ({
    title: "Operação Online - Rovya Piloto",
    meta: [
      {
        name: "description",
        content: "Central de Operação para Pilotos Rovya.",
      },
    ],
  }),
  component: PilotOperation,
});

function PilotOperation() {
  const { pilotRegistration, setPilotStatus } = useDemo();
  const [isOnline, setIsOnline] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'stable' | 'weak' | 'offline'>('stable');
  const [gpsStatus, setGpsStatus] = useState<'high' | 'low'>('high');
  
  // Mock indicators
  const stats = {
    ganhosDia: 142.50,
    corridasDia: 8,
    horasOnline: "05:42",
    taxaRovya: 28.50,
    statusFinanceiro: 'Em dia'
  };

  const isBlocked = pilotRegistration.status === 'blocked' || pilotRegistration.status === 'debt_blocked';
  const isApproved = pilotRegistration.status === 'active';

  const toggleOnline = () => {
    if (isOnline) {
      setIsOnline(false);
      toast.info("Você está Offline agora.");
      return;
    }

    // Validações antes de ficar online
    if (!isApproved) {
      if (isBlocked) {
        toast.error("Acesso bloqueado. Verifique sua situação financeira.");
        return;
      }
      toast.error("Seu cadastro ainda não foi aprovado para operação.");
      return;
    }

    setIsOnline(true);
    toast.success("Você está Online! Buscando corridas...");
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Status da Conexão e GPS */}
      <div className="flex items-center justify-between px-2 text-[10px] font-black uppercase tracking-widest text-white/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Wifi size={12} className={connectionStatus === 'stable' ? 'text-rovya-green' : 'text-rovya-orange'} />
            <span>Conexão Estável</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Signal size={12} className={gpsStatus === 'high' ? 'text-rovya-green' : 'text-rovya-orange'} />
            <span>GPS Precisão Alta</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-rovya-green"></span>
          <span>São Paulo - Centro</span>
        </div>
      </div>

      {/* Controle Online/Offline */}
      <div className="relative group">
        <button 
          onClick={toggleOnline}
          className={`w-full py-8 rounded-[40px] flex flex-col items-center justify-center gap-3 transition-all duration-500 rovya-shadow-lg border ${
            isOnline 
              ? 'bg-rovya-green border-rovya-green/20 text-navy' 
              : 'bg-white/5 border-white/10 text-porcelain hover:bg-white/10'
          } ${isBlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className={`h-16 w-16 rounded-full flex items-center justify-center transition-transform duration-500 ${
            isOnline ? 'bg-navy/20 scale-110' : 'bg-white/10'
          }`}>
            <Power size={32} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-black uppercase italic tracking-tighter">
            {isOnline ? 'ESTOU ONLINE' : 'FICAR ONLINE'}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-[0.2em] opacity-60`}>
            {isOnline ? 'AGUARDANDO CHAMADAS' : 'CLIQUE PARA INICIAR'}
          </span>
        </button>
        
        {isOnline && (
          <div className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rovya-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rovya-green"></span>
          </div>
        )}
      </div>

      {/* Alerta de Bloqueio/Pendência */}
      {!isApproved && (
        <div className="bg-rovya-orange/10 border border-rovya-orange/20 rounded-3xl p-5 flex items-start gap-4">
          <div className="h-10 w-10 rounded-2xl bg-rovya-orange/20 flex items-center justify-center text-rovya-orange shrink-0">
            <AlertTriangle size={20} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-black uppercase text-rovya-orange italic tracking-tight">Pendência Detectada</h4>
            <p className="text-xs text-rovya-orange/70 mt-1 leading-relaxed">
              {isBlocked 
                ? "Sua conta possui faturas em atraso. Regularize para voltar a operar." 
                : "Seu cadastro está em análise. Você será notificado assim que for aprovado."}
            </p>
            <Link 
              to="/piloto" 
              className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-black uppercase tracking-widest text-rovya-orange bg-rovya-orange/10 px-3 py-1.5 rounded-lg hover:bg-rovya-orange/20 transition-colors"
            >
              {isBlocked ? "Ver Cobrança" : "Ver Status"}
              <ChevronRight size={12} strokeWidth={3} />
            </Link>
          </div>
        </div>
      )}

      {/* Resumo Financeiro Rápido */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-xl bg-rovya-green/10 flex items-center justify-center text-rovya-green">
              <TrendingUp size={14} strokeWidth={2.5} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Ganhos do Dia</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] font-bold text-white/30 uppercase">R$</span>
            <span className="text-2xl font-black italic tracking-tighter text-porcelain">
              {stats.ganhosDia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Clock size={14} strokeWidth={2.5} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Tempo Online</span>
          </div>
          <span className="text-2xl font-black italic tracking-tighter text-porcelain">
            {stats.horasOnline}
          </span>
        </div>
      </div>

      {/* Mapa de Demanda Esquemático */}
      <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/60">
              <MapIcon size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase italic tracking-tight text-porcelain">Demanda na Região</h3>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">Atualizado agora</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-rovya-orange/10 text-rovya-orange border-rovya-orange/20 text-[9px] font-black uppercase tracking-widest py-1">
            Alta Demanda
          </Badge>
        </div>
        
        {/* Schematic Map Canvas */}
        <div className="h-64 relative bg-[#0A0F1E] flex items-center justify-center overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-10" style={{ 
            backgroundImage: 'radial-gradient(circle, #2F80ED 1px, transparent 1px)', 
            backgroundSize: '30px 30px' 
          }}></div>
          
          {/* Heat areas */}
          <div className="absolute w-40 h-40 bg-rovya-orange/20 blur-3xl rounded-full top-10 left-10"></div>
          <div className="absolute w-32 h-32 bg-rovya-green/10 blur-2xl rounded-full bottom-10 right-10"></div>
          
          {/* Schematic streets */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300">
            <path d="M0 150 H400 M200 0 V300 M100 0 L300 300 M300 0 L100 300" stroke="white" strokeWidth="1" fill="none" />
          </svg>
          
          {/* Pilot marker */}
          <div className="relative z-10">
            <div className="h-8 w-8 rounded-full bg-navy border-2 border-rovya-orange flex items-center justify-center shadow-lg shadow-rovya-orange/20">
              <Bike size={14} className="text-rovya-orange" strokeWidth={3} />
            </div>
            <div className="absolute -inset-2 bg-rovya-orange/20 rounded-full animate-ping"></div>
          </div>

          {/* Indicators overlay */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-navy/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
              <span className="h-2 w-2 rounded-full bg-rovya-orange"></span>
              <span className="text-[8px] font-black uppercase text-porcelain">Alta Demanda (Centro)</span>
            </div>
            <div className="flex items-center gap-2 bg-navy/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
              <span className="h-2 w-2 rounded-full bg-rovya-green"></span>
              <span className="text-[8px] font-black uppercase text-porcelain">Oferta Baixa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores Detalhados */}
      <div className="bg-graphite border border-white/5 rounded-[40px] p-6 mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6">Métricas de Hoje</h3>
        <div className="space-y-6">
          <MetricRow 
            label="Corridas Concluídas" 
            value={stats.corridasDia.toString()} 
            icon={<CheckCircle2 size={16} className="text-rovya-green" />} 
          />
          <MetricRow 
            label="Taxa Rovya Acumulada" 
            value={`R$ ${stats.taxaRovya.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
            icon={<ShieldCheck size={16} className="text-rovya-orange" />} 
          />
          <MetricRow 
            label="Situação Financeira" 
            value={stats.statusFinanceiro} 
            isSuccess 
            icon={<DollarSign size={16} className="text-rovya-green" />} 
          />
        </div>
      </div>
      
    </div>
  );
}

function MetricRow({ label, value, icon, isSuccess = false }: { label: string; value: string; icon: React.ReactNode; isSuccess?: boolean }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center transition-colors group-hover:bg-white/10">
          {icon}
        </div>
        <span className="text-xs font-bold text-white/60 tracking-tight">{label}</span>
      </div>
      <span className={`text-sm font-black italic tracking-tight ${isSuccess ? 'text-rovya-green' : 'text-porcelain'}`}>
        {value}
      </span>
    </div>
  );
}