import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  MapPin,
  Search,
  ArrowRightLeft,
  Star,
  MapPinned,
  AlertCircle,
  Info,
  RefreshCw,
} from "lucide-react";

export const Route = createFileRoute("/passageiro/destino")({
  component: DestinationScreen,
});

interface Suggestion {
  id: string;
  name: string;
  region: string;
  distanceSimulated: string;
}

const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    id: "s1",
    name: "Shopping Jacarezinho",
    region: "Centro, Jacarezinho",
    distanceSimulated: "1.2 km",
  },
  {
    id: "s2",
    name: "Vila Setti",
    region: "Vila Setti, Jacarezinho",
    distanceSimulated: "0.8 km",
  },
  {
    id: "s3",
    name: "Terminal Rodoviário",
    region: "Centro, Jacarezinho",
    distanceSimulated: "1.5 km",
  },
  {
    id: "s4",
    name: "Academia Fit",
    region: "Centro, Jacarezinho",
    distanceSimulated: "2.3 km",
  },
];

function DestinationScreen() {
  const [origin, setOrigin] = useState("Minha localização atual — simulação");
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>(MOCK_SUGGESTIONS);
  const [isSearching, setIsSearching] = useState(false);
  const [simulationError, setSimulationError] = useState(false);
  const [originError, setOriginError] = useState("");
  const [destError, setDestError] = useState("");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  // Debounce simulado para busca
  useEffect(() => {
    if (simulationError) return;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!destination.trim()) {
      setSuggestions(MOCK_SUGGESTIONS);
      setIsSearching(false);
      setDestError("");
      return;
    }

    setIsSearching(true);
    setDestError("");

    searchTimeoutRef.current = setTimeout(() => {
      const searchTerm = destination.trim().toLowerCase();
      const filtered = MOCK_SUGGESTIONS.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm) ||
          s.region.toLowerCase().includes(searchTerm),
      );
      setSuggestions(filtered);
      setIsSearching(false);
    }, 400);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [destination, simulationError]);

  const validateInputs = (newOrigin: string, newDest: string) => {
    let valid = true;
    const trimmedOrigin = newOrigin.trim();
    const trimmedDest = newDest.trim();

    if (!trimmedOrigin) {
      setOriginError("A origem não pode ficar vazia.");
      valid = false;
    } else {
      setOriginError("");
    }

    if (
      trimmedDest &&
      trimmedOrigin.toLowerCase() === trimmedDest.toLowerCase()
    ) {
      setDestError("O destino não pode ser igual à origem.");
      valid = false;
    } else {
      setDestError("");
    }

    return valid;
  };

  const handleReverse = () => {
    if (!destination.trim() || origin === "Minha localização atual — simulação")
      return;
    const oldOrigin = origin;
    const oldDest = destination;
    setOrigin(oldDest);
    setDestination(oldOrigin);
    validateInputs(oldDest, oldOrigin);
  };

  const handleSelect = (item: Suggestion) => {
    const trimmedOrigin = origin.trim().toLowerCase();
    const selectedName = item.name.toLowerCase();

    if (selectedName === trimmedOrigin) {
      setDestError("O destino não pode ser igual à origem.");
      return;
    }

    setDestination(item.name);
    navigate({ to: "/passageiro/localizar" });
  };

  const toggleSimulationError = () => {
    setSimulationError(!simulationError);
    if (!simulationError) {
      setSuggestions([]);
      setIsSearching(false);
    }
  };

  const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="text-rovya-blue bg-rovya-blue/5 px-0.5 rounded">
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy selection:bg-rovya-orange/20">
      {/* Banner de Transparência */}
      <div className="bg-amber-50 border-b border-amber-100 px-6 py-2 flex items-center gap-3">
        <Info size={14} className="text-amber-500 shrink-0" aria-hidden="true" />
        <p className="text-[9px] font-bold text-amber-700 leading-tight uppercase tracking-wider">
          Demonstração local: a busca utiliza somente sugestões fictícias e não
          consulta mapas, GPS ou endereços reais.
        </p>
      </div>

      <header className="bg-white px-6 py-5 border-b border-slate-100 flex items-center gap-4 sticky top-0 z-50">
        <button
          type="button"
          onClick={() => navigate({ to: "/passageiro/inicio" })}
          aria-label="Voltar para o início"
          className="p-2 -ml-2 text-slate-400 hover:text-navy transition-colors focus-visible:ring-2 focus-visible:ring-rovya-orange rounded-full"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[11px] font-black uppercase tracking-widest italic">
          Para onde vamos?
        </h1>
      </header>

      <main className="flex-1 p-6 space-y-6">
        {/* Container de Busca */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          {/* Campo Origem */}
          <div className="space-y-1.5">
            <div className="relative">
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-8 flex justify-center text-rovya-orange"
                aria-hidden="true"
              >
                <div className="w-2 h-2 rounded-full bg-rovya-orange shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
              </div>
              <label htmlFor="origin-input" className="sr-only">
                Local de Origem
              </label>
              <input
                id="origin-input"
                type="text"
                maxLength={80}
                value={origin}
                onChange={(e) => {
                  setOrigin(e.target.value);
                  setOriginError("");
                }}
                onBlur={() => validateInputs(origin, destination)}
                aria-invalid={!!originError}
                aria-describedby={originError ? "origin-error" : undefined}
                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 text-[11px] font-bold uppercase tracking-widest text-navy focus:outline-none focus:border-rovya-orange focus:bg-white focus:ring-2 focus:ring-rovya-orange/10 transition-all"
              />
              <div
                className="absolute left-3.5 top-11 w-0.5 h-4 border-l border-dashed border-slate-200"
                aria-hidden="true"
              ></div>
            </div>
            {originError && (
              <p
                id="origin-error"
                role="alert"
                className="text-[9px] font-black uppercase tracking-widest text-red-500 flex items-center gap-1.5 px-1"
              >
                <AlertCircle size={10} />
                {originError}
              </p>
            )}
          </div>

          {/* Campo Destino */}
          <div className="space-y-1.5">
            <div className="relative">
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-8 flex justify-center text-rovya-blue"
                aria-hidden="true"
              >
                <MapPin size={18} strokeWidth={2.5} />
              </div>
              <label htmlFor="destination-input" className="sr-only">
                Local de Destino
              </label>
              <input
                id="destination-input"
                autoFocus
                type="text"
                maxLength={80}
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  setDestError("");
                }}
                onBlur={() => validateInputs(origin, destination)}
                placeholder="Qual o seu destino fictício?"
                aria-invalid={!!destError}
                aria-describedby={destError ? "dest-error" : undefined}
                className="w-full h-16 bg-white border-2 border-slate-100 rounded-2xl pl-10 pr-12 text-[11px] font-black uppercase tracking-[0.1em] text-navy focus:outline-none focus:border-rovya-blue focus:ring-2 focus:ring-rovya-blue/10 transition-all placeholder:text-slate-300"
              />
              <button
                type="button"
                onClick={handleReverse}
                disabled={!destination.trim() || origin === "Minha localização atual — simulação"}
                aria-label="Inverter origem e destino"
                className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 hover:text-navy hover:bg-slate-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-rovya-blue"
              >
                <ArrowRightLeft size={16} className="rotate-90" aria-hidden="true" />
              </button>
            </div>
            {destError && (
              <p
                id="dest-error"
                role="alert"
                className="text-[9px] font-black uppercase tracking-widest text-red-500 flex items-center gap-1.5 px-1"
              >
                <AlertCircle size={10} />
                {destError}
              </p>
            )}
          </div>
        </div>

        {/* Simulador de Falha */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={toggleSimulationError}
            className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-slate-500 transition-colors py-1 px-3 border border-slate-100 rounded-full"
          >
            {simulationError ? "Restaurar busca local" : "Simular falha da busca local"}
          </button>
        </div>

        {/* Lista de Sugestões */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2
              className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
              aria-live="polite"
            >
              {simulationError
                ? "Erro de Carregamento"
                : destination
                  ? isSearching
                    ? "Buscando sugestões locais..."
                    : `Resultados (${suggestions.length})`
                  : "Sugestões Próximas"}
            </h2>
            {destination && !isSearching && !simulationError && suggestions.length > 0 && (
              <span
                className="text-[9px] font-black uppercase tracking-widest text-slate-300"
                aria-live="polite"
              >
                {suggestions.length} locais encontrados
              </span>
            )}
          </div>

          <div className="bg-white rounded-[32px] border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[120px] flex flex-col">
            {simulationError ? (
              <div className="flex-1 p-8 text-center space-y-4 flex flex-col items-center justify-center">
                <div
                  className="h-12 w-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-400"
                  aria-hidden="true"
                >
                  <AlertCircle size={24} />
                </div>
                <div className="space-y-2">
                  <p role="alert" className="text-[10px] font-black uppercase tracking-widest text-navy">
                    Falha simulada: as sugestões locais não puderam ser carregadas.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSimulationError(false)}
                    className="flex items-center gap-2 mx-auto px-4 py-2 bg-navy text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-navy/90 transition-all active:scale-95"
                  >
                    <RefreshCw size={12} />
                    Tentar novamente
                  </button>
                </div>
              </div>
            ) : isSearching ? (
              <div className="flex-1 p-12 text-center flex flex-col items-center justify-center space-y-4">
                <div
                  className="h-12 w-12 border-4 border-rovya-blue/10 border-t-rovya-blue rounded-full animate-spin"
                  aria-hidden="true"
                ></div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Consultando base local...
                </p>
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  aria-label={`${item.name}, ${item.region}. Distância estimada: ${item.distanceSimulated}`}
                  className="w-full p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left group min-h-[44px]"
                >
                  <div
                    className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-rovya-blue group-hover:bg-white transition-all shadow-sm"
                    aria-hidden="true"
                  >
                    <MapPinned size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-navy group-hover:text-rovya-blue transition-colors">
                      <HighlightedText text={item.name} highlight={destination} />
                    </h4>
                    <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                      <HighlightedText text={item.region} highlight={destination} />
                    </p>
                  </div>
                  <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    {item.distanceSimulated}
                  </div>
                </button>
              ))
            ) : (
              <div className="flex-1 p-12 text-center space-y-4 flex flex-col items-center justify-center">
                <div
                  className="h-16 w-16 bg-slate-50 rounded-[24px] flex items-center justify-center text-slate-200 mx-auto"
                  aria-hidden="true"
                >
                  <Search size={32} strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                  <p
                    role="alert"
                    className="text-[10px] font-black uppercase tracking-widest text-navy"
                  >
                    Nenhum local fictício encontrado
                  </p>
                  <p className="text-[9px] text-slate-400 font-medium max-w-[200px] mx-auto">
                    Tente buscar por outro nome ou região em Jacarezinho (Ex: Centro, Vila Setti).
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Atalhos Rápidos */}
        {!destination && !simulationError && (
          <section className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <ShortcutButton
              icon={<Star size={18} />}
              label="Locais Salvos"
              onClick={() => navigate({ to: "/passageiro/locais-salvos" })}
            />
            <ShortcutButton
              icon={<MapPinned size={18} />}
              label="Ver no Mapa"
              onClick={() => navigate({ to: "/passageiro/localizar" })}
            />
          </section>
        )}
      </main>

      <footer className="p-6 text-center">
        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">
          Nenhum backend ou GPS real conectado nesta etapa.
        </p>
      </footer>
    </div>
  );
}

function ShortcutButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-5 bg-white rounded-[28px] border border-slate-100 text-left hover:border-rovya-orange transition-all shadow-sm group flex items-center gap-3 min-h-[44px] focus-visible:ring-2 focus-visible:ring-rovya-orange"
    >
      <div
        className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-rovya-orange transition-colors"
        aria-hidden="true"
      >
        {icon}
      </div>
      <h4 className="text-[9px] font-black uppercase tracking-widest text-navy">
        {label}
      </h4>
    </button>
}
