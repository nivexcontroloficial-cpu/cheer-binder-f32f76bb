import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useDemo } from "@/state/DemoContext";
import { CheckCircle2, Clock, XCircle, ShieldAlert, MapPin, ArrowRight, Home, HelpCircle, MessageSquare } from "lucide-react";
import { RovyaBrand } from "@/components/RovyaBrand";

export const Route = createFileRoute("/piloto/analise")({
  component: PilotAnalysisPage,
});

function PilotAnalysisPage() {
  const { pilotRegistration, setPilotStatus } = useDemo();
  const navigate = useNavigate();

  const status = pilotRegistration.status;

  const renderContent = () => {
    switch (status) {
      case 'active':
        return (
          <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={40} strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-black text-navy uppercase italic mb-2 tracking-tighter">Parabéns, {pilotRegistration.nome || 'Piloto'}!</h1>
            <p className="text-slate-500 text-sm max-w-xs mb-8">
              Seu perfil foi aprovado com sucesso. Você já faz parte da frota Rovya.
            </p>
            
            <div className="w-full bg-white border border-slate-100 rounded-3xl p-6 text-left mb-8 rovya-shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Próximos Passos</h3>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold">1</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">Assista ao vídeo de boas-vindas para entender o padrão Rovya.</p>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold">2</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">Confira se o seu veículo e acessórios estão prontos para a operação.</p>
                </li>
              </ul>
            </div>

            <button 
              onClick={() => navigate({ to: '/piloto' })}
              className="w-full py-4 bg-navy text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-navy/90 transition-all active:scale-95 rovya-shadow"
            >
              Ir para Operação
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        );

      case 'needs_info':
        return (
          <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="h-20 w-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
              <ShieldAlert size={40} strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-black text-navy uppercase italic mb-2 tracking-tighter">Ação Necessária</h1>
            <p className="text-slate-500 text-sm max-w-xs mb-8">
              Precisamos de um ajuste em seu cadastro para prosseguir com a aprovação.
            </p>
            
            <div className="w-full bg-blue-50 border border-blue-100 rounded-3xl p-6 text-left mb-8">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert size={14} className="text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Ajuste Solicitado: {pilotRegistration.correctionField}</span>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed font-medium">
                "{pilotRegistration.correctionMessage || 'Verifique o campo pendente e envie novamente.'}"
              </p>
            </div>

            <button 
              onClick={() => navigate({ to: '/piloto/cadastro/corrigir' })}
              className="w-full py-4 bg-navy text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-navy/90 transition-all active:scale-95 rovya-shadow"
            >
              Corrigir Agora
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        );

      case 'rejected':
        return (
          <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="h-20 w-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
              <XCircle size={40} strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-black text-navy uppercase italic mb-2 tracking-tighter">Cadastro Indeferido</h1>
            <p className="text-slate-500 text-sm max-w-xs mb-8">
              Lamentamos informar que seu perfil não atende aos critérios atuais da plataforma.
            </p>
            
            <div className="w-full bg-white border border-red-100 rounded-3xl p-6 text-left mb-8 rovya-shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">Motivo</h3>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{pilotRegistration.rejectionReason || 'Perfil não compatível com as diretrizes de segurança Rovya.'}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
                <MessageSquare size={14} />
                Recurso
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
                <HelpCircle size={14} />
                Suporte
              </button>
            </div>
          </div>
        );

      case 'city_unavailable':
        return (
          <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="h-20 w-20 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mb-6">
              <MapPin size={40} strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-black text-navy uppercase italic mb-2 tracking-tighter">Cidade em Espera</h1>
            <p className="text-slate-500 text-sm max-w-xs mb-8">
              Sua conta está aprovada, mas as operações em sua cidade estão temporariamente pausadas.
            </p>
            
            <div className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 text-left mb-8">
              <p className="text-xs text-slate-600 leading-relaxed text-center font-medium">
                Entraremos em contato assim que novas vagas forem liberadas em sua região.
              </p>
            </div>

            <Link 
              to="/"
              className="w-full py-4 border border-slate-200 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-50 transition-all"
            >
              <Home size={18} />
              Voltar ao Início
            </Link>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="h-20 w-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6">
              <Clock size={40} strokeWidth={1.5} className="animate-pulse" />
            </div>
            <h1 className="text-2xl font-black text-navy uppercase italic mb-2 tracking-tighter">Em Análise</h1>
            <p className="text-slate-500 text-sm max-w-xs mb-8">
              Estamos validando seus documentos. Isso geralmente leva até 24 horas úteis.
            </p>
            
            {/* Timeline */}
            <div className="w-full bg-white border border-slate-100 rounded-[32px] p-8 text-left mb-8 rovya-shadow-sm">
              <div className="space-y-8 relative">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100"></div>
                
                <TimelineItem 
                  status="completed" 
                  title="Cadastro Enviado" 
                  date="Hoje, às 14:20" 
                />
                <TimelineItem 
                  status="current" 
                  title="Triagem Administrativa" 
                  date="Em andamento..." 
                />
                <TimelineItem 
                  status="pending" 
                  title="Validação de Documentos" 
                />
                <TimelineItem 
                  status="pending" 
                  title="Decisão Final" 
                />
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Avisaremos você via notificação.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-navy">
      <header className="p-6 flex items-center justify-between">
        <RovyaBrand className="h-6" />
        <Link 
          to="/piloto/entrar"
          className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
        >
          <Home size={20} />
        </Link>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        {renderContent()}
      </main>

      <footer className="p-8 text-center">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Rovya Operations • 2026</p>
      </footer>
    </div>
  );
}

function TimelineItem({ status, title, date }: { status: 'completed' | 'current' | 'pending', title: string, date?: string }) {
  const getIcon = () => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={12} className="text-white" />;
      case 'current': return <div className="h-2 w-2 bg-amber-500 rounded-full animate-ping"></div>;
      default: return null;
    }
  };

  const getCircleClass = () => {
    switch (status) {
      case 'completed': return 'bg-emerald-500 border-emerald-500';
      case 'current': return 'bg-white border-amber-500';
      default: return 'bg-white border-slate-200';
    }
  };

  return (
    <div className="flex gap-6 items-start relative z-10">
      <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${getCircleClass()}`}>
        {getIcon()}
      </div>
      <div>
        <p className={`text-xs font-black uppercase tracking-widest ${status === 'pending' ? 'text-slate-300' : 'text-navy'}`}>
          {title}
        </p>
        {date && <p className="text-[10px] text-slate-400 mt-1 font-bold">{date}</p>}
      </div>
    </div>
  );
}