import { createFileRoute, Link } from "@tanstack/react-router";
import { RovyaBrand } from "@/components/RovyaBrand";
import { User, ShieldCheck, PlayCircle, Bike, Palette, RotateCcw } from "lucide-react";
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-12">
          <DemoCard 
            to="/passageiro"
            title="Passageiro"
            description="Interface Rafael"
            icon={<User className="h-6 w-6" strokeWidth={1.8} />}
            color="border-blue-200 hover:border-[#2F80ED] text-[#2F80ED]"
            bg="bg-blue-50"
          />
          
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
            title="Admin"
            description="Rovya Control"
            icon={<ShieldCheck className="h-6 w-6" strokeWidth={1.8} />}
            color="border-slate-200 hover:border-slate-900 text-slate-900"
            bg="bg-slate-50"
          />
 
          <DemoCard 
            to="/simulador"
            title="Simulador"
            description="Backend Mock"
            icon={<PlayCircle className="h-6 w-6" strokeWidth={1.8} />}
            color="border-emerald-200 hover:border-emerald-600 text-emerald-600"
            bg="bg-emerald-50"
          />
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
