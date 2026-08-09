import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { LayoutDashboard, Users, Map, Settings, ChevronLeft, Bell } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar Admin (Desktop) */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-white">
        <div className="h-16 flex items-center px-6 border-b">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-[#111827]">
            <span className="text-[#2F80ED]">Rovya</span> Control
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <SidebarItem icon={<LayoutDashboard className="h-5 w-5" />} label="Dashboard" active />
          <SidebarItem icon={<Users className="h-5 w-5" />} label="Usuários" />
          <SidebarItem icon={<Map className="h-5 w-5" />} label="Cidades" />
          <SidebarItem icon={<Settings className="h-5 w-5" />} label="Configurações" />
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded bg-[#2F80ED]/10 flex items-center justify-center text-[#2F80ED]">R</div>
            <div>
              <p className="text-sm font-bold">Rafael</p>
              <p className="text-[10px] text-slate-500">Admin Geral</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="md:hidden p-2 hover:bg-slate-100 rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-bold text-slate-900">Visão Geral</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
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
