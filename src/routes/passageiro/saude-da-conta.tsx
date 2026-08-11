import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  Shield,
  HeartPulse,
  History,
  ChevronRight,
  Scale,
  FileText,
  Info,
} from "lucide-react";
import {
  MOCK_ACCOUNT_HEALTH,
  getHealthColor,
  getHealthLabel,
} from "@/services/mock/account-health";
import { MOCK_PROTOCOLS, getStatusLabel } from "@/services/mock/support";

export const Route = createFileRoute("/passageiro/saude-da-conta")({
  component: AccountHealthPage,
});

function AccountHealthPage() {
  const health = MOCK_ACCOUNT_HEALTH;

  return (
    <div className="max-w-lg mx-auto py-6 px-4 pb-24">
      <header className="flex items-center gap-4 mb-6">
        <Link
          to="/passageiro/perfil"
          className="p-2 -ml-2 text-slate-400 hover:text-navy min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
          aria-label="Voltar para o Perfil"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </Link>
        <h1 className="text-xl font-black uppercase tracking-tighter text-navy">Saúde da Conta</h1>
      </header>

      {/* Banner de Transparência */}
      <div
        className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3 items-start"
        role="note"
        aria-label="Aviso de demonstração"
      >
        <Info className="text-blue-500 shrink-0 mt-0.5" size={18} aria-hidden="true" />
        <p className="text-xs text-blue-700 font-medium leading-relaxed">
          Demonstração local: score, ocorrências e protocolos são dados fictícios. Nenhuma
          penalidade ou decisão real está sendo aplicada à sua conta.
        </p>
      </div>

      <section className="mb-8">
        <div className="p-6 bg-white border border-slate-100 rounded-[32px] rovya-shadow-sm flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-3xl bg-emerald-50 flex items-center justify-center mb-4">
            <HeartPulse className="text-emerald-500 h-8 w-8" aria-hidden="true" />
          </div>
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            Status do Score Simulado
          </h2>
          <div
            className={`px-4 py-1 rounded-full border text-sm font-black uppercase ${getHealthColor(health.status)}`}
            aria-label={`Status da saúde: ${getHealthLabel(health.status)}`}
          >
            {getHealthLabel(health.status)}
          </div>

          <div className="mt-6 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={health.score}
              aria-label="Score de integridade simulado"
              style={{ width: `${health.score}%` }}
            />
          </div>
          <p className="mt-3 text-[10px] font-bold text-slate-400">
            Score exemplificativo: {health.score}/100
          </p>
        </div>
      </section>

      <section className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-navy">
            Protocolos Simulados
          </h2>
          <Link
            to="/passageiro/suporte"
            className="text-[10px] font-bold text-blue-500 uppercase hover:underline min-h-[44px] flex items-center px-2"
          >
            Ajuda
          </Link>
        </div>
        <div className="space-y-3">
          {MOCK_PROTOCOLS.map((proto) => (
            <Link
              key={proto.id}
              to="/passageiro/protocolos/$caseId"
              params={{ caseId: proto.id }}
              className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-colors group min-h-[64px]"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${proto.status === "resolvida" ? "bg-emerald-50 text-emerald-500" : "bg-blue-50 text-blue-500"}`}
                  aria-hidden="true"
                >
                  <FileText size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-navy">{proto.id}</p>
                  <p className="text-[9px] text-slate-400 font-black uppercase">
                    {getStatusLabel(proto.status)}
                  </p>
                </div>
              </div>
              <ChevronRight
                size={16}
                className="text-slate-300 group-hover:text-navy transition-colors"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-navy">
            Impactos Fictícios no Score (Simulados)
          </h2>
          <span className="text-[10px] font-bold text-slate-400">Últimos 30 dias</span>
        </div>

        <div className="space-y-3">
          {health.occurrences.map((occ) => (
            <Link
              key={occ.id}
              to="/passageiro/recursos/$caseId"
              params={{ caseId: occ.id }}
              className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-colors group min-h-[64px]"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${occ.impactScore < 0 ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"}`}
                  aria-hidden="true"
                >
                  {occ.type === "cancellation" ? <History size={20} /> : <Scale size={20} />}
                </div>
                <div>
                  <p className="font-bold text-sm text-navy">{occ.description}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    {new Date(occ.date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-black ${occ.impactScore < 0 ? "text-red-500" : "text-emerald-500"}`}
                >
                  {occ.impactScore > 0 ? "+" : ""}
                  {occ.impactScore}
                </span>
                <ChevronRight
                  size={16}
                  className="text-slate-300 group-hover:text-navy transition-colors"
                  aria-hidden="true"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-8 p-6 bg-slate-900 rounded-[32px] text-white">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-rovya-orange h-5 w-5" aria-hidden="true" />
          <h3 className="font-black uppercase text-xs tracking-widest">
            Identificação Demonstrativa
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Este ambiente é estritamente para demonstração de interface. Os dados de saúde da conta
          são gerados localmente para ilustrar como o sistema de integridade funcionaria em uma
          versão futura.
        </p>
      </footer>
    </div>
  );
}
