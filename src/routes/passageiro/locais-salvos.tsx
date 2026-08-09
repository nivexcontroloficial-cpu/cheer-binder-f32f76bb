import React, { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Home,
  Briefcase,
  Heart,
  Plus,
  Trash2,
  ChevronLeft,
  AlertCircle,
  X,
} from "lucide-react";
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
  region: string;
  type: "home" | "work" | "other";
}

const INITIAL_PLACES: SavedPlace[] = [
  { id: "1", label: "Casa", region: "Jacarezinho, PR", type: "home" },
  { id: "2", label: "Trabalho", region: "Centro, Jacarezinho", type: "work" },
  { id: "3", label: "Academia", region: "Vila Setti, Jacarezinho", type: "other" },
];

export const Route = createFileRoute("/passageiro/locais-salvos")({
  component: SavedPlacesPage,
});

function SavedPlacesPage() {
  const [places, setPlaces] = useState<SavedPlace[]>(INITIAL_PLACES);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [newLabel, setNewLabel] = useState("");
  const [newRegion, setNewRegion] = useState("");
  const [newType, setNewType] = useState<"home" | "work" | "other">("other");

  const deletePlaceName = useMemo(() => {
    return places.find((p) => p.id === deleteId)?.label || "";
  }, [deleteId, places]);

  const handleCancel = () => {
    setNewLabel("");
    setNewRegion("");
    setNewType("other");
    setIsAdding(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setPlaces((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
      toast.success("Local removido somente desta demonstração.");
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const label = newLabel.trim();
    const region = newRegion.trim();

    if (!label || !region) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    const newPlace: SavedPlace = {
      id: Math.random().toString(36).substring(2, 9),
      label,
      region,
      type: newType,
    };

    setPlaces((prev) => [...prev, newPlace]);
    handleCancel();
    toast.success("Local adicionado somente nesta demonstração.");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          to="/passageiro/perfil"
          aria-label="Voltar para o perfil"
          className="h-10 w-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-navy transition-colors focus-visible:ring-2 focus-visible:ring-navy focus-visible:outline-none"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-xl font-black tracking-tight text-navy uppercase">Locais Salvos</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Seus destinos favoritos
          </p>
        </div>
      </div>

      {/* Simulation Banner */}
      <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
        <AlertCircle className="text-amber-500 shrink-0" size={18} aria-hidden="true" />
        <p className="text-[11px] font-medium text-amber-800 leading-tight">
          Demonstração local: estes locais são exemplos. As alterações permanecem somente nesta tela
          e são perdidas ao atualizar.
        </p>
      </div>

      <div className="space-y-4">
        {/* Add New Local Button/Form */}
        {!isAdding ? (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="w-full p-5 bg-white border border-dashed border-slate-200 rounded-[32px] flex items-center justify-center gap-3 text-slate-400 hover:border-navy/20 hover:text-navy transition-all group focus-visible:ring-2 focus-visible:ring-navy focus-visible:outline-none"
          >
            <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-colors">
              <Plus size={18} aria-hidden="true" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">
              Adicionar Novo Local
            </span>
          </button>
        ) : (
          <form
            onSubmit={handleAdd}
            className="p-6 bg-white border border-slate-100 rounded-[32px] space-y-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-black text-navy uppercase italic">Novo Local</h2>
              <button
                type="button"
                onClick={handleCancel}
                className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                aria-label="Cancelar adição"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label
                  htmlFor="place-label"
                  className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1"
                >
                  Nome do Local (ex: Casa, Trabalho)
                </label>
                <input
                  id="place-label"
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  maxLength={30}
                  className="w-full h-12 px-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-navy placeholder:text-slate-300 focus:ring-2 focus:ring-navy/10 transition-all"
                  placeholder="Nome do local"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="place-region"
                  className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1"
                >
                  Região Resumida (Bairro, Cidade)
                </label>
                <input
                  id="place-region"
                  type="text"
                  value={newRegion}
                  onChange={(e) => setNewRegion(e.target.value)}
                  maxLength={50}
                  className="w-full h-12 px-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-navy placeholder:text-slate-300 focus:ring-2 focus:ring-navy/10 transition-all"
                  placeholder="Ex: Vila Setti, Jacarezinho"
                  required
                />
                <p className="text-[9px] text-amber-600 font-bold uppercase tracking-tight mt-1.5 ml-1">
                  Não informe rua, número ou endereço completo.
                </p>
              </div>

              <div>
                <label
                  htmlFor="place-type"
                  className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-1"
                >
                  Tipo
                </label>
                <select
                  id="place-type"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as "home" | "work" | "other")}
                  className="w-full h-12 px-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-navy focus:ring-2 focus:ring-navy/10 transition-all appearance-none"
                >
                  <option value="home">Casa</option>
                  <option value="work">Trabalho</option>
                  <option value="other">Outro</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 h-12 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 h-12 rounded-2xl bg-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-navy/90 transition-colors shadow-lg shadow-navy/10"
              >
                Salvar Local
              </button>
            </div>
          </form>
        )}

        {/* Places List */}
        <div className="space-y-3" aria-live="polite">
          {places.map((place) => (
            <div
              key={place.id}
              className="p-5 bg-white border border-slate-100 rounded-[32px] flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div
                  className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center ${
                    place.type === "home"
                      ? "bg-blue-50 text-blue-500"
                      : place.type === "work"
                        ? "bg-amber-50 text-amber-500"
                        : "bg-rose-50 text-rose-500"
                  }`}
                >
                  {place.type === "home" ? (
                    <Home size={20} aria-hidden="true" />
                  ) : place.type === "work" ? (
                    <Briefcase size={20} aria-hidden="true" />
                  ) : (
                    <Heart size={20} aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0 pr-4">
                  <h3 className="text-sm font-black text-navy leading-tight mb-1">{place.label}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight truncate">
                    {place.region}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => setDeleteId(place.id)}
                  aria-label={`Excluir ${place.label}`}
                  className="p-2 text-slate-300 hover:text-rose-500 transition-colors focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none rounded-lg"
                >
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}

          {places.length === 0 && (
            <div className="py-16 text-center bg-white border border-dashed border-slate-200 rounded-[32px]">
              <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <MapPin size={32} aria-hidden="true" />
              </div>
              <p className="text-sm font-bold text-navy uppercase tracking-tight">
                Nenhum local salvo nesta demonstração.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-[32px] border-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black text-navy uppercase italic">
              Remover "{deletePlaceName}"?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs font-bold text-slate-500 uppercase tracking-tight">
              Tem certeza que deseja remover este local da demonstração?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel
              type="button"
              className="rounded-2xl text-[10px] font-black uppercase tracking-widest border-slate-100 hover:bg-slate-50"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              type="button"
              onClick={handleDelete}
              className="rounded-2xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors"
            >
              Sim, Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
