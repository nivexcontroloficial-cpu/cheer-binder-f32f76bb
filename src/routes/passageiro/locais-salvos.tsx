import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  MapPin, 
  Home, 
  Briefcase, 
  Heart, 
  Plus, 
  Trash2, 
  ChevronLeft,
  Navigation,
  MoreVertical
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface SavedPlace {
  id: string;
  label: string;
  address: string;
  type: 'home' | 'work' | 'other';
}

const INITIAL_PLACES: SavedPlace[] = [
  { id: '1', label: 'Casa', address: 'Rua das Flores, 123, Jacarezinho - PR', type: 'home' },
  { id: '2', label: 'Trabalho', address: 'Av. Brasil, 1500, Jacarezinho - PR', type: 'work' },
  { id: '3', label: 'Academia', address: 'Rua Principal, 50, Jacarezinho - PR', type: 'other' },
];

export const Route = createFileRoute("/passageiro/locais-salvos")({
  component: SavedPlacesPage,
});

function SavedPlacesPage() {
  const [places, setPlaces] = useState<SavedPlace[]>(INITIAL_PLACES);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      setPlaces(prev => prev.filter(p => p.id !== deleteId));
      setDeleteId(null);
      toast.success("Local removido com sucesso");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/passageiro/perfil" className="h-10 w-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-navy transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-black tracking-tight text-navy uppercase">Locais Salvos</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Seus destinos favoritos</p>
        </div>
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => toast.info("Simulando formulário de novo local...")}
          className="w-full p-5 bg-white border border-dashed border-slate-200 rounded-[32px] flex items-center justify-center gap-3 text-slate-400 hover:border-navy/20 hover:text-navy transition-all group"
        >
          <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-colors">
            <Plus size={18} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">Adicionar Novo Local</span>
        </button>

        <div className="space-y-3">
          {places.map((place) => (
            <div 
              key={place.id}
              className="p-5 bg-white border border-slate-100 rounded-[32px] flex items-center justify-between group"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center ${
                  place.type === 'home' ? 'bg-blue-50 text-blue-500' : 
                  place.type === 'work' ? 'bg-amber-50 text-amber-500' : 'bg-rose-50 text-rose-500'
                }`}>
                  {place.type === 'home' ? <Home size={20} /> : 
                   place.type === 'work' ? <Briefcase size={20} /> : <Heart size={20} />}
                </div>
                <div className="min-w-0 pr-4">
                  <h3 className="text-sm font-black text-navy leading-tight mb-1">{place.label}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight truncate">
                    {place.address}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => toast.info("Simulando início de corrida...")}
                  className="p-2 text-slate-300 hover:text-navy"
                >
                  <Navigation size={18} />
                </button>
                <button 
                  onClick={() => setDeleteId(place.id)}
                  className="p-2 text-slate-300 hover:text-rose-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {places.length === 0 && (
            <div className="py-20 text-center bg-white border border-dashed border-slate-200 rounded-[32px]">
              <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <MapPin size={32} />
              </div>
              <p className="text-sm font-bold text-navy uppercase tracking-tight">Nenhum local salvo</p>
              <p className="text-xs text-slate-400 mt-1 px-10">Salve seus endereços frequentes para pedir mais rápido.</p>
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-[32px] border-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black text-navy uppercase italic">Remover Local?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs font-bold text-slate-500 uppercase tracking-tight">
              Tem certeza que deseja remover este endereço dos seus locais salvos?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="rounded-2xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600"
            >
              Sim, Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
