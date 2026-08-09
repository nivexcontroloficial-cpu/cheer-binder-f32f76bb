import { createFileRoute, Link } from "@tanstack/react-router";
import { User, ShieldCheck, Settings, PlayCircle, Bike } from "lucide-react";

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
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans text-[#111827]">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-5xl mx-auto w-full">
        <div className="mb-12 flex flex-col items-center">
          <div className="h-16 w-16 bg-[#F97316] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#F97316]/20">
            <Bike className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase italic">
            Rovya <span className="text-[#F97316]">Demo</span>
          </h1>
          <p className="text-slate-500 max-w-md mx-auto">
            Selecione uma das experiências abaixo para explorar o protótipo funcional da plataforma.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <DemoCard 
            to="/passageiro"
            title="Passageiro"
            description="Interface Rafael"
            icon={<User className="h-6 w-6" />}
            color="border-blue-200 hover:border-[#2F80ED] text-[#2F80ED]"
            bg="bg-blue-50"
          />
          
          <DemoCard 
            to="/piloto"
            title="Piloto"
            description="Interface Carlos H."
            icon={<Bike className="h-6 w-6" />}
            color="border-orange-200 hover:border-[#F97316] text-[#F97316]"
            bg="bg-orange-50"
          />

          <DemoCard 
            to="/admin"
            title="Admin"
            description="Rovya Control"
            icon={<ShieldCheck className="h-6 w-6" />}
            color="border-slate-200 hover:border-slate-900 text-slate-900"
            bg="bg-slate-50"
          />

          <DemoCard 
            to="/simulador"
            title="Simulador"
            description="Backend Mock"
            icon={<PlayCircle className="h-6 w-6" />}
            color="border-emerald-200 hover:border-emerald-600 text-emerald-600"
            bg="bg-emerald-50"
          />
        </div>

        <div className="mt-16 p-4 bg-amber-50 border border-amber-100 rounded-xl max-w-md">
          <p className="text-xs text-amber-800 font-medium leading-relaxed">
            <strong>MODO DEMONSTRAÇÃO:</strong> Não há conexão com banco de dados ou GPS real. 
            Todos os dados são simulados localmente.
          </p>
        </div>
      </main>

      <footer className="p-8 text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
        Rovya Project v1.0 • 2026
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
      className={`group p-6 bg-white border rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col items-center text-center ${color}`}
    >
      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${bg}`}>
        {icon}
      </div>
      <h2 className="text-lg font-bold mb-1 text-slate-900">{title}</h2>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-tight">{description}</p>
    </Link>
  );
}
