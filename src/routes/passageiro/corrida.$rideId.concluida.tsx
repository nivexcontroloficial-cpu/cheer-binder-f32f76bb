import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { 
  CheckCircle2, 
  Star, 
  MapPin, 
  Clock, 
  Navigation, 
  CreditCard, 
  Wallet, 
  Info,
  ChevronRight,
  RefreshCw,
  Home,
  AlertTriangle,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDemo } from "@/state/DemoContext";
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

export const Route = createFileRoute("/passageiro/corrida/$rideId/concluida")({
  component: RideCompletedScreen,
});

function RideCompletedScreen() {
  const { rideId } = useParams({ from: '/passageiro/corrida/$rideId/concluida' });
  const navigate = useNavigate();
  const { addRideToHistory } = useDemo();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isConfirmPaymentDialogOpen, setIsConfirmPaymentDialogOpen] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // Dados Mock Obrigatórios RY-2026-00842
  const rideSummary = {
    id: "RY-2026-00842",
    origin: "Rua das Flores, 120",
    destination: "Rua das Orquídeas, 452",
    distance: "4.2 km",
    duration: "12 min",
    fare: 18.00,
    paymentMethod: "Pix Direto",
    pilot: {
      name: "Carlos H.",
      avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
      vehicle: "Honda CG 160 (ABC1D23)"
    }
  };

  const tags = ["Educado", "Direção Segura", "Moto Limpa", "Rápido", "Comunicativo"];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleFinish = () => {
    if (!paymentConfirmed) {
      setIsConfirmPaymentDialogOpen(true);
      return;
    }

    // Salva no histórico simulado
    addRideToHistory({
      id: rideSummary.id,
      origin: { address: rideSummary.origin, lat: 0, lng: 0 },
      destination: { address: rideSummary.destination, lat: 0, lng: 0 },
      status: 'completed',
      fare: rideSummary.fare,
      distance: 4.2,
      duration: 12,
      requestedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      driverId: "d1"
    });

    toast.success("Obrigado pela sua avaliação!");
    navigate({ to: "/passageiro/inicio" });
  };

  const confirmPayment = () => {
    setPaymentConfirmed(true);
    setIsConfirmPaymentDialogOpen(false);
    toast.success("Pagamento confirmado!");
  };

  return (
    <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy pb-10">
      {/* Header Sucesso */}
      <div className="bg-navy pt-16 pb-12 px-8 rounded-b-[48px] text-white flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>

        <div className="bg-emerald-500 p-4 rounded-3xl mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-in zoom-in duration-700">
          <CheckCircle2 size={40} strokeWidth={2.5} />
        </div>
        
        <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Chegamos!</h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Corrida #{rideSummary.id}</p>
      </div>

      <div className="px-6 -mt-8 space-y-6 relative z-10">
        {/* Card de Pagamento Presencial */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Valor a Pagar</span>
              <span className="text-3xl font-black italic tracking-tighter text-navy">R$ {rideSummary.fare.toFixed(2)}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Método</span>
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 mt-1">
                <Wallet size={14} className="text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-tight text-blue-700">{rideSummary.paymentMethod}</span>
              </div>
            </div>
          </div>

          {!paymentConfirmed ? (
             <Button 
               onClick={() => setIsConfirmPaymentDialogOpen(true)}
               className="w-full py-7 rounded-2xl bg-navy text-white font-black italic uppercase tracking-widest shadow-lg animate-pulse"
             >
               Paguei ao Piloto
             </Button>
          ) : (
            <div className="w-full py-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center gap-3 text-emerald-700">
              <CheckCircle2 size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Pagamento Confirmado</span>
            </div>
          )}

          <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3">
            <Info size={16} className="text-blue-500 shrink-0" />
            <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
              Pagamento realizado diretamente ao Carlos H. através de Pix. A Rovya não processou este valor.
            </p>
          </div>
        </div>

        {/* Avaliação */}
        <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 flex flex-col items-center">
          <h2 className="text-sm font-black italic uppercase tracking-tight text-navy mb-1">Como foi sua viagem?</h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-6">Avalie o Carlos H.</p>
          
          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform active:scale-90"
              >
                <Star 
                  size={40} 
                  fill={(hoverRating || rating) >= star ? "#F97316" : "none"} 
                  className={(hoverRating || rating) >= star ? "text-rovya-orange" : "text-slate-200"}
                  strokeWidth={2}
                />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-wrap justify-center gap-2">
                {tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      selectedTags.includes(tag) 
                        ? 'bg-navy text-white' 
                        : 'bg-slate-50 text-slate-400 border border-slate-100'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <textarea 
                placeholder="Algum comentário adicional? (Opcional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full min-h-[100px] bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-medium placeholder:text-slate-300 focus:ring-navy focus:border-navy"
              />
            </div>
          )}
        </div>

        {/* Resumo e Recibo */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-navy">Detalhes da Rota</h3>
             <div className="flex items-center gap-2 text-slate-400">
               <FileText size={14} />
               <span className="text-[9px] font-bold uppercase tracking-widest">Recibo de Demonstração</span>
             </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <MapPin size={12} className="text-emerald-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Origem</span>
                <span className="text-[11px] font-bold text-navy truncate">{rideSummary.origin}</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <MapPin size={12} className="text-blue-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Destino</span>
                <span className="text-[11px] font-bold text-navy truncate">{rideSummary.destination}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Distância</span>
              <div className="flex items-center gap-2 text-navy">
                <Navigation size={14} className="rotate-45" fill="currentColor" />
                <span className="text-xs font-black italic">{rideSummary.distance}</span>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Duração</span>
              <div className="flex items-center gap-2 text-navy">
                <Clock size={14} />
                <span className="text-xs font-black italic">{rideSummary.duration}</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
             <p className="text-[9px] text-amber-700 font-bold leading-tight text-center">
               ESTE DOCUMENTO NÃO POSSUI VALOR FISCAL. É APENAS UM RESUMO PARA FINS DE DEMONSTRAÇÃO DO APLICATIVO ROVYA.
             </p>
          </div>
        </div>

        {/* Ações Finais */}
        <div className="flex flex-col gap-3">
          <Button 
            onClick={handleFinish}
            className="w-full py-7 rounded-2xl bg-navy text-white font-black italic uppercase tracking-widest shadow-xl"
          >
            Concluir
            <ArrowRight size={18} className="ml-2" />
          </Button>

          <div className="flex gap-2">
             <button 
               onClick={() => navigate({ to: "/passageiro/destino" })}
               className="flex-1 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-navy flex items-center justify-center gap-2"
             >
               <RefreshCw size={14} />
               Repetir Rota
             </button>
             <button 
               onClick={() => navigate({ to: "/passageiro/inicio" })}
               className="flex-1 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-navy flex items-center justify-center gap-2"
             >
               <Home size={14} />
               Voltar ao Início
             </button>
          </div>

          <button 
            onClick={() => setIsReportDialogOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-4 text-red-500 text-[10px] font-black uppercase tracking-widest"
          >
            <ShieldAlert size={16} />
            Reportar Problema ou Denúncia
          </button>
        </div>
      </div>

      {/* Dialog de Confirmação de Pagamento */}
      <AlertDialog open={isConfirmPaymentDialogOpen} onOpenChange={setIsConfirmPaymentDialogOpen}>
        <AlertDialogContent className="rounded-[32px] p-8 max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black italic uppercase tracking-tight text-navy">Confirmar Pagamento?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 leading-relaxed pt-2">
              Ao confirmar, você declara que pagou o valor de <span className="text-navy font-bold italic">R$ {rideSummary.fare.toFixed(2)}</span> diretamente ao piloto Carlos H. via {rideSummary.paymentMethod}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
              <Info size={16} className="text-blue-600 shrink-0" />
              <p className="text-[10px] text-blue-700 font-bold leading-relaxed">
                Esta ação é irreversível e serve como comprovante de encerramento da viagem para o sistema.
              </p>
            </div>
          </div>

          <AlertDialogFooter className="flex-col gap-2">
            <AlertDialogAction 
              onClick={confirmPayment}
              className="w-full py-6 rounded-2xl bg-navy text-white font-black italic uppercase tracking-widest border-none"
            >
              Sim, Paguei agora
            </AlertDialogAction>
            <AlertDialogCancel className="w-full py-6 rounded-2xl border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Ainda não paguei
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de Denúncia */}
      <AlertDialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <AlertDialogContent className="rounded-[32px] p-8 max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black italic uppercase tracking-tight text-red-600 flex items-center gap-2">
              <ShieldAlert size={24} />
              Central de Denúncias
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 leading-relaxed pt-2">
              Sua segurança é nossa prioridade. Relate qualquer incidente grave ou comportamento inadequado do piloto.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4 space-y-4">
             <div className="grid grid-cols-1 gap-2">
               {["Assédio / Comportamento Inadequado", "Direção Perigosa", "Cobrança Indevida", "Outros Incidentes"].map(reason => (
                 <button 
                   key={reason}
                   onClick={() => {
                     toast.warning("Sua denúncia foi registrada. A equipe de segurança analisará o caso.");
                     setIsReportDialogOpen(false);
                   }}
                   className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-navy text-left hover:bg-red-50 hover:text-red-600 transition-colors"
                 >
                   {reason}
                 </button>
               ))}
             </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="w-full py-6 rounded-2xl border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Cancelar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
