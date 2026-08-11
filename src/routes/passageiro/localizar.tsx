import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, MapPin, Check, Info } from "lucide-react";
import { z } from "zod";

const optionalSearchString = (maxLength: number) =>
  z
    .preprocess((value) => {
      if (typeof value !== "string") return undefined;
      const trimmed = value.trim();
      return trimmed ? trimmed : undefined;
    }, z.string().max(maxLength).optional())
    .catch(undefined);

const searchSchema = z.object({
  origin: optionalSearchString(80),
  destination: optionalSearchString(80),
  destinationRegion: optionalSearchString(80),
  reference: optionalSearchString(60),
});

export const Route = createFileRoute("/passageiro/localizar")({
  validateSearch: (search) => searchSchema.parse(search),
  component: MockMapScreen,
});

function MockMapScreen() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [reference, setReference] = useState(search.reference || "");

  const normalizedOrigin =
    search.origin === "Minha localização atual — simulação"
      ? "Centro, Jacarezinho"
      : search.origin || "Centro, Jacarezinho";

  const handleConfirm = () => {
    const trimmedRef = reference.trim() || undefined;
    if (!search.destination) {
      navigate({
        to: "/passageiro/destino",
        search: {
          origin: normalizedOrigin,
          reference: trimmedRef,
        },
      });
    } else {
      navigate({
        to: "/passageiro/confirmar-corrida",
        search: {
          origin: normalizedOrigin,
          destination: search.destination,
          destinationRegion: search.destinationRegion,
          reference: trimmedRef,
        },
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 font-sans text-navy">
      {/* Banner de Transparência */}
      <div className="bg-amber-50 border-b border-amber-100 px-6 py-2 flex items-center gap-3 shrink-0">
        <Info size={14} className="text-amber-500 shrink-0" aria-hidden="true" />
        <p className="text-[9px] font-bold text-amber-700 leading-tight uppercase tracking-wider">
          Mapa esquemático local: nenhum GPS, localização real ou serviço de mapas foi acessado.
        </p>
      </div>

      <header className="bg-white px-6 py-5 border-b border-slate-100 flex items-center gap-4 sticky top-0 z-50">
        <button
          type="button"
          onClick={() =>
            navigate({
              to: "/passageiro/destino",
              search: {
                origin: search.origin,
                destination: search.destination,
                destinationRegion: search.destinationRegion,
                reference: reference.trim() || undefined,
              },
            })
          }
          aria-label="Voltar para busca de destino"
          className="p-2 -ml-2 text-slate-400 hover:text-navy transition-colors focus-visible:ring-2 focus-visible:ring-rovya-orange rounded-full min-h-11 min-w-11 flex items-center justify-center"
        >
          <ArrowLeft size={24} aria-hidden="true" />
        </button>
        <h1 className="text-[11px] font-black uppercase tracking-widest italic">
          Confirmar ponto de embarque
        </h1>
      </header>

      {/* Mapa Esquemático Mock */}
      <div
        className="flex-1 relative bg-slate-200 overflow-hidden"
        role="img"
        aria-label="Mapa esquemático do ponto de embarque simulado"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#111827 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden="true"
        ></div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div
              className="absolute -top-12 -left-1/2 translate-x-1/4 bg-navy text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap shadow-xl animate-bounce"
              aria-hidden="true"
            >
              Confirmar Local
            </div>
            <div
              className="h-10 w-10 bg-rovya-orange rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-in zoom-in-50 duration-500"
              aria-hidden="true"
            >
              <MapPin size={20} className="text-white" fill="white" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-t-[40px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div
              className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-rovya-orange shrink-0"
              aria-hidden="true"
            >
              <MapPin size={20} aria-hidden="true" />
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-navy">
                Ponto de Embarque
              </h3>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5 italic break-words">
                {search.origin === "Minha localização atual — simulação"
                  ? "Centro, Jacarezinho — ponto simulado"
                  : search.origin || "Centro, Jacarezinho"}
              </p>
            </div>
          </div>

          {search.destination && (
            <div className="flex items-start gap-4">
              <div
                className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-rovya-blue shrink-0"
                aria-hidden="true"
              >
                <MapPin size={20} aria-hidden="true" />
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-navy">
                  Destino
                </h3>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5 break-words">
                  {search.destination}
                  {search.destinationRegion && ` — ${search.destinationRegion}`}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="boarding-reference"
              className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1"
            >
              Referência fictícia (opcional)
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                <Info size={16} aria-hidden="true" />
              </div>
              <input
                id="boarding-reference"
                type="text"
                maxLength={60}
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="EX: PORTÃO BRANCO"
                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-navy focus:outline-none focus:border-rovya-orange transition-all placeholder:text-slate-300"
              />
            </div>
            <p className="text-[8px] text-slate-400 italic px-1">
              Demonstração: não informe endereço ou dado pessoal real.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          className="w-full h-16 bg-navy text-white rounded-[24px] font-black uppercase tracking-widest text-[12px] flex items-center justify-center gap-2 hover:bg-navy/90 transition-all active:scale-95 rovya-shadow min-h-11 focus-visible:ring-2 focus-visible:ring-rovya-orange outline-none"
        >
          {search.destination
            ? "Confirmar ponto de embarque"
            : "Confirmar ponto e escolher destino"}
          <Check size={20} strokeWidth={3} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
