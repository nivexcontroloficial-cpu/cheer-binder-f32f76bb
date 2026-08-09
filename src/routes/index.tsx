import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { RovyaBrand } from "@/components/RovyaBrand";
import { User, ShieldCheck, PlayCircle, Bike, Palette, RotateCcw, ArrowRight, MessageSquare } from "lucide-react";
import { useDemo } from "@/state/DemoContext";

export const Route = createFileRoute("/")({
  head: () => ({
    title: "Rovya - Demonstração",
    meta: [
      {
        name: "description",
        content: "Seletor de experiência da plataforma Rovya.",
      },
    ],
  }),
  component: DemoSelector,
});

function DemoSelector() {
  const { resetData, isLoading } = useDemo();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans text-[#111827]">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-5xl mx-auto w-full">
        <div className="mb-12 flex flex-col items-center">
          <RovyaBrand className="mb-6" />
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase italic">
            SELETOR DE <span className="text-[#F97316]">DEMO</span>
          </h1>
          <p className="text-slate-500 max-w-md mx-auto">
            Selecione uma das experiências abaixo para explorar o protótipo funcional da plataforma.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
          <div className="flex flex-col gap-3">
            <DemoCard 
              to="/passageiro/inicio"
              title="Passageiro"
              description="Início (Sem Mapa)"
              icon={<User className="h-6 w-6" strokeWidth={1.8} />}
              color="border-blue-200 hover:border-[#2F80ED] text-[#2F80ED]"
              bg="bg-blue-50"
            />
            <Link 
              to="/passageiro/buscando"
              className="w-full py-2 bg-slate-100 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all active:scale-95"
            >
              Tela de Busca (Direto)
            </Link>
            <Link 
              to="/passageiro/corrida/$rideId/em-andamento"
              params={{ rideId: "ride-active-mock" }}
              className="w-full py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-100 transition-all active:scale-95"
            >
              <Navigation size={10} strokeWidth={2.5} />
              Corrida Em Andamento (Direto)
            </Link>
            <Link 
              to="/passageiro/chat/$rideId"
              params={{ rideId: "ride-active-mock" }}
              className="w-full py-2 bg-blue-50 text-blue-500 border border-blue-100 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-100 transition-all active:scale-95"
            >
              <MessageSquare size={10} strokeWidth={2.5} />
              Chat com Piloto (Direto)
            </Link>
            <button 
              onClick={() => navigate({ to: '/passageiro/boas-vindas' })}
              className="w-full py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 rovya-shadow"
            >
              Iniciar Fluxo Boas-Vindas
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>
          
          <DemoCard 
            to="/piloto"
            title="Piloto"
            description="Interface Carlos H."
            icon={<Bike className="h-6 w-6" strokeWidth={1.8} />}
            color="border-orange-200 hover:border-[#F97316] text-[#F97316]"
            bg="bg-orange-50"
          />
 
          <DemoCard 
            to="/admin"
            title="Rovya Control"
            description="Administração"
            icon={<ShieldCheck className="h-6 w-6" strokeWidth={1.8} />}
            color="border-slate-200 hover:border-slate-900 text-slate-900"
            bg="bg-slate-50"
          />
        </div>

        <div className="mb-12">
          <Link 
            to="/simulador"
            className="group inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-600 transition-all"
          >
            <PlayCircle size={14} strokeWidth={1.8} className="group-hover:scale-110 transition-transform" />
            Acessar Simulador de Eventos
          </Link>
        </div>
 
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/design-system"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-navy font-bold hover:bg-slate-50 transition-colors rovya-shadow"
          >
            <Palette size={18} strokeWidth={1.8} />
            Visual Identity
          </Link>
          <Link 
            to="/design-system/componentes"
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-2xl font-bold hover:bg-navy/90 transition-colors rovya-shadow"
          >
            <Palette size={18} strokeWidth={1.8} />
            Component Library
          </Link>
          <button 
            onClick={resetData}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 transition-colors rovya-shadow disabled:opacity-50"
          >
            <RotateCcw size={18} strokeWidth={1.8} className={isLoading ? "animate-spin" : ""} />
            Reset Demo Data
          </button>
        </div>
 
        <div className="mt-16 p-6 bg-amber-50 border border-amber-100 rounded-3xl max-w-md">
          <p className="text-[10px] text-amber-800 font-bold uppercase tracking-widest leading-relaxed">
            Camada de Dados Mock
          </p>
          <p className="mt-2 text-xs text-amber-900 leading-relaxed">
            Os dados mostrados são gerados localmente e podem ser resetados. Nenhuma persistência real em nuvem está ativa.
          </p>
          <p className="mt-4 text-[10px] text-amber-800 font-bold uppercase tracking-widest leading-relaxed">
            Invariantes de Segurança
          </p>
          <p className="mt-2 text-xs text-amber-900 leading-relaxed">
            Nenhum backend, banco, autenticação real, pagamento real, GPS real ou notificação real foi conectado nesta etapa.
          </p>
        </div>
      </main>
 
      <footer className="p-8 text-center text-[10px] text-slate-400 uppercase tracking-widest font-black">
        ROVYA PROJECT • 2026
      </footer>
    </div>
  );
}
 
function DemoCard({ to, title, description, icon, color, bg }: { 
  to: string; 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  color: string;
  bg: string;
}) {
  return (
    <Link
      to={to}
      className={`group p-8 bg-white border rounded-[32px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center text-center ${color}`}
    >
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 ${bg}`}>
        {icon}
      </div>
      <h2 className="text-xl font-black mb-1 text-navy tracking-tight">{title}</h2>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em]">{description}</p>
    </Link>
  );
}
