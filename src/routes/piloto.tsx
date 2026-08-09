import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { User, ChevronLeft, Power } from "lucide-react";

export const Route = createFileRoute("/piloto")({
  component: PilotLayout,
});

function PilotLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#111827] text-white">
      {/* Header Piloto */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#111827]/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <span className="text-xl font-bold">Rovya Piloto</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-medium">Carlos Henrique</p>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <p className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest">Online</p>
              </div>
            </div>
            <button className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Power className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto p-4 md:p-6 pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation Piloto */}
      <nav className="fixed bottom-0 left-0 z-50 w-full h-20 bg-[#1F2937] border-t border-slate-800 px-4">
        <div className="container h-full mx-auto flex items-center justify-around max-w-lg">
          <NavItem label="Operação" active />
          <NavItem label="Corridas" />
          <NavItem label="Ganhos" />
          <NavItem label="Mensagens" />
          <NavItem label="Perfil" />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-[#F97316]' : 'text-slate-500 hover:text-slate-300'}`}>
      <div className={`h-6 w-6 rounded-md ${active ? 'bg-[#F97316]/20' : 'bg-transparent'}`}></div>
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </button>
  );
}
