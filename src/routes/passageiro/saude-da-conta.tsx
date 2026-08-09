import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Shield, HeartPulse, History, AlertTriangle, ChevronRight, Scale, FileText } from "lucide-react";
import { MOCK_ACCOUNT_HEALTH, getHealthColor, getHealthLabel, MOCK_PROTOCOLS, getStatusLabel } from "@/services/mock/support";


export const Route = createFileRoute("/passageiro/saude-da-conta")({
  component: AccountHealthPage,
});

function AccountHealthPage() {
  const navigate = useNavigate();
  const health = MOCK_ACCOUNT_HEALTH;

  return (
    <div className="max-w-lg mx-auto py-6">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate({ to: "/passageiro/perfil" })} className="p-2 -ml-2 text-slate-400">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter">Saúde da Conta</h1>
      </header>

      <section className="mb-8">
        <div className="p-6 bg-white border border-slate-100 rounded-[32px] rovya-shadow-sm flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-3xl bg-emerald-50 flex items-center justify-center mb-4">
            <HeartPulse className="text-emerald-500 h-8 w-8" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Atual</p>
          <div className={`px-4 py-1 rounded-full border text-sm font-black uppercase ${getHealthColor(health.status)}`}>
            {getHealthLabel(health.status)}
          </div>
          <div className="mt-6 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${health.score}%` }} />
          </div>
          <p className="mt-2 text-[10px] font-bold text-slate-400">Score de integridade: {health.score}/100</p>
        </div>
      </section>

      <section className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-navy">Protocolos de Suporte</h2>
          <Link to="/passageiro/suporte" className="text-[10px] font-bold text-blue-500 uppercase">Ajuda</Link>
        </div>
        {MOCK_PROTOCOLS.map(proto => (
          <Link 
            key={proto.id} 
            to="/passageiro/protocolos/$caseId" 
            params={{ caseId: proto.id }}
            className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-50"
          >
            <div className="flex items-center gap-4">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${proto.status === 'resolvida' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'}`}>
                <FileText size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-navy">{proto.id}</p>
                <p className="text-[9px] text-slate-400 font-black uppercase">{getStatusLabel(proto.status)}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </Link>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-navy">Impactos no Score</h2>
          <span className="text-[10px] font-bold text-slate-400">Últimos 30 dias</span>
        </div>


        {health.occurrences.map((occ) => (
          <Link 
            key={occ.id} 
            to="/passageiro/recursos/$caseId" 
            params={{ caseId: occ.id }}
            className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-50"
          >
            <div className="flex items-center gap-4">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${occ.impactScore < 0 ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                {occ.type === 'cancellation' ? <History size={20} /> : <Scale size={20} />}
              </div>
              <div>
                <p className="font-bold text-sm text-navy">{occ.description}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(occ.date).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-black ${occ.impactScore < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                {occ.impactScore > 0 ? '+' : ''}{occ.impactScore}
              </span>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          </Link>
        ))}
      </section>

      <div className="mt-8 p-6 bg-slate-900 rounded-[32px] text-white">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-rovya-orange h-5 w-5" />
          <h3 className="font-black uppercase text-xs tracking-widest">Compromisso Rovya</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Mantemos um ambiente seguro e justo para todos. Cancelamentos excessivos ou má conduta podem afetar sua saúde da conta e acesso à plataforma.
        </p>
        <button className="text-[10px] font-black uppercase tracking-widest text-rovya-orange">Saber mais sobre políticas</button>
      </div>
    </div>
  );
}
