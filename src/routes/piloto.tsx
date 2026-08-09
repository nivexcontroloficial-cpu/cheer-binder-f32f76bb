import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { RovyaBrand } from "@/components/RovyaBrand";
import { User, ChevronLeft, Power, Bike, Navigation, DollarSign, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/piloto")({
  component: PilotLayout,
});

function PilotLayout() {
  const ICON_SIZE = 22;
  const STROKE = 1.8;
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-navy text-porcelain font-sans selection:bg-rovya-orange/30">
      {/* Header Piloto */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-navy/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/30">
              <ChevronLeft size={20} strokeWidth={STROKE} />
            </Link>
            <RovyaBrand variant="white" subBrand="Piloto" className="scale-90 origin-left" />
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-black tracking-tight uppercase text-porcelain">Carlos Henrique</p>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-rovya-green animate-pulse"></span>
                <p className="text-[9px] text-rovya-green uppercase font-black tracking-[0.2em]">Online</p>
              </div>
            </div>
            <button className="h-11 w-11 rounded-2xl bg-rovya-green/10 border border-rovya-green/20 flex items-center justify-center text-rovya-green hover:bg-rovya-green hover:text-white transition-all duration-300 group">
              <Power size={20} strokeWidth={2.5} className="group-active:scale-90 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto p-4 md:p-6 pb-28">
        <Outlet />
      </main>

      {/* Bottom Navigation Piloto */}
      <nav className="fixed bottom-0 left-0 z-50 w-full pb-safe bg-graphite border-t border-white/5 px-4 md:px-0 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.3)]">
        <div className="container h-20 mx-auto flex items-center justify-around max-w-lg">
          <NavItem 
            to="/piloto/operacao" 
            icon={<Navigation size={ICON_SIZE} strokeWidth={STROKE} />} 
            label="Operação" 
            active={location.pathname === "/piloto/operacao"} 
          />
          <NavItem 
            to="/piloto" 
            icon={<Bike size={ICON_SIZE} strokeWidth={STROKE} />} 
            label="Corridas" 
            active={location.pathname.includes("/corridas")} 
          />
          <NavItem 
            to="/piloto" 
            icon={<DollarSign size={ICON_SIZE} strokeWidth={STROKE} />} 
            label="Ganhos" 
            active={location.pathname.includes("/ganhos")} 
          />
          <NavItem 
            to="/piloto" 
            icon={<MessageSquare size={ICON_SIZE} strokeWidth={STROKE} />} 
            label="Mensagens" 
            active={location.pathname.includes("/mensagens")} 
            badge={1}
          />
          <NavItem 
            to="/piloto" 
            icon={<User size={ICON_SIZE} strokeWidth={STROKE} />} 
            label="Perfil" 
            active={location.pathname.includes("/perfil")} 
          />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label, active = false, badge }: { to: string; icon: React.ReactNode; label: string; active?: boolean; badge?: number }) {
  return (
    <Link to={to} className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-rovya-orange' : 'text-white/20 hover:text-white/50'}`}>
      <div className={`p-2 rounded-2xl transition-all duration-300 relative ${active ? 'bg-rovya-orange/15 shadow-lg shadow-black/20' : 'bg-transparent'}`}>
        {icon}
        {badge && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rovya-orange text-[8px] font-black text-white ring-2 ring-graphite">
            {badge}
          </span>
        )}
      </div>
      <span className={`text-[8px] font-black uppercase tracking-[0.1em]`}>{label}</span>
    </Link>
  );
}
