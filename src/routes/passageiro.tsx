import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { RovyaBrand } from "@/components/RovyaBrand";
import { User, Shield, Clock, Home, MessageCircle, Bell } from "lucide-react";

export const Route = createFileRoute("/passageiro")({
  component: PassengerLayout,
});

function PassengerLayout() {
  const ICON_SIZE = 22;
  const STROKE = 1.8;
  const location = useLocation();

  // Rotas principais que devem exibir o cabeçalho e a barra inferior
  const mainRoutes = [
    "/passageiro/inicio",
    "/passageiro/corridas",
    "/passageiro/mensagens",
    "/passageiro/seguranca",
    "/passageiro/perfil",
  ];

  const isMainRoute = mainRoutes.includes(location.pathname);

  if (!isMainRoute) {
    return <Outlet />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-porcelain font-sans text-navy">
      {/* Header Passageiro Único */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto">
          <div className="flex items-center gap-4">
            <RovyaBrand subBrand="Passageiro" className="scale-90 origin-left" />
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/passageiro/notificacoes"
              className="p-2 relative text-slate-400 hover:text-navy transition-colors"
            >
              <Bell size={20} strokeWidth={STROKE} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rovya-red rounded-full border-2 border-white"></span>
            </Link>
            <Link to="/passageiro/perfil">
              <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 hover:bg-slate-200 transition-colors">
                <User size={20} strokeWidth={STROKE} className="text-slate-400" />
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto p-4 md:p-6 pb-28">
        <Outlet />
      </main>

      {/* Bottom Navigation Passageiro Único */}
      <nav className="fixed bottom-0 left-0 z-50 w-full pb-safe bg-white border-t border-slate-100 px-4 md:px-0 rovya-shadow-lg">
        <div className="container h-20 mx-auto flex items-center justify-around max-w-lg">
          <NavItem
            to="/passageiro/inicio"
            icon={<Home size={ICON_SIZE} strokeWidth={STROKE} />}
            label="Início"
            active={location.pathname === "/passageiro/inicio"}
          />
          <NavItem
            to="/passageiro/corridas"
            icon={<Clock size={ICON_SIZE} strokeWidth={STROKE} />}
            label="Corridas"
            active={location.pathname === "/passageiro/corridas"}
          />
          <NavItem
            to="/passageiro/mensagens"
            icon={<MessageCircle size={ICON_SIZE} strokeWidth={STROKE} />}
            label="Mensagens"
            active={location.pathname === "/passageiro/mensagens"}
          />
          <NavItem
            to="/passageiro/seguranca"
            icon={<Shield size={ICON_SIZE} strokeWidth={STROKE} />}
            label="Segurança"
            active={location.pathname === "/passageiro/seguranca"}
          />
          <NavItem
            to="/passageiro/perfil"
            icon={<User size={ICON_SIZE} strokeWidth={STROKE} />}
            label="Perfil"
            active={location.pathname === "/passageiro/perfil"}
          />
        </div>
      </nav>
    </div>
  );
}

function NavItem({
  to,
  icon,
  label,
  active = false,
  badge,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
}) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? "text-rovya-orange" : "text-slate-300 hover:text-slate-500"}`}
    >
      <div
        className={`p-2 rounded-2xl transition-all duration-300 relative ${active ? "bg-rovya-orange/10" : "bg-transparent"}`}
      >
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
