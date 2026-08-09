import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { RovyaBrand } from "@/components/RovyaBrand";
import { User, ChevronLeft, MapPin, MessageSquare, Shield, Clock, Home } from "lucide-react";

export const Route = createFileRoute("/passageiro")({
  component: PassengerLayout,
});

function PassengerLayout() {
  const ICON_SIZE = 22;
  const STROKE = 1.8;

  return (
    <div className="flex flex-col min-h-screen bg-porcelain font-sans text-navy">
      {/* Header Passageiro */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
              <ChevronLeft size={20} strokeWidth={STROKE} />
            </Link>
            <RovyaBrand subBrand="Passageiro" className="scale-90 origin-left" />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black tracking-tight uppercase">Rafael</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Nível 4</p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
              <User size={20} strokeWidth={STROKE} className="text-slate-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto p-4 md:p-6 pb-28">
        <Outlet />
      </main>

      {/* Bottom Navigation Passageiro */}
      <nav className="fixed bottom-0 left-0 z-50 w-full h-24 bg-white border-t border-slate-100 px-4 md:px-0 rovya-shadow-lg">
        <div className="container h-full mx-auto flex items-center justify-around max-w-lg">
          <NavItem icon={<Home size={ICON_SIZE} strokeWidth={STROKE} />} label="Início" active />
          <NavItem icon={<MapPin size={ICON_SIZE} strokeWidth={STROKE} />} label="Corridas" />
          <NavItem icon={<MessageSquare size={ICON_SIZE} strokeWidth={STROKE} />} label="Mensagens" />
          <NavItem icon={<Shield size={ICON_SIZE} strokeWidth={STROKE} />} label="Segurança" />
          <NavItem icon={<User size={ICON_SIZE} strokeWidth={STROKE} />} label="Perfil" />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active ? 'text-rovya-orange' : 'text-slate-300 hover:text-slate-500'}`}>
      <div className={`p-2.5 rounded-2xl transition-all duration-300 ${active ? 'bg-rovya-orange/10 scale-110' : 'bg-transparent'}`}>
        {icon}
      </div>
      <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${active ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
    </button>
  );
}
