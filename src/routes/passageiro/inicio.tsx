import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  Search,
  MapPin,
  Navigation,
  ShieldCheck,
  Clock,
  Star,
  CreditCard,
  ChevronRight,
  MapPinned,
  TicketPercent,
  Plus,
  Info,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const Route = createFileRoute("/passageiro/inicio")({
  component: PassengerHomeScreen,
});

function PassengerHomeScreen() {
  const navigate = useNavigate();
  const [paymentMethodId, setPaymentMethodId] = useState("cash");

  const paymentMethods = [
    { id: "cash", label: "Dinheiro" },
    { id: "pix", label: "Pix direto ao piloto" },
    { id: "card", label: "Cartão na máquina do piloto" },
  ];

  const currentPaymentMethod = paymentMethods.find((m) => m.id === paymentMethodId)!;

  const handleRecentClick = () => {
    navigate({ to: "/passageiro/destino" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans text-navy">
      <h1 className="sr-only">Rovya Passageiro - Início</h1>

      <div className="flex-1 space-y-6 pb-[calc(8rem+env(safe-area-inset-bottom,1.5rem))] px-4 pt-4">
        {/* Localização Atual Contexto */}
        <div className="flex items-center gap-2">
          <MapPinned size={14} className="text-rovya-orange" aria-hidden="true" />
          <span className="text-[10px] font-black uppercase tracking-widest text-navy">
            Jacarezinho • PR
          </span>
        </div>

        {/* Transparência Banner */}
        <div className="flex items-start gap-2 p-3 bg-blue-50/50 border border-blue-100 rounded-2xl">
          <Info size={14} className="text-blue-500 mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-[9px] text-blue-700 font-medium italic leading-relaxed">
            Demonstração local: destinos, localização, conta, preços e promoções utilizam dados
            fictícios.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black italic uppercase tracking-tighter text-navy">
              Olá, Rafael
            </h2>
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
              Perfil fictício
            </span>
          </div>

          {/* Selo de Segurança */}
          <Link
            to="/passageiro/saude-da-conta"
            className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-3xl transition-all hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rovya-green focus-visible:ring-offset-2"
            aria-label="Verificar saúde da conta. Conta verificada — simulação"
          >
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center text-rovya-green shadow-sm"
                aria-hidden="true"
              >
                <ShieldCheck size={22} strokeWidth={1.8} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900 leading-none mb-1">
                  Conta verificada — simulação
                </span>
                <span className="text-[9px] text-emerald-700 font-medium italic">
                  Estado demonstrativo, sem validação real
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-emerald-300" aria-hidden="true" />
          </Link>
        </div>

        {/* Card Principal: Solicitação */}
        <section className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-8 flex justify-center text-rovya-orange"
                aria-hidden="true"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-rovya-orange shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
              </div>
              <div className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 flex items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-navy">
                  Localização atual simulada: Centro, Jacarezinho
                </span>
              </div>
              <div
                className="absolute left-3.5 top-12 w-0.5 h-6 border-l border-dashed border-slate-200"
                aria-hidden="true"
              ></div>
            </div>

            <div className="relative group">
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-8 flex justify-center text-slate-300 group-hover:text-rovya-orange transition-colors"
                aria-hidden="true"
              >
                <Search size={18} strokeWidth={2.5} />
              </div>
              <button
                id="destination-trigger"
                type="button"
                onClick={() => navigate({ to: "/passageiro/destino" })}
                className="w-full min-h-[44px] h-16 bg-white border-2 border-slate-100 rounded-2xl pl-10 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-navy text-left flex items-center hover:border-rovya-orange focus:outline-none focus:border-rovya-orange focus-visible:ring-2 focus-visible:ring-rovya-orange transition-all shadow-sm outline-none"
                aria-label="Escolher destino simulado"
              >
                PARA ONDE VAMOS?
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="min-h-11 min-w-[44px] flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-navy hover:bg-white hover:border-rovya-orange transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rovya-orange outline-none"
                  aria-label={`Mudar forma de pagamento. Atual: ${currentPaymentMethod.label} - demonstração`}
                >
                  <CreditCard
                    size={14}
                    strokeWidth={2}
                    className="text-slate-400"
                    aria-hidden="true"
                  />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    {currentPaymentMethod.label}
                  </span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-[32px] p-8 border-none">
                <SheetHeader>
                  <SheetTitle className="text-xl font-black uppercase italic tracking-tighter text-navy">
                    Selecione o Pagamento
                  </SheetTitle>
                </SheetHeader>
                <div className="grid grid-cols-1 gap-3 py-6">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => {
                        setPaymentMethodId(method.id);
                        toast.success(`Pagamento simulado definido como ${method.label}`);
                      }}
                      aria-pressed={paymentMethodId === method.id}
                      className={`w-full min-h-11 p-5 rounded-2xl border flex items-center justify-between transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rovya-orange ${
                        paymentMethodId === method.id
                          ? "bg-navy text-white border-navy"
                          : "bg-slate-50 text-navy border-slate-100"
                      }`}
                    >
                      <span className="text-[11px] font-black uppercase tracking-widest">
                        {method.label}
                      </span>
                      <ChevronRight size={16} aria-hidden="true" />
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-slate-400 font-medium italic text-center">
                  * Demonstração local: pagamentos são escolhas presenciais simuladas.
                </p>
              </SheetContent>
            </Sheet>

            <button
              type="button"
              onClick={() => toast.info("Demonstração: funcionalidade de agendamento simulada.")}
              className="min-h-11 min-w-[44px] flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rovya-orange outline-none rounded-lg px-2"
            >
              <Plus size={14} strokeWidth={2.5} className="text-rovya-orange" aria-hidden="true" />
              Agendar
            </button>
          </div>
        </section>

        {/* Favoritos */}
        <section className="grid grid-cols-2 gap-4">
          <FavoriteButton
            onClick={() => navigate({ to: "/passageiro/locais-salvos" })}
            icon={<Navigation size={18} />}
            label="Trabalho"
            sub="Centro, Jacarezinho"
          />
          <FavoriteButton
            onClick={() => navigate({ to: "/passageiro/locais-salvos" })}
            icon={<Clock size={18} />}
            label="Casa"
            sub="Centro, Jacarezinho"
          />
        </section>

        {/* Destinos Recentes */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
            Destinos Recentes
          </h3>
          <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
            <RecentItem
              onClick={handleRecentClick}
              icon={<MapPin size={16} />}
              title="Shopping Jacarezinho"
              address="Centro, Jacarezinho"
            />
            <RecentItem
              onClick={handleRecentClick}
              icon={<MapPin size={16} />}
              title="Terminal Rodoviário"
              address="Centro, Jacarezinho"
            />
            <RecentItem
              onClick={handleRecentClick}
              icon={<Star size={16} />}
              title="Academia Fit"
              address="Centro, Jacarezinho"
              last
            />
          </div>
        </section>

        {/* Banner Promocional */}
        <button
          type="button"
          onClick={() =>
            toast.info("Demonstração: Promoção ativa de R$ 10,00 para novos indicados fictícios.")
          }
          className="w-full p-6 bg-navy rounded-[32px] text-white relative overflow-hidden group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rovya-orange"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-rovya-orange/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-rovya-orange/30 transition-colors"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-rovya-orange rounded-lg text-[8px] font-black uppercase tracking-widest">
                <TicketPercent size={10} aria-hidden="true" />
                Promo Simulada
              </div>
              <h4 className="text-sm font-black tracking-tight leading-tight uppercase italic">
                Indique amigos e ganhe
                <br />
                R$ 10,00 de desconto
              </h4>
            </div>
            <div className="h-10 w-10 bg-white/10 group-hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors">
              <ChevronRight size={18} aria-hidden="true" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

function FavoriteButton({
  icon,
  label,
  sub,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-[44px] min-w-[44px] p-5 bg-white rounded-[28px] border border-slate-100 text-left hover:border-rovya-orange transition-all shadow-sm group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rovya-orange outline-none"
    >
      <div
        className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-rovya-orange transition-colors mb-3"
        aria-hidden="true"
      >
        {icon}
      </div>
      <h4 className="text-[10px] font-black uppercase tracking-widest text-navy mb-0.5">{label}</h4>
      <p className="text-[8px] text-slate-400 font-medium truncate">{sub}</p>
    </button>
  );
}

function RecentItem({
  icon,
  title,
  address,
  last,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  address: string;
  last?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full min-h-[44px] p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rovya-orange outline-none ${
        !last ? "border-b border-slate-50" : ""
      }`}
    >
      <div
        className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300"
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="flex-1 text-left">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-navy leading-none mb-1">
          {title}
        </h4>
        <p className="text-[9px] text-slate-400 font-medium">{address}</p>
      </div>
      <ChevronRight size={14} className="text-slate-200" aria-hidden="true" />
    </button>
  );
}
