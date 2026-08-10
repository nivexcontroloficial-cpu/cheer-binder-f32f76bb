import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  CreditCard,
  Banknote,
  QrCode,
  Info,
  ChevronRight,
  TicketPercent,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";


export const Route = createFileRoute("/passageiro/confirmar-corrida")({
  component: ConfirmRideScreen,
});

type PaymentMethod = "cash" | "pix" | "card";

function ConfirmRideScreen() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Dados Mock Obrigatórios
  const distance = 6.8;
  const duration = 18;
  const baseFare = 5.0;
  const pricePerKm = 1.5;
  const pricePerMin = 0.3;
  const demandSurge = 1.2; // 20% aumento

  const subtotal = useMemo(() => {
    const travelCost = distance * pricePerKm + duration * pricePerMin;
    return (baseFare + travelCost) * (demandSurge > 1 ? demandSurge : 1);
  }, [distance, duration]);

  const discount = isPromoApplied ? 5.0 : 0;
  const finalPrice = Math.max(10.0, subtotal - discount); // Tarifa mínima mock de R$ 10

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "DEMO5") {
      setIsPromoApplied(true);
      toast.success("Desconto aplicado apenas nesta demonstração.");
    } else {
      toast.error("Código demonstrativo inválido.");
    }
  };

  const handleOrder = () => {
    toast.info("Solicitação simulada. Nenhuma corrida real foi pedida.");
    navigate({ to: "/passageiro/buscando" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy">
      {/* Header Fixo */}
      <header className="bg-white px-6 py-5 border-b border-slate-100 flex items-center gap-4 sticky top-0 z-50">
        <button
          type="button"
          aria-label="Voltar para localização"
          onClick={() => navigate({ to: "/passageiro/localizar" })}
          className="p-2 -ml-2 text-slate-400 hover:text-navy transition-colors focus-visible:ring-2 focus-visible:ring-rovya-orange outline-none rounded-lg"
        >
          <ArrowLeft size={24} aria-hidden="true" />
        </button>
        <h1 className="text-[11px] font-black uppercase tracking-widest italic">
          Confirmar Corrida
        </h1>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Aviso de Demonstração */}
        <div className="bg-orange-50 border-b border-orange-100 px-6 py-3 flex items-start gap-3">
          <AlertTriangle size={16} className="text-rovya-orange shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[10px] text-orange-800 font-medium leading-tight">
            Demonstração local: preço, cupom, pagamento e solicitação de corrida são apenas simulações.
          </p>
        </div>


      <main className="flex-1 flex flex-col">
        {/* Mapa Esquemático Reduzido */}
        <div className="h-48 bg-slate-200 relative overflow-hidden shrink-0 border-b border-slate-100">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(#111827 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
            aria-hidden="true"
          ></div>

          {/* Rota Mock (Linha pontilhada) */}
          <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
            <path
              d="M 50 150 Q 200 50 350 150"
              fill="none"
              stroke="#F97316"
              strokeWidth="4"
              strokeDasharray="8,8"
              className="animate-[dash_20s_linear_infinite]"
            />
            <circle cx="50" cy="150" r="6" fill="#F97316" />
            <circle cx="350" cy="150" r="6" fill="#2F80ED" />
          </svg>

          <div className="absolute top-2 right-6">
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500 bg-white/80 px-2 py-1 rounded-full">
              Trajeto ilustrativo — nenhum GPS foi acessado
            </span>
          </div>

          <div className="absolute bottom-4 left-6 right-6 flex justify-between">
            <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2">
              <Clock size={12} className="text-rovya-orange" aria-hidden="true" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {duration} min
              </span>
            </div>
            <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2">
              <MapPin size={12} className="text-rovya-blue" aria-hidden="true" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {distance} km
              </span>
            </div>
          </div>
        </div>

        {/* Informações da Corrida */}
        <div className="p-6 space-y-6">
          {/* Resumo de Endereços */}
          <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <div
                className="w-2 h-2 rounded-full bg-rovya-orange shrink-0"
                aria-hidden="true"
              ></div>
              <p className="text-[10px] font-medium text-slate-500 truncate">
                Centro, Jacarezinho
              </p>
            </div>
            <div
              className="h-4 border-l-2 border-dashed border-slate-100 ml-1"
              aria-hidden="true"
            ></div>
            <div className="flex items-center gap-4">
              <MapPin
                size={14}
                className="text-rovya-blue shrink-0"
                aria-hidden="true"
              />
              <p className="text-[10px] font-black uppercase tracking-widest text-navy truncate">
                Centro, Jacarezinho
              </p>
            </div>
          </div>


          {/* Seleção de Pagamento */}
          <section className="space-y-3" aria-labelledby="payment-title">
            <h2
              id="payment-title"
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"
            >
              Pagamento Demonstrativo
            </h2>
            <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby="payment-title">
              <PaymentButton
                active={paymentMethod === "cash"}
                onClick={() => setPaymentMethod("cash")}
                icon={<Banknote size={18} aria-hidden="true" />}
                label="Dinheiro"
              />
              <PaymentButton
                active={paymentMethod === "pix"}
                onClick={() => setPaymentMethod("pix")}
                icon={<QrCode size={18} aria-hidden="true" />}
                label="Pix"
              />
              <PaymentButton
                active={paymentMethod === "card"}
                onClick={() => setPaymentMethod("card")}
                icon={<CreditCard size={18} aria-hidden="true" />}
                label="Cartão"
              />
            </div>
            <p className="text-[9px] text-slate-400 font-medium italic px-1">
              * Demonstração: nenhuma transação, cobrança ou acesso a dados financeiros ocorre.
            </p>
          </section>


          {/* Cupom de Desconto */}
          <section className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div
              className="h-10 w-10 bg-orange-50 rounded-xl flex items-center justify-center text-rovya-orange shrink-0"
              aria-hidden="true"
            >
              <TicketPercent size={22} />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label
                htmlFor="promo-input"
                className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1"
              >
                Cupom demonstrativo
              </label>
              <div className="flex gap-2">
                <input
                  id="promo-input"
                  type="text"
                  placeholder="DEMO5"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={isPromoApplied}
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-rovya-orange focus:ring-1 focus:ring-rovya-orange disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={isPromoApplied || !promoCode}
                  className="px-4 bg-navy text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-navy/90 transition-all disabled:opacity-20 focus-visible:ring-2 focus-visible:ring-rovya-orange outline-none"
                >
                  {isPromoApplied ? (
                    <Check size={14} aria-hidden="true" />
                  ) : (
                    "Aplicar"
                  )}
                </button>
              </div>
            </div>
          </section>
        </div>


        {/* Bottom Bar / Preço */}
        <div className="mt-auto bg-white border-t border-slate-100 p-8 rounded-t-[40px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] space-y-6">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <div 
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-navy transition-colors"
              >
                Preço Final
                {isDetailsOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
              </div>
              <div className="text-3xl font-black text-navy tracking-tighter italic">
                R$ {finalPrice.toFixed(2).replace('.', ',')}
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-rovya-green rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                <ShieldCheck size={12} />
                Preço Fixo
              </div>
              {isPromoApplied && (
                <span className="text-[9px] font-bold text-rovya-orange uppercase tracking-widest">- R$ 5,00 cupom</span>
              )}
            </div>
          </div>

          {/* Detalhes da Tarifa (Accordion Simulado) */}
          {isDetailsOpen && (
            <div className="bg-slate-50 rounded-2xl p-4 space-y-2 animate-in slide-in-from-bottom-2 duration-300">
              <DetailRow label="Tarifa Base" value={baseFare} />
              <DetailRow label="Distância (6,8km)" value={distance * pricePerKm} />
              <DetailRow label="Tempo (18min)" value={duration * pricePerMin} />
              <DetailRow label="Alta Demanda (x1.2)" value={subtotal - (baseFare + (distance * pricePerKm) + (duration * pricePerMin))} />
              {isPromoApplied && <DetailRow label="Desconto ROVYA5" value={-5.00} highlight />}
              <div className="pt-2 border-t border-slate-200 mt-2 flex justify-between">
                <span className="text-[9px] font-black uppercase text-navy">Total</span>
                <span className="text-[10px] font-black text-navy">R$ {finalPrice.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <Info size={16} className="text-rovya-blue shrink-0 mt-0.5" />
              <p className="text-[9px] text-blue-700 font-medium leading-relaxed">
                Você escolheu pagar por <span className="font-black uppercase">{
                  paymentMethod === 'cash' ? 'Dinheiro' : 
                  paymentMethod === 'pix' ? 'Pix Direto' : 'Cartão na Máquina'
                }</span>. O valor será cobrado pelo piloto após o desembarque.
              </p>
            </div>

            <button 
              onClick={handleOrder}
              className="w-full h-16 bg-navy text-white rounded-[24px] font-black uppercase tracking-widest text-[12px] flex items-center justify-center gap-3 hover:bg-navy/90 transition-all active:scale-95 rovya-shadow"
            >
              Pedir Rovya
              <ChevronRight size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function PaymentButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 group ${active ? 'bg-white border-rovya-orange shadow-sm text-rovya-orange' : 'bg-slate-50 border-slate-100 text-slate-300 hover:border-slate-200 hover:text-navy'}`}
    >
      <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'text-navy' : 'text-slate-400'}`}>{label}</span>
    </button>
  );
}

function DetailRow({ label, value, highlight }: { label: string, value: number, highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[9px] font-medium text-slate-500 uppercase tracking-widest">{label}</span>
      <span className={`text-[9px] font-bold ${highlight ? 'text-rovya-orange' : 'text-navy'}`}>
        {value < 0 ? '-' : ''} R$ {Math.abs(value).toFixed(2).replace('.', ',')}
      </span>
    </div>
  );
}
