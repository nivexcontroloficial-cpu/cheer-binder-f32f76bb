import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  Shield, 
  Share2, 
  Navigation, 
  Signal, 
  SignalLow, 
  WifiOff, 
  AlertTriangle,
  Clock,
  ArrowRight,
  ChevronUp,
  MapPin,
  CheckCircle2,
  Info,
  Edit2,
  Check,
  X,
  ShieldCheck,
  AlertCircle
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
} from "@/components/ui/alert-dialog";
import { useDemo } from "@/state/DemoContext";

export const Route = createFileRoute("/passageiro/corrida/$rideId/em-andamento")({
  component: InProgressRideScreen,
});

type ConnectionStatus = 'stable' | 'unstable' | 'stopped' | 'reconnecting';

function InProgressRideScreen() {
  const { rideId } = useParams({ from: '/passageiro/corrida/$rideId/em-andamento' });
  const navigate = useNavigate();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [connection, setConnection] = useState<ConnectionStatus>('stable');
  const [eta, setEta] = useState(8);
  const [progress, setProgress] = useState(0); 
  const [isDeviationAlertOpen, setIsDeviationAlertOpen] = useState(false);
  const [isChangeDestDialogOpen, setIsChangeDestDialogOpen] = useState(false);
  const [newDestInput, setNewDestInput] = useState("");
  const [confirmNewPrice, setConfirmNewPrice] = useState(false);
  const [currentFare, setCurrentFare] = useState(15.50);
  const [newFare, setNewFare] = useState(22.80);
  const [isFinished, setIsFinished] = useState(false);

  const pilot = {
    name: "Carlos H.",
    rating: 4.96,
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
    vehicle: {
      model: "Honda CG 160",
      plate: "ABC1D23"
    }
  };

  // Simulação de movimento e eventos
  useEffect(() => {
    const interval = setInterval(() => {
      if (connection !== 'reconnecting' && connection !== 'stopped') {
        setProgress(prev => {
          if (prev >= 100) {
            setIsFinished(true);
            return 100;
          }
          return prev + 0.5;
        });
        
        // Atualiza ETA
        if (progress > 15 && eta === 8) setEta(7);
        if (progress > 30 && eta === 7) setEta(6);
        if (progress > 45 && eta === 6) setEta(5);
        if (progress > 60 && eta === 5) setEta(3);
        if (progress > 75 && eta === 3) setEta(2);
        if (progress > 90 && eta === 2) setEta(1);

        // Detecta desvio simulado aos 20%
        if (Math.abs(progress - 20) < 0.3 && !isDeviationAlertOpen) {
          setIsDeviationAlertOpen(true);
        }
      }

      // Oscilação de sinal
      const rand = Math.random();
      if (rand > 0.98) setConnection('reconnecting');
      else if (rand > 0.95) setConnection('unstable');
      else if (rand < 0.20) setConnection('stable');

    }, 2000);

    return () => clearInterval(interval);
  }, [progress, connection, eta, isDeviationAlertOpen]);

  const handleFinishRide = () => {
    toast.success("Corrida finalizada com sucesso!");
    navigate({ to: "/passageiro/inicio" });
  };

  const handleSafety = () => {
    navigate({ to: "/passageiro/seguranca" });
  };

  const handleChangeDestination = () => {
    if (!newDestInput.trim()) {
      toast.error("Informe o novo destino.");
      return;
    }
    setConfirmNewPrice(true);
  };

  const applyNewDestination = () => {
    setCurrentFare(newFare);
    setConfirmNewPrice(false);
    setIsChangeDestDialogOpen(false);
    setNewDestInput("");
    toast.success("Destino alterado! O piloto foi notificado da nova rota.");
  };

  return (
    <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy overflow-hidden">
      {/* Mapa Esquemático */}
      <div className="absolute inset-0 bg-slate-100 z-0">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#111827 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        <svg className="absolute inset-0 w-full h-full">
           <path 
             d="M 50 100 L 200 300 L 350 150 L 500 400" 
             fill="none" 
             stroke="#E2E8F0" 
             strokeWidth="8" 
             strokeLinecap="round"
           />
           <path 
             d="M 50 100 L 200 300 L 350 150 L 500 400" 
             fill="none" 
             stroke="#2F80ED" 
             strokeWidth="8" 
             strokeLinecap="round"
             strokeDasharray="600"
             strokeDashoffset={600 - (progress * 6)}
             className="transition-all duration-1000 ease-linear"
           />
           
           {/* Marcador Viagem */}
           <g 
             transform={`translate(${50 + (progress * 4.5)}, ${100 + (progress * 3)})`}
             className="transition-all duration-1000 ease-linear"
           >
             <circle r="20" fill="white" className="shadow-lg" />
             <circle r="18" fill="#F97316" />
             <foreignObject x="-10" y="-10" width="20" height="20">
               <Navigation size={20} className="text-white rotate-45" fill="currentColor" />
             </foreignObject>
           </g>

           {/* Destino Final */}
           <g transform="translate(500, 400)">
             <circle r="8" fill="#2F80ED" className="animate-ping opacity-20" />
             <circle r="4" fill="#2F80ED" />
           </g>
        </svg>

        {/* HUD Topo */}
        <div className="absolute top-16 left-6 right-6 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
             {/* Conexão */}
             <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-100 shadow-sm flex items-center gap-2">
                {connection === 'stable' && <Signal size={12} className="text-emerald-500" />}
                {connection === 'unstable' && <SignalLow size={12} className="text-amber-500" />}
                {connection === 'reconnecting' && <WifiOff size={12} className="text-red-500 animate-pulse" />}
                <span className="text-[9px] font-black uppercase tracking-widest text-navy">
                  {connection === 'stable' && "GPS estável"}
                  {connection === 'unstable' && "GPS fraco"}
                  {connection === 'reconnecting' && "Reconectando..."}
                </span>
             </div>

             {/* Preço Fixo */}
             <div className="bg-navy text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2">
               <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Total</span>
               <span className="text-sm font-black italic tracking-tighter">R$ {currentFare.toFixed(2)}</span>
             </div>
          </div>

          {/* Destino e ETA */}
          <div className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                 <MapPin size={20} />
               </div>
               <div className="flex flex-col">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Destino</span>
                 <span className="text-[11px] font-black uppercase italic tracking-tighter text-navy truncate max-w-[150px]">Rua das Orquídeas, 452</span>
               </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ETA</span>
              <span className="text-lg font-black italic tracking-tighter text-blue-600 leading-none">{eta} min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interface Inferior */}
      <div className="mt-auto z-10 p-6 space-y-4">
        {/* Painel de Controle Flutuante */}
        <div className="bg-white rounded-[40px] shadow-2xl p-6 border border-slate-100 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="relative">
                 <img 
                   src={pilot.avatar} 
                   alt={pilot.name}
                   className="h-14 w-14 rounded-2xl object-cover border-2 border-slate-50"
                 />
                 <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg border border-slate-100 shadow-sm">
                   <ShieldCheck size={10} className="text-blue-500" />
                 </div>
               </div>
               <div className="flex flex-col">
                 <h2 className="text-lg font-black italic tracking-tighter text-navy uppercase leading-none">{pilot.name}</h2>
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{pilot.vehicle.model} • {pilot.vehicle.plate}</span>
               </div>
            </div>
            <button 
              onClick={handleSafety}
              className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm active:scale-95 transition-all"
            >
              <Shield size={22} strokeWidth={2.5} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button 
               onClick={() => setIsChangeDestDialogOpen(true)}
               className="flex items-center justify-center gap-2 py-4 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest text-navy hover:bg-slate-100 transition-all active:scale-[0.98]"
             >
               <Edit2 size={14} />
               Alterar Destino
             </button>
             <button 
               onClick={() => toast.info("Compartilhando link de rastreamento...")}
               className="flex items-center justify-center gap-2 py-4 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest text-navy hover:bg-slate-100 transition-all active:scale-[0.98]"
             >
               <Share2 size={14} />
               Compartilhar
             </button>
          </div>

          <Button 
            disabled={!isFinished}
            onClick={handleFinishRide}
            className={`w-full py-7 rounded-2xl font-black italic uppercase tracking-widest shadow-xl transition-all ${isFinished ? 'bg-navy text-white animate-bounce' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          >
            {isFinished ? 'Encerramento Seguro' : 'Em Andamento...'}
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>

        {/* Reportar Problema */}
        <button className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
           <AlertCircle size={14} />
           Reportar Problema
        </button>
      </div>

      {/* Dialog Desvio de Rota */}
      <AlertDialog open={isDeviationAlertOpen} onOpenChange={setIsDeviationAlertOpen}>
        <AlertDialogContent className="rounded-[32px] p-8 max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black italic uppercase tracking-tight text-amber-600 flex items-center gap-2">
              <Shield size={24} />
              Está tudo bem?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 font-medium leading-relaxed pt-2">
              Detectamos que o piloto saiu da rota prevista. Você está se sentindo seguro?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 mt-4">
            <AlertDialogAction 
              onClick={() => {
                toast.success("Obrigado pelo aviso. Continuamos monitorando.");
                setIsDeviationAlertOpen(false);
              }}
              className="w-full py-6 rounded-2xl bg-navy text-white font-black italic uppercase tracking-widest border-none"
            >
              Sim, o caminho é este
            </AlertDialogAction>
            <button 
              onClick={() => {
                toast.warning("Central de Segurança acionada. Aguarde contato.");
                setIsDeviationAlertOpen(false);
              }}
              className="w-full py-6 rounded-2xl bg-red-50 text-red-600 font-black italic uppercase tracking-widest border border-red-100"
            >
              Não, quero suporte agora
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Alterar Destino */}
      <AlertDialog open={isChangeDestDialogOpen} onOpenChange={setIsChangeDestDialogOpen}>
        <AlertDialogContent className="rounded-[32px] p-8 max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black italic uppercase tracking-tight text-navy">Alterar Destino?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 font-medium leading-relaxed pt-2">
              Informe o novo endereço. O valor da corrida será recalculado automaticamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
             {!confirmNewPrice ? (
               <div className="space-y-4">
                 <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
                   <MapPin size={18} className="text-blue-500" />
                   <input 
                     type="text" 
                     placeholder="Novo endereço..."
                     value={newDestInput}
                     onChange={(e) => setNewDestInput(e.target.value)}
                     className="bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-slate-300 w-full"
                   />
                 </div>
                 <Button 
                   onClick={handleChangeDestination}
                   className="w-full py-6 rounded-2xl bg-navy text-white font-black italic uppercase tracking-widest"
                 >
                   Ver Novo Preço
                 </Button>
               </div>
             ) : (
               <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                  <div className="flex justify-between items-center p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                     <div className="flex flex-col gap-1">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest line-through">De R$ {currentFare.toFixed(2)}</span>
                       <span className="text-2xl font-black italic tracking-tighter text-navy uppercase">Para R$ {newFare.toFixed(2)}</span>
                     </div>
                     <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                        <Check size={20} strokeWidth={3} />
                     </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                    <Info size={16} className="text-blue-600 shrink-0" />
                    <p className="text-[10px] text-blue-700 font-medium leading-relaxed">
                      A alteração será aplicada assim que você confirmar. O piloto receberá o novo trajeto no app dele.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={applyNewDestination}
                      className="w-full py-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black italic uppercase tracking-widest border-none"
                    >
                      Confirmar Alteração
                    </Button>
                    <button 
                      onClick={() => setConfirmNewPrice(false)}
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-2"
                    >
                      Voltar
                    </button>
                  </div>
               </div>
             )}
          </div>

          {!confirmNewPrice && (
            <AlertDialogFooter>
              <AlertDialogCancel className="w-full py-6 rounded-2xl border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Cancelar
              </AlertDialogCancel>
            </AlertDialogFooter>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}