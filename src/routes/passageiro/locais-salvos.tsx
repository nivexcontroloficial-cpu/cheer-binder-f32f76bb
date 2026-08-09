import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { 
  ArrowLeft, 
  Home, 
  Briefcase, 
  Heart, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  MapPin,
  Check
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/passageiro/locais-salvos")({
  component: SavedPlacesScreen,
});

interface Place {
  id: string;
  type: 'home' | 'work' | 'other';
  label: string;
  address: string;
}

function SavedPlacesScreen() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState<Place[]>([
    { id: '1', type: 'home', label: 'Casa', address: 'Rua São João, 345' },
    { id: '2', type: 'work', label: 'Trabalho', address: 'Av. Getúlio Vargas, 890' },
    { id: '3', type: 'other', label: 'Academia', address: 'Av. Brasil, 450' },
  ]);

  const handleDelete = (id: string) => {
    setPlaces(places.filter(p => p.id !== id));
    toast.success("Local removido com sucesso");
  };

  return (
    <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy">
      <header className="bg-white px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate({ to: "/passageiro/inicio" })} className="p-2 -ml-2 text-slate-400 hover:text-navy">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[11px] font-black uppercase tracking-widest text-navy">Locais Salvos</h1>
        </div>
        <button className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-rovya-orange hover:bg-white hover:border-rovya-orange transition-all">
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </header>

      <main className="flex-1 p-6 space-y-6">
        <div className="space-y-4">
          {places.map((place) => (
            <div 
              key={place.id}
              className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-rovya-orange transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-rovya-orange transition-colors">
                  {place.type === 'home' && <Home size={22} />}
                  {place.type === 'work' && <Briefcase size={22} />}
                  {place.type === 'other' && <Heart size={22} />}
                </div>
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-navy">{place.label}</h3>
                  <p className="text-[10px] text-slate-400 font-medium">{place.address}</p>
                </div>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="p-2 text-slate-200 hover:text-rovya-red transition-colors">
                    <Trash2 size={18} />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[32px] border-none shadow-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-[12px] font-black uppercase tracking-widest text-navy">Remover Local?</AlertDialogTitle>
                    <AlertDialogDescription className="text-xs text-slate-500 font-medium">
                      Tem certeza que deseja remover "{place.label}" dos seus favoritos?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                    <AlertDialogCancel className="rounded-2xl border-slate-100 text-[10px] font-black uppercase tracking-widest">Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handleDelete(place.id)}
                      className="bg-rovya-red hover:bg-red-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border-none"
                    >
                      Remover
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>

        <div className="p-6 bg-blue-50 border border-blue-100 rounded-[32px] flex gap-4">
          <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-rovya-blue shrink-0 shadow-sm">
            <MapPin size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-900">Agilidade no dia a dia</h4>
            <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
              Salvar seus destinos frequentes permite solicitar corridas com apenas dois toques.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
