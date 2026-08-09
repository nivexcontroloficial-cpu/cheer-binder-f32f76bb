import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { RovyaBrand } from "@/components/RovyaBrand";
import { LayoutDashboard, Users, Map, Settings, ChevronLeft, Bell, Search, PanelLeftClose, PanelLeft } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const STROKE = 1.8;
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-porcelain font-sans text-navy">
      {/* Sidebar Admin (Desktop) */}
      <aside 
        className={`hidden lg:flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ${collapsed ? 'w-24' : 'w-72'}`}
      >
        <div className="h-20 flex items-center px-6 border-b border-slate-100 justify-between">
          {!collapsed && <RovyaBrand subBrand="Control" />}
          {collapsed && <div className="mx-auto"><RovyaBrand subBrand="Control" className="scale-75" /></div>}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
          >
            {collapsed ? <PanelLeft size={20} strokeWidth={STROKE} /> : <PanelLeftClose size={20} strokeWidth={STROKE} />}
          </button>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          <SidebarItem 
            to="/admin"
            icon={<LayoutDashboard size={20} strokeWidth={STROKE} />} 
            label="Dashboard" 
            active={location.pathname === "/admin"}
            collapsed={collapsed}
          />
          <SidebarItem 
            to="/admin"
            icon={<Users size={20} strokeWidth={STROKE} />} 
            label="Usuários" 
            active={location.pathname.includes("/usuarios")}
            collapsed={collapsed}
          />
          <SidebarItem 
            to="/admin"
            icon={<Map size={20} strokeWidth={STROKE} />} 
            label="Cidades" 
            active={location.pathname.includes("/cidades")}
            collapsed={collapsed}
          />
          <SidebarItem 
            to="/admin"
            icon={<Settings size={20} strokeWidth={STROKE} />} 
            label="Configurações" 
            active={location.pathname.includes("/configuracoes")}
            collapsed={collapsed}
          />
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className={`flex items-center gap-3 p-3 bg-slate-50 rounded-[20px] border border-slate-100 ${collapsed ? 'justify-center' : ''}`}>
            <div className="h-10 w-10 min-w-[40px] rounded-xl bg-rovya-blue/10 flex items-center justify-center text-rovya-blue font-black text-sm">
              RA
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-tight truncate">Rafael</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Admin Geral</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-6">
            <Link to="/" className="lg:hidden p-2 hover:bg-slate-50 rounded-xl transition-colors">
              <ChevronLeft size={20} strokeWidth={STROKE} />
            </Link>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} strokeWidth={STROKE} />
              <input 
                type="text" 
                placeholder="BUSCAR NO SISTEMA..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold tracking-widest focus:outline-none focus:border-rovya-blue w-64"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 relative">
              <Bell size={20} strokeWidth={STROKE} />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-rovya-red rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-10 overflow-auto bg-porcelain">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ 
  to, 
  icon, 
  label, 
  active = false, 
  collapsed = false 
}: { 
  to: string; 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
  collapsed?: boolean;
}) {
  return (
    <Link 
      to={to} 
      title={collapsed ? label : undefined}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] transition-all duration-300 ${collapsed ? 'justify-center px-0' : ''} ${active ? 'bg-rovya-blue/10 text-rovya-blue shadow-sm shadow-rovya-blue/5' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
    >
      <div className="min-w-[20px]">{icon}</div>
      {!collapsed && <span className="text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap">{label}</span>}
    </Link>
  );
}
