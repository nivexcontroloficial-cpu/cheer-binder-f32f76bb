import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { User, LogOut, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/passageiro")({
  component: PassengerLayout,
});

function PassengerLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Header Passageiro */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ChevronLeft className="h-5 w-5 text-slate-600" />
            </Link>
            <span className="text-xl font-bold text-[#111827]">Rovya Passageiro</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">Rafael</p>
              <p className="text-xs text-slate-500">Passageiro</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
              <User className="h-6 w-6 text-slate-500" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto p-4 md:p-6 pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation Passageiro */}
      <nav className="fixed bottom-0 left-0 z-50 w-full h-20 bg-white border-t border-slate-200 px-4 md:px-0">
        <div className="container h-full mx-auto flex items-center justify-around max-w-lg">
          <NavItem label="Início" active />
          <NavItem label="Corridas" />
          <NavItem label="Mensagens" />
          <NavItem label="Segurança" />
          <NavItem label="Perfil" />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-[#F97316]' : 'text-slate-400 hover:text-slate-600'}`}>
      <div className={`h-6 w-6 rounded-md ${active ? 'bg-[#F97316]/10' : 'bg-transparent'}`}></div>
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </button>
  );
}
