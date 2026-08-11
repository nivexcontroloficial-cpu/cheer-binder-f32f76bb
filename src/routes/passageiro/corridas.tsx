import React, { useState, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  History,
  MapPin,
  ChevronRight,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useDemo } from "@/state/DemoContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  rideQuoteSearchSchema,
  calculateRideFare,
  getQuoteParams,
} from "@/lib/passenger-demo-ride-quote";

export const Route = createFileRoute("/passageiro/corridas")({
  validateSearch: (search) => rideQuoteSearchSchema.parse(search),
  component: RidesHistoryPage,
});

function RidesHistoryPage() {
  const { rides } = useDemo();
  const searchParams = Route.useSearch();
  const [filter, setFilter] = useState<"all" | "completed" | "cancelled">("all");
  const [search, setSearch] = useState("");

  const { finalFare: demoFinalFare } = useMemo(
    () => calculateRideFare(searchParams.promoCode),
    [searchParams.promoCode]
  );

  const filteredRides = useMemo(() => {
    return rides
      .filter((ride) => {
        if (filter === "completed") return ride.status === "completed";
        if (filter === "cancelled") return ride.status === "cancelled";
        return true;
      })
      .filter((ride) => {
        const query = search.toLowerCase().trim();
        const originAddr = ride.origin?.address?.toLowerCase() || "";
        const destAddr = ride.destination?.address?.toLowerCase() || "";
        const rideId = ride.id?.toLowerCase() || "";

        return originAddr.includes(query) || destAddr.includes(query) || rideId.includes(query);
      })
      .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  }, [rides, filter, search]);

  const getRegion = (address?: string) => {
    if (!address) return "---";
    const parts = address.split(",");
    const firstPart = parts[0];
    if (parts.length > 1 && firstPart) {
      return firstPart.trim();
    }
    return address;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 p-6 bg-porcelain min-h-screen">
      <div className="mb-6 p-3 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-start gap-3">
        <AlertCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-[10px] font-medium text-blue-700 leading-tight">
          Demonstração local: este histórico utiliza a cotação da sua sessão atual para corridas demo.
        </p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-2xl bg-navy/5 flex items-center justify-center text-navy">
          <History size={20} strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-navy uppercase">Histórico</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Suas viagens</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input
            id="search-rides"
            type="search"
            placeholder="Buscar por destino ou ID..."
            className="pl-10 h-12 bg-white border-slate-100 rounded-2xl text-xs font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")} label="Todas" />
          <FilterButton active={filter === "completed"} onClick={() => setFilter("completed")} label="Concluídas" />
          <FilterButton active={filter === "cancelled"} onClick={() => setFilter("cancelled")} label="Canceladas" />
        </div>
      </div>

      <div className="space-y-3">
        {filteredRides.length > 0 ? (
          filteredRides.map((ride) => {
            const isCompleted = ride.status === "completed";
            const isCancelled = ride.status === "cancelled";
            const isDemoRide = ride.id === "RY-2026-00842";
            const displayFare = isDemoRide ? demoFinalFare : ride.fare;

            const CardContent = (
              <div className="p-4 bg-white border border-slate-100 rounded-[24px] hover:border-navy/10 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${
                      isCompleted ? "bg-emerald-50 text-emerald-600" : isCancelled ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"
                    }`}>
                      {isCompleted ? <CheckCircle2 size={16} /> : isCancelled ? <XCircle size={16} /> : <Clock size={16} />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-navy">{ride.id}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">
                        {format(new Date(ride.requestedAt), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-navy">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(displayFare)}
                    </p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{isCompleted ? "Finalizada" : isCancelled ? "Cancelada" : "Em curso"}</p>
                  </div>
                </div>

                <div className="relative pl-4 border-l-2 border-slate-50 space-y-3 ml-2">
                  <div className="relative">
                    <div className="absolute -left-[1.35rem] top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-slate-300 ring-4 ring-white" />
                    <p className="text-xs font-semibold text-navy truncate">{getRegion(ride.origin?.address)}</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[1.35rem] top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-rovya-orange ring-4 ring-white" />
                    <p className="text-xs font-semibold text-navy truncate">{getRegion(ride.destination?.address)}</p>
                  </div>
                </div>
              </div>
            );

            if (isCompleted) {
              return (
                <Link
                  key={ride.id}
                  to="/passageiro/corrida/$rideId/concluida"
                  params={{ rideId: ride.id }}
                  search={(prev: any) => getQuoteParams(prev)}
                  className="block"
                >
                  {CardContent}
                </Link>
              );
            }
            return <div key={ride.id}>{CardContent}</div>;
          })
        ) : (
          <div className="py-20 text-center bg-white border border-dashed border-slate-200 rounded-[32px]">
            <p className="text-sm font-bold text-navy uppercase">Nenhuma corrida encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap min-h-[44px] ${
        active ? "bg-navy text-white shadow-md" : "bg-white border border-slate-100 text-slate-400 hover:border-slate-200"
      }`}
    >
      {label}
    </button>
  );
}
