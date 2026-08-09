import { createFileRoute } from "@tanstack/react-router";
import { PlayCircle, Zap, Activity, Cpu, ShieldAlert, CheckCircle, Clock, XCircle, MapPin } from "lucide-react";
import { useDemo } from "@/state/DemoContext";

export const Route = createFileRoute("/simulador/")({
  component: SimulatorPage,
});

function SimulatorPage() {
  const { setPilotStatus } = useDemo();

    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-slate-900 border border-white/5 p-10 rounded-[32px] rovya-shadow-lg">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-rovya-orange/10 rounded-2xl text-rovya-orange">
            <Cpu size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white">Console de Operações</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Ambiente de Teste Rovya v1.0</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SimulatorButton 
            icon={<PlayCircle size={20} />} 
            label="Injetar Corrida" 
            sub="Passageiro (Rafael)"
            color="bg-rovya-orange"
            onClick={() => window.location.href = '/passageiro/buscando'}
          />
          <SimulatorButton 
            icon={<Zap size={20} />} 
            label="Simular Aceite" 
            sub="Piloto (Carlos H.)"
            color="bg-rovya-blue"
            onClick={() => window.location.href = '/passageiro/corrida/mock-ride-id'}
          />
          <SimulatorButton 
            icon={<Activity size={20} />} 
            label="Simular Chegada" 
            sub="Gatilho de espera + PIN"
            color="bg-emerald-600"
            onClick={() => {
              const event = new CustomEvent('simular-chegada');
              window.dispatchEvent(event);
              alert("Comando de chegada enviado para a tela de corrida ativa.");
            }}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <SimulatorButton 
            icon={<Cpu size={20} />} 
            label="Zerar Cronômetro" 
            sub="Simular não comparecimento"
            color="bg-red-600"
            onClick={() => {
              const event = new CustomEvent('simular-tempo-esgotado');
              window.dispatchEvent(event);
            }}
          />
          <SimulatorButton 
            icon={<Activity size={20} />} 
            label="Audit Log Dump" 
            sub="Exportar JSON da sessão"
            color="bg-slate-700"
          />
        </div>

        <div className="flex flex-col gap-3 mt-10">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Estados de Análise (Piloto)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SimulatorButton 
              icon={<Clock size={20} />} 
              label="Set: Em Análise" 
              sub="Fila de espera padrão"
              color="bg-amber-500"
              onClick={() => {
                setPilotStatus('pending');
                window.location.href = '/piloto/analise';
              }}
            />
            <SimulatorButton 
              icon={<ShieldAlert size={20} />} 
              label="Set: Correção" 
              sub="Solicitar novo documento"
              color="bg-rovya-blue"
              onClick={() => {
                setPilotStatus('needs_info', { 
                  correctionField: 'CNH', 
                  correctionMessage: 'A foto da CNH está com reflexo. Por favor, envie uma nova foto nítida.' 
                });
                window.location.href = '/piloto/analise';
              }}
            />
            <SimulatorButton 
              icon={<CheckCircle size={20} />} 
              label="Set: Aprovado" 
              sub="Liberar para operação"
              color="bg-emerald-600"
              onClick={() => {
                setPilotStatus('active');
                window.location.href = '/piloto/analise';
              }}
            />
            <SimulatorButton 
              icon={<XCircle size={20} />} 
              label="Set: Rejeitado" 
              sub="Perfil não compatível"
              color="bg-red-600"
              onClick={() => {
                setPilotStatus('rejected', { 
                  rejectionReason: 'Não foi possível validar os antecedentes criminais com os dados fornecidos.' 
                });
                window.location.href = '/piloto/analise';
              }}
            />
            <SimulatorButton 
              icon={<MapPin size={20} />} 
              label="Set: Cidade Off" 
              sub="Lista de espera (Região)"
              color="bg-slate-700"
              onClick={() => {
                setPilotStatus('city_unavailable');
                window.location.href = '/piloto/analise';
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 bg-black/40 border border-white/5 rounded-[32px] font-mono text-xs">
          <div className="flex items-center justify-between mb-6">
            <p className="text-emerald-500 font-black tracking-widest uppercase">System Runtime Logs</p>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <div className="space-y-3 opacity-60">
            <p className="text-slate-400 font-bold">[18:51:04] <span className="text-white">BOOT_SEQUENCE</span>: Módulos de interface carregados.</p>
            <p className="text-slate-400 font-bold">[18:52:12] <span className="text-rovya-blue">AUTH_MOCK</span>: Carlos Henrique online na célula 01.</p>
            <p className="text-slate-400 font-bold">[18:53:45] <span className="text-rovya-orange">GEO_MOCK</span>: Rafael definiu rota (Mock Location).</p>
            <p className="text-slate-400 font-bold animate-pulse text-emerald-500">&gt; AWAITTING_INPUT_...</p>
          </div>
        </div>
        
        <div className="aspect-video bg-slate-900 border border-white/5 rounded-[32px] flex flex-col items-center justify-center p-12 text-center text-slate-600 gap-4">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <Activity size={32} strokeWidth={1.5} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
            Visualizador de Malha de Tráfego<br/>indisponível em modo estático.
          </p>
        </div>
      </div>
    </div>
  ),
});

function SimulatorButton({ icon, label, sub, color, onClick }: { icon: React.ReactNode, label: string, sub: string, color: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-start p-6 bg-white/5 border border-white/5 rounded-3xl hover:border-white/20 transition-all group text-left w-full"
    >
      <div className={`p-3 rounded-2xl mb-4 transition-transform group-hover:scale-110 ${color} text-white`}>
        {icon}
      </div>
      <span className="text-[11px] font-black uppercase tracking-widest text-white">{label}</span>
      <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-500 mt-1">{sub}</span>
    </button>
  );
}
