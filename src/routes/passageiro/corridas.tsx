import React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { 
  History, 
  MapPin, 
  ChevronRight, 
  Clock, 
  Search,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useDemo } from "@/state/DemoContext";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/passageiro/corridas")({
  component: RidesHistoryPage,
});

function RidesHistoryPage() {
  const { rides } = useDemo();
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');

  const filteredRides = useMemo(() => {
    return rides
      .filter(ride => {
        if (filter === 'completed') return ride.status === 'completed';
        if (filter === 'cancelled') return ride.status === 'cancelled';
        return true;
      })
      .filter(ride => {
        const query = search.toLowerCase();
        const originAddr = ride.origin?.address?.toLowerCase() || '';
        const destAddr = ride.destination?.address?.toLowerCase() || '';
        const rideId = ride.id?.toLowerCase() || '';
        
        return originAddr.includes(query) || 
               destAddr.includes(query) || 
               rideId.includes(query);
      })
      .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  }, [rides, filter, search]);

  const getRegion = (address?: string) => {
    if (!address) return '---';
    // Simulando ocultação de endereço exato para privacidade
    const parts = address.split(',');
    if (parts.length > 1) {
      return parts[0].trim(); // Pega apenas a primeira parte (ex: Bairro ou Rua principal)
    }
    return address;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-2xl bg-navy/5 flex items-center justify-center text-navy">
          <History size={20} strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-navy uppercase">Histórico</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Suas viagens recentes</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input 
            placeholder="Buscar por destino ou ID..." 
            className="pl-10 h-12 bg-white border-slate-100 rounded-2xl text-xs font-medium"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <FilterButton 
            active={filter === 'all'} 
            onClick={() => setFilter('all')}
            label="Todas" 
          />
          <FilterButton 
            active={filter === 'completed'} 
            onClick={() => setFilter('completed')}
            label="Concluídas" 
          />
          <FilterButton 
            active={filter === 'cancelled'} 
            onClick={() => setFilter('cancelled')}
            label="Canceladas" 
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredRides.length > 0 ? (
          filteredRides.map((ride) => (
            <Link
              key={ride.id}
              to="/passageiro/corrida/$rideId/concluida"
              params={{ rideId: ride.id }}
              className="block p-4 bg-white border border-slate-100 rounded-[24px] hover:border-navy/10 transition-all active:scale-[0.98]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${
                    ride.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                    ride.status === 'cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {ride.status === 'completed' ? <CheckCircle2 size={16} /> : 
                     ride.status === 'cancelled' ? <XCircle size={16} /> : <Clock size={16} />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-navy">
                      {ride.id}
                    </p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                      {ride.requestedAt ? format(new Date(ride.requestedAt), "dd 'de' MMM, HH:mm", { locale: ptBR }) : '-'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-navy tracking-tight">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ride.fare)}
                  </p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                    {ride.status === 'completed' ? 'Finalizada' : ride.status === 'cancelled' ? 'Cancelada' : 'Em curso'}
                  </p>
                </div>
              </div>

              <div className="relative pl-4 border-l-2 border-slate-50 space-y-3 ml-2">
                <div className="relative">
                  <div className="absolute -left-[1.35rem] top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-slate-300 ring-4 ring-white" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Origem</p>
                  <p className="text-xs font-semibold text-navy truncate">{getRegion(ride.origin?.address)}</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[1.35rem] top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-rovya-orange ring-4 ring-white" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Destino</p>
                  <p className="text-xs font-semibold text-navy truncate">{getRegion(ride.destination?.address)}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-dashed border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    <Clock size={10} />
                    {ride.duration} min
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    <MapPin size={10} />
                    {ride.distance.toFixed(1)} km
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            </Link>
          ))
        ) : (
          <div className="py-20 text-center bg-white border border-dashed border-slate-200 rounded-[32px]">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <History size={32} />
            </div>
            <p className="text-sm font-bold text-navy uppercase tracking-tight">Nenhuma corrida encontrada</p>
            <p className="text-xs text-slate-400 mt-1 px-10">Tente ajustar seus filtros ou busca.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
        active 
          ? 'bg-navy text-white shadow-md' 
          : 'bg-white border border-slate-100 text-slate-400 hover:border-slate-200'
      }`}
    >
      {label}
    </button>
  );
}
