import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { RovyaBrand } from "@/components/RovyaBrand";
import { PlayCircle, ChevronLeft, Terminal } from "lucide-react";

export const Route = createFileRoute("/simulador")({
  component: SimulatorLayout,
});

function SimulatorLayout() {
  const STROKE = 1.8;

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A] text-slate-100 font-mono">
      <header className="h-20 border-b border-white/5 bg-[#0F172A]/50 backdrop-blur-md flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-500">
            <ChevronLeft size={20} strokeWidth={STROKE} />
          </Link>
          <div className="flex items-center gap-3">
            <RovyaBrand variant="white" subBrand="Simulator" className="scale-90 origin-left" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-[10px] font-black tracking-widest uppercase">
            <Terminal size={14} /> Dev Mode Active
          </div>
        </div>
      </header>
      
      <main className="flex-1 p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}
