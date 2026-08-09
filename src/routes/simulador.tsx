import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { PlayCircle, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/simulador")({
  component: SimulatorLayout,
});

function SimulatorLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100">
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2 font-mono text-emerald-500">
            <PlayCircle className="h-5 w-5" />
            <span className="font-bold">SIMULADOR ROVYA</span>
          </div>
        </div>
        <div className="text-xs font-mono px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded">
          AMBIENTE DE TESTE
        </div>
      </header>
      
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
