import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { RovyaBrand } from "@/components/RovyaBrand";
import { User, ChevronLeft, MapPin, MessageSquare, Shield, Clock, Home } from "lucide-react";

export const Route = createFileRoute("/passageiro")({
  component: PassengerLayout,
});

function PassengerLayout() {
  const ICON_SIZE = 22;
  const STROKE = 1.8;
  const location = useLocation();

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
              <p className="text-sm font-black tracking-tight uppercase text-navy">Rafael</p>
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
      <nav className="fixed bottom-0 left-0 z-50 w-full pb-safe bg-white border-t border-slate-100 px-4 md:px-0 rovya-shadow-lg">
        <div className="container h-20 mx-auto flex items-center justify-around max-w-lg">
          <NavItem 
            to="/passageiro" 
            icon={<Home size={ICON_SIZE} strokeWidth={STROKE} />} 
            label="Início" 
            active={location.pathname === "/passageiro"} 
          />
          <NavItem 
            to="/passageiro" 
            icon={<Clock size={ICON_SIZE} strokeWidth={STROKE} />} 
            label="Corridas" 
            active={location.pathname.includes("/corridas")} 
          />
          <NavItem 
            to="/passageiro" 
            icon={<MessageSquare size={ICON_SIZE} strokeWidth={STROKE} />} 
            label="Mensagens" 
            active={location.pathname.includes("/mensagens")} 
            badge={3}
          />
          <NavItem 
            to="/passageiro" 
            icon={<Shield size={ICON_SIZE} strokeWidth={STROKE} />} 
            label="Segurança" 
            active={location.pathname.includes("/seguranca")} 
          />
          <NavItem 
            to="/passageiro" 
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
    <Link to={to} className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-rovya-orange' : 'text-slate-300 hover:text-slate-500'}`}>
      <div className={`p-2 rounded-2xl transition-all duration-300 relative ${active ? 'bg-rovya-orange/10' : 'bg-transparent'}`}>
        {icon}
        {badge && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rovya-red text-[8px] font-black text-white ring-2 ring-white">
            {badge}
          </span>
        )}
      </div>
      <span className={`text-[8px] font-black uppercase tracking-[0.1em]`}>{label}</span>
    </Link>
  );
}
