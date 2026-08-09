import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Search, ArrowRightLeft, Clock, Star, MapPinned, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/passageiro/destino")({
  component: DestinationScreen,
});

const MOCK_SUGGESTIONS = [
  { id: 's1', name: "Shopping Jacarezinho", address: "Centro, Jacarezinho - PR", distance: "1.2 km" },
  { id: 's2', name: "Rua São João, 123", address: "Vila Setti, Jacarezinho - PR", distance: "0.8 km" },
  { id: 's3', name: "Av. Brasil, 450", address: "Centro, Jacarezinho - PR", distance: "2.1 km" },
  { id: 's4', name: "Terminal Rodoviário", address: "Rua das Flores, 123", distance: "1.5 km" },
  { id: 's5', name: "Academia Fit", address: "Av. Brasil, 450", distance: "2.3 km" },
];

function DestinationScreen() {
  const [origin, setOrigin] = useState("Minha localização atual");
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState(MOCK_SUGGESTIONS);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // Debounce simulado para busca
  useEffect(() => {
    if (!destination.trim()) {
      setSuggestions(MOCK_SUGGESTIONS);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeout = setTimeout(() => {
      const filtered = MOCK_SUGGESTIONS.filter(s => 
        s.name.toLowerCase().includes(destination.toLowerCase()) || 
        s.address.toLowerCase().includes(destination.toLowerCase())
      );
      setSuggestions(filtered);
      setIsSearching(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [destination]);

  const handleReverse = () => {
    if (origin === "Minha localização atual") return;
    const temp = origin;
    setOrigin(destination || "Minha localização atual");
    setDestination(temp);
  };

  const handleSelect = (addr: string) => {
    if (addr === origin) {
      return; // Erro silencioso ou toast poderia ir aqui
    }
    setDestination(addr);
    navigate({ to: "/passageiro/localizar" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy selection:bg-rovya-orange/20">
      <header className="bg-white px-6 py-5 border-b border-slate-100 flex items-center gap-4 sticky top-0 z-50">
        <button onClick={() => navigate({ to: "/passageiro/inicio" })} className="p-2 -ml-2 text-slate-400 hover:text-navy transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[11px] font-black uppercase tracking-widest italic">Para onde vamos?</h1>
      </header>

      <main className="flex-1 p-6 space-y-6">
        {/* Container de Busca */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 flex justify-center text-rovya-orange">
              <div className="w-2 h-2 rounded-full bg-rovya-orange shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
            </div>
            <input 
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 text-[11px] font-bold uppercase tracking-widest text-navy focus:outline-none focus:border-rovya-orange focus:bg-white transition-all"
            />
            <div className="absolute left-3.5 top-11 w-0.5 h-4 border-l border-dashed border-slate-200"></div>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 flex justify-center text-rovya-blue">
              <MapPin size={18} strokeWidth={2.5} />
            </div>
            <input 
              autoFocus
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Digite o destino..."
              className="w-full h-16 bg-white border-2 border-slate-100 rounded-2xl pl-10 pr-12 text-[11px] font-black uppercase tracking-[0.1em] text-navy focus:outline-none focus:border-rovya-blue transition-all placeholder:text-slate-300"
            />
            <button 
              onClick={handleReverse}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 hover:text-navy hover:bg-slate-100 transition-all"
            >
              <ArrowRightLeft size={16} className="rotate-90" />
            </button>
          </div>
          
          {destination && origin === destination && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-rovya-red rounded-xl animate-in shake-1">
              <AlertCircle size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">Origem e destino não podem ser iguais</span>
            </div>
          )}
        </div>

        {/* Lista de Sugestões */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {destination ? (isSearching ? "Buscando..." : "Resultados") : "Sugestões Próximas"}
            </h2>
            {destination && !isSearching && (
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">
                {suggestions.length} locais
              </span>
            )}
          </div>

          <div className="bg-white rounded-[32px] border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            {suggestions.length > 0 ? (
              suggestions.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => handleSelect(item.name)}
                  className="w-full p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-rovya-blue group-hover:bg-white transition-all shadow-sm">
                    <MapPinned size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-navy group-hover:text-rovya-blue transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-[9px] text-slate-400 font-medium mt-0.5">{item.address}</p>
                  </div>
                  <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    {item.distance}
                  </div>
                </button>
              ))
            ) : (
              <div className="p-12 text-center space-y-4">
                <div className="h-16 w-16 bg-slate-50 rounded-[24px] flex items-center justify-center text-slate-200 mx-auto">
                  <Search size={32} strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy">Nenhum local encontrado</p>
                  <p className="text-[9px] text-slate-400 font-medium">Tente buscar por um nome ou endereço diferente em Jacarezinho.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Atalhos Rápidos */}
        {!destination && (
          <section className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <ShortcutButton icon={<Star size={18} />} label="Locais Salvos" onClick={() => navigate({ to: '/passageiro/locais-salvos' })} />
            <ShortcutButton icon={<MapPinned size={18} />} label="Ver no Mapa" onClick={() => navigate({ to: '/passageiro/localizar' })} />
          </section>
        )}
      </main>
    </div>
  );
}

function ShortcutButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="p-5 bg-white rounded-[28px] border border-slate-100 text-left hover:border-rovya-orange transition-all shadow-sm group flex items-center gap-3">
      <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-rovya-orange transition-colors">
        {icon}
      </div>
      <h4 className="text-[9px] font-black uppercase tracking-widest text-navy">{label}</h4>
    </button>
  );
}
