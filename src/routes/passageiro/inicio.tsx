import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { 
  Search, 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  Bell, 
  Clock, 
  Star, 
  CreditCard, 
  ChevronRight,
  MapPinned,
  TicketPercent,
  Plus
} from "lucide-react";
import { useState } from "react";
import { RovyaBrand } from "@/components/RovyaBrand";

export const Route = createFileRoute("/passageiro/inicio")({
  component: PassengerHomeScreen,
});

function PassengerHomeScreen() {
  const [destination, setDestination] = useState("");
  const navigate = useNavigate();

  const handleCalculate = () => {
    if (destination.trim()) {
      // Navegaria para a próxima etapa (não definida neste prompt)
      console.log("Calculando corrida para:", destination);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans text-navy">
      {/* Header Fixo */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <MapPinned size={14} className="text-rovya-orange" />
            <span className="text-[10px] font-black uppercase tracking-widest text-navy">Jacarezinho • PR</span>
          </div>
          <h1 className="text-lg font-black tracking-tight mt-0.5">Olá, Rafael</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Link to="/passageiro" className="relative p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-400 hover:text-navy transition-colors">
            <Bell size={20} strokeWidth={1.8} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rovya-red rounded-full border-2 border-white"></span>
          </Link>
          <div className="h-10 w-10 rounded-2xl bg-navy flex items-center justify-center border border-navy overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100" 
              alt="Avatar" 
              className="w-full h-full object-cover opacity-90"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-8 pb-32">
        {/* Selo de Segurança */}
        <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-3xl animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center text-rovya-green shadow-sm">
              <ShieldCheck size={22} strokeWidth={1.8} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900 leading-none mb-1">Conta Verificada</span>
              <span className="text-[9px] text-emerald-700 font-medium italic">Proteção Rovya Ativa</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-emerald-300" />
        </div>

        {/* Card Principal: Solicitação */}
        <section className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 flex justify-center text-rovya-orange">
                <div className="w-1.5 h-1.5 rounded-full bg-rovya-orange shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
              </div>
              <div className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 flex items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-navy">Minha localização atual</span>
              </div>
              <div className="absolute left-3.5 top-12 w-0.5 h-6 border-l border-dashed border-slate-200"></div>
            </div>

            <div className="relative group">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 flex justify-center text-slate-300 group-focus-within:text-rovya-orange transition-colors">
                <Search size={18} strokeWidth={2.5} />
              </div>
              <input 
                type="text" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="PARA ONDE VAMOS?" 
                className="w-full h-16 bg-white border-2 border-slate-100 rounded-2xl pl-10 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-navy focus:outline-none focus:border-rovya-orange transition-all placeholder:text-slate-300 shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-navy hover:bg-white hover:border-rovya-orange transition-all">
              <CreditCard size={14} strokeWidth={2} className="text-slate-400" />
              <span className="text-[9px] font-black uppercase tracking-widest">Dinheiro</span>
            </button>
            
            <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-navy transition-colors">
              <Plus size={14} strokeWidth={2.5} className="text-rovya-orange" />
              Agendar
            </button>
          </div>

          {destination.trim() && (
            <button 
              onClick={handleCalculate}
              className="w-full h-14 bg-navy text-white rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-navy/90 transition-all animate-in zoom-in-95 rovya-shadow"
            >
              Calcular Corrida
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          )}
        </section>

        {/* Favoritos */}
        <section className="grid grid-cols-2 gap-4">
          <FavoriteButton icon={<Navigation size={18} />} label="Trabalho" sub="Av. Getúlio Vargas, 890" />
          <FavoriteButton icon={<Clock size={18} />} label="Casa" sub="Rua São João, 345" />
        </section>

        {/* Destinos Recentes */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Destinos Recentes</h3>
          <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
            <RecentItem icon={<MapPin size={16} />} title="Shopping Jacarezinho" address="Centro, Jacarezinho - PR" />
            <RecentItem icon={<MapPin size={16} />} title="Terminal Rodoviário" address="Rua das Flores, 123" />
            <RecentItem icon={<Star size={16} />} title="Academia Fit" address="Av. Brasil, 450" last />
          </div>
        </section>

        {/* Banner Promocional */}
        <section className="p-6 bg-navy rounded-[32px] text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rovya-orange/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-rovya-orange/30 transition-colors"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-rovya-orange rounded-lg text-[8px] font-black uppercase tracking-widest">
                <TicketPercent size={10} />
                Promo Ativa
              </div>
              <h4 className="text-sm font-black tracking-tight leading-tight uppercase italic">
                Indique amigos e ganhe<br/>R$ 10,00 de desconto
              </h4>
            </div>
            <button className="h-10 w-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </section>
      </main>

      {/* Navegação Inferior (Início Ativo) */}
      <nav className="fixed bottom-0 left-0 z-50 w-full pb-safe bg-white border-t border-slate-100 px-6 rovya-shadow-lg">
        <div className="container h-20 mx-auto flex items-center justify-between max-w-lg">
          <NavItem to="/passageiro/inicio" icon={<Navigation size={22} />} label="Início" active />
          <NavItem to="/passageiro" icon={<Clock size={22} />} label="Corridas" />
          <NavItem to="/passageiro" icon={<Plus size={22} className="rotate-45" />} label="Mensagens" badge={3} />
          <NavItem to="/passageiro" icon={<ShieldCheck size={22} />} label="Segurança" />
          <NavItem to="/passageiro" icon={<Star size={22} />} label="Perfil" />
        </div>
      </nav>
    </div>
  );
}

function FavoriteButton({ icon, label, sub }: { icon: React.ReactNode, label: string, sub: string }) {
  return (
    <button className="p-5 bg-white rounded-[28px] border border-slate-100 text-left hover:border-rovya-orange transition-all shadow-sm group">
      <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-rovya-orange transition-colors mb-3">
        {icon}
      </div>
      <h4 className="text-[10px] font-black uppercase tracking-widest text-navy mb-0.5">{label}</h4>
      <p className="text-[8px] text-slate-400 font-medium truncate">{sub}</p>
    </button>
  );
}

function RecentItem({ icon, title, address, last }: { icon: React.ReactNode, title: string, address: string, last?: boolean }) {
  return (
    <button className={`w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors ${!last ? 'border-b border-slate-50' : ''}`}>
      <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-navy leading-none mb-1">{title}</h4>
        <p className="text-[9px] text-slate-400 font-medium">{address}</p>
      </div>
      <ChevronRight size={14} className="text-slate-200" />
    </button>
  );
}

function NavItem({ to, icon, label, active = false, badge }: { to: string; icon: React.ReactNode; label: string; active?: boolean; badge?: number }) {
  return (
    <Link to={to} className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-rovya-orange' : 'text-slate-300 hover:text-slate-500'}`}>
      <div className={`p-2 rounded-2xl transition-all duration-300 relative ${active ? 'bg-rovya-orange/10 scale-110' : 'bg-transparent'}`}>
        {icon}
        {badge && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rovya-red text-[8px] font-black text-white ring-2 ring-white">
            {badge}
          </span>
        )}
      </div>
      <span className={`text-[8px] font-black uppercase tracking-[0.15em] ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
    </Link>
  );
}
