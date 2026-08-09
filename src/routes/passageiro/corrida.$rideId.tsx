import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useRef } from "react";
import { 
  ArrowLeft, 
  MessageSquare, 
  Phone, 
  ShieldCheck, 
  Share2, 
  AlertTriangle,
  Clock,
  Navigation,
  Signal,
  SignalLow,
  WifiOff,
  Star,
  ChevronUp,
  ChevronDown,
  Info,
  MapPin,
  X,
  CheckCircle2,
  Lock,
  MessageCircle,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/passageiro/corrida/$rideId")({
  component: ActiveRideScreen,
});

type ConnectionStatus = 'stable' | 'unstable' | 'stopped' | 'reconnecting';

function ActiveRideScreen() {
  const { rideId } = useParams({ from: '/passageiro/corrida/$rideId' });
  const navigate = useNavigate();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [connection, setConnection] = useState<ConnectionStatus>('stable');
  const [eta, setEta] = useState(4);
  const [progress, setProgress] = useState(0); // 0 a 100
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Dados Mock Obrigatórios do Piloto
  const pilot = {
    name: "Carlos H.",
    rating: 4.96,
    totalRides: 842,
    timeAtRovya: "1 ano",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
    badges: ["Top Piloto", "Seguro"],
    vehicle: {
      model: "Honda CG 160",
      color: "Vermelha",
      plate: "ABC1D23"
    }
  };

  // Simulação de movimento e conexão
  useEffect(() => {
    const interval = setInterval(() => {
      // Movimento simulado
      if (connection !== 'reconnecting' && connection !== 'stopped') {
        setProgress(prev => {
          if (prev >= 100) return 100;
          return prev + 0.5;
        });
        
        // Atualiza ETA conforme progride
        if (progress > 25 && eta === 4) setEta(3);
        if (progress > 50 && eta === 3) setEta(2);
        if (progress > 75 && eta === 2) setEta(1);
        if (progress >= 95 && eta === 1) setEta(0);
      }

      // Simulação de oscilação de sinal (aleatória)
      const rand = Math.random();
      if (rand > 0.95) setConnection('reconnecting');
      else if (rand > 0.90) setConnection('unstable');
      else if (rand > 0.85) setConnection('stopped');
      else if (rand < 0.20) setConnection('stable');

    }, 2000);

    return () => clearInterval(interval);
  }, [progress, connection, eta]);

  const handleCall = () => {
    toast.info("Iniciando chamada protegida Rovya...");
  };

  const handleChat = () => {
    toast.info("Abrindo chat com Carlos H...");
  };

  const handleShare = () => {
    toast.success("Link de rastreamento copiado para compartilhar!");
  };

  const handleSafety = () => {
    toast.warning("Central de Segurança ativada. Monitorando sua rota.");
  };

  const handleCancelRide = () => {
    if (!cancelReason) {
      toast.error("Selecione um motivo para o cancelamento.");
      return;
    }
    toast.error("Corrida cancelada. Lembre-se: cancelamentos frequentes afetam sua pontuação.");
    navigate({ to: "/passageiro/inicio" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy overflow-hidden">
      {/* Mapa Esquemático de Fundo (Tela Cheia) */}
      <div className="absolute inset-0 bg-slate-100 z-0">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#111827 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        {/* Rota Animada */}
        <svg className="absolute inset-0 w-full h-full">
           <path 
             d="M 100 200 L 250 400 L 400 300" 
             fill="none" 
             stroke="#E2E8F0" 
             strokeWidth="8" 
             strokeLinecap="round"
           />
           <path 
             d="M 100 200 L 250 400 L 400 300" 
             fill="none" 
             stroke="#2F80ED" 
             strokeWidth="8" 
             strokeLinecap="round"
             strokeDasharray="400"
             strokeDashoffset={400 - (progress * 4)}
             className="transition-all duration-1000 ease-linear"
           />
           
           {/* Marcador do Piloto (Moto) */}
           <g 
             transform={`translate(${100 + (progress * 3)}, ${200 + (progress * 1)})`}
             className="transition-all duration-1000 ease-linear"
           >
             <circle r="20" fill="white" className="shadow-lg" />
             <circle r="18" fill="#F97316" className={connection === 'reconnecting' ? 'animate-pulse opacity-50' : ''} />
             <foreignObject x="-10" y="-10" width="20" height="20">
               <Navigation size={20} className="text-white rotate-45" fill="currentColor" />
             </foreignObject>
           </g>

           {/* Marcador de Embarque (Destino do Piloto agora) */}
           <g transform="translate(400, 300)">
             <circle r="8" fill="#2F80ED" className="animate-ping opacity-20" />
             <circle r="4" fill="#2F80ED" />
           </g>
        </svg>

        {/* Indicadores Flutuantes no Mapa */}
        <div className="absolute top-16 left-6 right-6 flex flex-col gap-3">
          {/* Status de Conexão */}
          <div className="self-start bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-100 shadow-sm flex items-center gap-2">
            {connection === 'stable' && <Signal size={12} className="text-emerald-500" />}
            {connection === 'unstable' && <SignalLow size={12} className="text-amber-500" />}
            {connection === 'stopped' && <AlertTriangle size={12} className="text-amber-500" />}
            {connection === 'reconnecting' && <WifiOff size={12} className="text-red-500 animate-pulse" />}
            <span className="text-[9px] font-black uppercase tracking-widest text-navy">
              {connection === 'stable' && "GPS estável"}
              {connection === 'unstable' && "GPS instável"}
              {connection === 'stopped' && "Piloto parado"}
              {connection === 'reconnecting' && "Reconectando..."}
            </span>
          </div>

          {/* Card de ETA */}
          <div className="bg-navy text-white px-5 py-3 rounded-2xl shadow-xl self-start flex items-center gap-4">
             <div className="flex flex-col">
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Chegada em</span>
               <span className="text-xl font-black italic tracking-tighter">{eta > 0 ? `${eta} min` : 'Chegando!'}</span>
             </div>
             <div className="h-8 w-px bg-white/10"></div>
             <div className="flex flex-col">
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Ponto</span>
               <span className="text-[10px] font-black uppercase tracking-tight truncate max-w-[120px]">Av. Getúlio Vargas</span>
             </div>
          </div>
        </div>
      </div>

      {/* Interface Inferior Interativa */}
      <div className="mt-auto z-10">
        <div className={`bg-white rounded-t-[40px] shadow-[0_-20px_40px_rgba(0,0,0,0.1)] transition-all duration-500 border-t border-slate-100 ${isDetailsOpen ? 'h-[80vh]' : 'h-auto'}`}>
          {/* Handle de expansão */}
          <div 
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className="w-full flex justify-center py-4 cursor-pointer"
          >
            <div className="w-12 h-1.5 bg-slate-100 rounded-full"></div>
          </div>

          <div className="px-8 pb-8 space-y-6">
            {/* Informações Resumidas do Piloto */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={pilot.avatar} 
                    alt={pilot.name}
                    className="h-16 w-16 rounded-[22px] object-cover border-2 border-slate-50 shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg shadow-sm border border-slate-100">
                    <Star size={10} fill="#F97316" className="text-rovya-orange" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black italic tracking-tighter text-navy">{pilot.name}</h2>
                    <span className="text-xs font-bold text-rovya-orange flex items-center gap-0.5">
                      {pilot.rating}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {pilot.totalRides} Corridas • {pilot.timeAtRovya}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={handleChat}
                  className="h-12 w-12 bg-slate-50 text-navy rounded-2xl flex items-center justify-center border border-slate-100 hover:bg-slate-100 transition-all active:scale-95"
                >
                  <MessageSquare size={20} strokeWidth={2.5} />
                </button>
                <button 
                  onClick={handleCall}
                  className="h-12 w-12 bg-navy text-white rounded-2xl flex items-center justify-center hover:bg-navy/90 transition-all active:scale-95 shadow-md"
                >
                  <Phone size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Veículo e Segurança */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Veículo</span>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-rovya-orange/10 flex items-center justify-center">
                    <Navigation size={12} className="text-rovya-orange rotate-45" fill="currentColor" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-navy uppercase">{pilot.vehicle.model}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{pilot.vehicle.color}</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 relative overflow-hidden">
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Placa Completa</span>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-navy tracking-widest">{pilot.vehicle.plate}</span>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                </div>
                {/* Visual da Placa Mercosul simulado */}
                <div className="absolute top-0 right-0 w-12 h-1 bg-blue-600"></div>
              </div>
            </div>

            {/* Ações Secundárias (Visíveis ou no expansível) */}
            <div className="flex items-center justify-between gap-4 py-2">
               <button 
                 onClick={handleShare}
                 className="flex-1 flex flex-col items-center gap-2 py-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors"
               >
                 <Share2 size={18} className="text-slate-400" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Compartilhar</span>
               </button>
               <button 
                 onClick={handleSafety}
                 className="flex-1 flex flex-col items-center gap-2 py-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors"
               >
                 <ShieldCheck size={18} className="text-rovya-blue" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-navy">Segurança</span>
               </button>
               <button 
                 onClick={() => setIsCancelDialogOpen(true)}
                 className="flex-1 flex flex-col items-center gap-2 py-3 bg-white border border-slate-100 rounded-2xl hover:bg-red-50 transition-colors group"
               >
                 <AlertTriangle size={18} className="text-slate-300 group-hover:text-red-500" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-red-500">Cancelar</span>
               </button>
            </div>

            {/* Área Expansível (Mais Detalhes) */}
            {isDetailsOpen && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 pt-4 border-t border-slate-50">
                 {/* Selos e Conquistas */}
                 <section>
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Conquistas do Piloto</h3>
                   <div className="flex flex-wrap gap-2">
                      {pilot.badges.map(badge => (
                        <div key={badge} className="px-3 py-1.5 bg-orange-50 text-rovya-orange rounded-lg text-[9px] font-black uppercase tracking-widest border border-orange-100 flex items-center gap-2">
                          <Star size={12} fill="currentColor" />
                          {badge}
                        </div>
                      ))}
                      <div className="px-3 py-1.5 bg-blue-50 text-rovya-blue rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100 flex items-center gap-2">
                        <ShieldCheck size={12} fill="currentColor" />
                        Identidade Verificada
                      </div>
                   </div>
                 </section>

                 {/* Resumo Financeiro da Corrida */}
                 <section className="bg-slate-50 rounded-3xl p-6 space-y-4">
                    <div className="flex justify-between items-center">
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-navy">Resumo do Pagamento</h3>
                       <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[8px] font-black uppercase">Presencial</span>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px]">
                          <span className="text-slate-500 font-medium uppercase tracking-widest">Valor da Corrida</span>
                          <span className="font-black text-navy tracking-tight italic">R$ 10,00</span>
                       </div>
                       <div className="flex justify-between text-[10px]">
                          <span className="text-slate-500 font-medium uppercase tracking-widest">Forma Escolhida</span>
                          <span className="font-black text-navy tracking-tight italic">PIX DIRETO AO PILOTO</span>
                       </div>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-slate-100 flex gap-3">
                       <Info size={16} className="text-rovya-blue shrink-0" />
                       <p className="text-[9px] text-slate-500 font-medium leading-relaxed">
                         O valor final é pago diretamente ao Carlos H. no desembarque. A Rovya não retém pagamentos online nesta modalidade.
                       </p>
                    </div>
                 </section>

                 <div className="pt-4">
                    <p className="text-[8px] text-slate-300 font-bold uppercase tracking-[0.2em] text-center leading-relaxed">
                      DADOS PRIVADOS PROTEGIDOS • NENHUM DOCUMENTO SENSÍVEL EXPOSTO
                    </p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog de Cancelamento (Repetido do fluxo de busca, mas com contexto de corrida ativa) */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent className="rounded-[32px] p-8 max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black italic uppercase tracking-tight text-navy">Cancelar Corrida?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 leading-relaxed pt-2">
              O piloto já está a caminho. Cancelamentos frequentes podem resultar em suspensão temporária da sua conta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-6">
            <RadioGroup value={cancelReason} onValueChange={setCancelReason} className="space-y-3">
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
                <RadioGroupItem value="too_long" id="too_long" className="text-rovya-orange border-slate-300" />
                <Label htmlFor="too_long" className="flex-1 text-[11px] font-bold uppercase tracking-wider text-navy cursor-pointer">Piloto não se move</Label>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
                <RadioGroupItem value="mistake" id="mistake" className="text-rovya-orange border-slate-300" />
                <Label htmlFor="mistake" className="flex-1 text-[11px] font-bold uppercase tracking-wider text-navy cursor-pointer">Mudei de ideia</Label>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
                <RadioGroupItem value="unsafe" id="unsafe" className="text-rovya-orange border-slate-300" />
                <Label htmlFor="unsafe" className="flex-1 text-[11px] font-bold uppercase tracking-wider text-navy cursor-pointer">Não me sinto seguro</Label>
              </div>
            </RadioGroup>
          </div>

          <AlertDialogFooter className="flex-col sm:flex-row gap-3">
            <AlertDialogCancel className="rounded-2xl h-14 text-[11px] font-black uppercase border-slate-200 mt-0">Manter Corrida</AlertDialogCancel>
            <button 
              onClick={handleCancelRide}
              className="bg-red-500 text-white rounded-2xl h-14 px-6 text-[11px] font-black uppercase tracking-widest hover:bg-red-600 transition-all flex-1"
            >
              Confirmar Cancelamento
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
