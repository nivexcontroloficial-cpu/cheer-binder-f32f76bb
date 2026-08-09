import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Search, ArrowRightLeft, Clock, Star, MapPinned } from "lucide-react";

export const Route = createFileRoute("/passageiro/destino")({
  component: DestinationScreen,
});

function DestinationScreen() {
  const [origin, setOrigin] = useState("Minha localização atual");
  const [destination, setDestination] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy">
      <header className="bg-white px-6 py-5 border-b border-slate-100 flex items-center gap-4">
        <button onClick={() => navigate({ to: "/passageiro/inicio" })} className="p-2 -ml-2 text-slate-400 hover:text-navy">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[11px] font-black uppercase tracking-widest">Para onde vamos?</h1>
      </header>

      <main className="flex-1 p-6 space-y-6">
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 flex justify-center text-rovya-orange">
              <div className="w-2 h-2 rounded-full bg-rovya-orange shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
            </div>
            <input 
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 text-[11px] font-bold uppercase tracking-widest text-navy focus:outline-none focus:border-rovya-orange transition-all"
            />
          </div>

          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 flex justify-center text-rovya-blue">
              <MapPin size={16} strokeWidth={2.5} />
            </div>
            <input 
              autoFocus
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Digite o destino..."
              className="w-full h-14 bg-white border-2 border-slate-100 rounded-2xl pl-10 pr-4 text-[11px] font-black uppercase tracking-widest text-navy focus:outline-none focus:border-rovya-blue transition-all"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-navy">
              <ArrowRightLeft size={16} className="rotate-90" />
            </button>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Sugestões</h2>
          <div className="bg-white rounded-[24px] border border-slate-100 divide-y divide-slate-50">
            {["Rua São João, 123", "Av. Brasil, 450", "Shopping Jacarezinho"].map((addr) => (
              <button 
                key={addr}
                onClick={() => { setDestination(addr); navigate({ to: "/passageiro/localizar" }) }}
                className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                  <MapPinned size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-navy">{addr}</h4>
                  <p className="text-[9px] text-slate-400">Jacarezinho • PR • 1.2 km</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
