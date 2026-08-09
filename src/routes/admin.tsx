import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { RovyaBrand } from "@/components/RovyaBrand";
import { LayoutDashboard, Users, Map, Settings, ChevronLeft, Bell, Search } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const STROKE = 1.8;

  return (
    <div className="flex min-h-screen bg-porcelain font-sans text-navy">
      {/* Sidebar Admin (Desktop) */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-slate-200 bg-white">
        <div className="h-20 flex items-center px-8 border-b border-slate-100">
          <RovyaBrand subBrand="Control" />
        </div>
        <nav className="flex-1 p-6 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20} strokeWidth={STROKE} />} label="Dashboard" active />
          <SidebarItem icon={<Users size={20} strokeWidth={STROKE} />} label="Usuários" />
          <SidebarItem icon={<Map size={20} strokeWidth={STROKE} />} label="Cidades" />
          <SidebarItem icon={<Settings size={20} strokeWidth={STROKE} />} label="Configurações" />
        </nav>
        <div className="p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-[20px] border border-slate-100">
            <div className="h-10 w-10 rounded-xl bg-rovya-blue/10 flex items-center justify-center text-rovya-blue font-black text-sm">
              RA
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-tight truncate">Rafael</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Admin Geral</p>
            </div>
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

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${active ? 'bg-rovya-blue/10 text-rovya-blue shadow-sm shadow-rovya-blue/5' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
      {icon}
      {label}
    </button>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-[#2F80ED]/10 text-[#2F80ED]' : 'text-slate-600 hover:bg-slate-50'}`}>
      {icon}
      {label}
    </button>
  );
}
