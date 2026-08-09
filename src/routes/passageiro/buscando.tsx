import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Info, 
  ChevronRight, 
  AlertTriangle,
  RotateCcw,
  Search,
  CheckCircle2,
  Bike
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/passageiro/buscando")({
  component: SearchingRideScreen,
});

type SearchStatus = 'searching' | 'expanding' | 'few_drivers' | 'no_drivers' | 'error' | 'accepted';

function SearchingRideScreen() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<SearchStatus>('searching');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Simulação de cronômetro
  useEffect(() => {
    if (status === 'accepted') return;
    
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  // Simulação de transição de estados
  useEffect(() => {
    if (status === 'accepted') return;

    const sequence = setTimeout(() => {
      if (status === 'searching' && elapsedTime >= 15) {
        setStatus('expanding');
      } else if (status === 'expanding' && elapsedTime >= 40) {
        setStatus('few_drivers');
      } else if (status === 'few_drivers' && elapsedTime >= 80) {
        setStatus('no_drivers');
      }
    }, 1000);

    return () => clearTimeout(sequence);
  }, [elapsedTime, status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCancel = () => {
    if (!cancelReason) {
      toast.error("Por favor, selecione um motivo.");
      return;
    }
    
    // Mock de registro de cancelamento sem penalidade (Health da conta não é alterado)
    toast.info("Corrida cancelada. Nenhuma penalidade aplicada.");
    navigate({ to: "/passageiro/inicio" });
  };

  const handleRetry = () => {
    setElapsedTime(0);
    setStatus('searching');
    toast.success("Reiniciando busca...");
  };

  const simulateAccept = () => {
    setStatus('accepted');
    toast.success("Piloto encontrou você!");
    setTimeout(() => {
      // No futuro navegará para a corrida ativa, por enquanto volta para início para manter o fluxo
      navigate({ to: "/passageiro/inicio" });
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy">
      {/* Header com resumo */}
      <header className="bg-white px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 z-50">
        <div className="flex flex-col">
          <h1 className="text-[11px] font-black uppercase tracking-widest italic text-rovya-blue">Buscando Piloto</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{formatTime(elapsedTime)} decorridos</p>
        </div>
        <button 
          onClick={() => setIsCancelDialogOpen(true)}
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <X size={20} />
        </button>
      </header>

      <main className="flex-1 flex flex-col p-6 space-y-6">
        {/* Mapa Esquemático Animado */}
        <div className="h-64 bg-slate-100 rounded-[40px] relative overflow-hidden border border-slate-200 shadow-inner">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#111827 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          
          {/* Pulso de Busca */}
          <div className="absolute inset-0 flex items-center justify-center">
            {status !== 'no_drivers' && status !== 'error' && status !== 'accepted' && (
              <>
                <div className="absolute h-32 w-32 border-2 border-rovya-blue rounded-full animate-ping opacity-20"></div>
                <div className="absolute h-48 w-48 border border-rovya-blue rounded-full animate-ping opacity-10 delay-700"></div>
                <div className="absolute h-64 w-64 border border-rovya-blue rounded-full animate-ping opacity-5 delay-1000"></div>
              </>
            )}
            
            {/* Ícone Central (Passageiro) */}
            <div className="relative z-10 h-12 w-12 bg-white rounded-2xl shadow-xl flex items-center justify-center border-2 border-rovya-blue">
              <div className="h-4 w-4 bg-rovya-blue rounded-full animate-pulse"></div>
            </div>

            {/* Pilotos Próximos Fictícios (Apenas visuais) */}
            {status === 'searching' || status === 'expanding' || status === 'few_drivers' ? (
               <>
                 <div className="absolute top-12 left-20 animate-bounce delay-100 opacity-40"><Bike size={20} className="text-slate-400 rotate-12" /></div>
                 <div className="absolute bottom-16 right-16 animate-pulse delay-500 opacity-60"><Bike size={20} className="text-slate-500 -rotate-45" /></div>
                 {status === 'expanding' && (
                   <div className="absolute top-40 left-10 animate-pulse delay-300 opacity-30"><Bike size={20} className="text-slate-300 rotate-90" /></div>
                 )}
               </>
            ) : null}

            {status === 'accepted' && (
              <div className="absolute top-10 right-20 animate-in zoom-in-50 duration-500">
                 <div className="bg-navy p-3 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-rovya-orange">
                   <Bike className="text-rovya-orange" size={24} />
                   <div className="flex flex-col pr-2">
                     <span className="text-[10px] font-black text-white uppercase italic">Piloto a caminho</span>
                     <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Honda CG • 2 min</span>
                   </div>
                 </div>
              </div>
            )}
          </div>

          {/* Overlay de Status */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-white shadow-lg flex items-center gap-4">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                status === 'error' || status === 'no_drivers' ? 'bg-red-50 text-red-500' : 
                status === 'accepted' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-rovya-blue'
              }`}>
                {status === 'searching' && <Search size={20} className="animate-pulse" />}
                {status === 'expanding' && <Search size={20} className="animate-spin-slow" />}
                {status === 'few_drivers' && <AlertTriangle size={20} />}
                {status === 'no_drivers' && <AlertTriangle size={20} />}
                {status === 'accepted' && <CheckCircle2 size={20} />}
              </div>
              <div className="flex-1">
                <h3 className="text-[11px] font-black uppercase tracking-tight">
                  {status === 'searching' && "Procurando pilotos..."}
                  {status === 'expanding' && "Ampliando raio de busca..."}
                  {status === 'few_drivers' && "Pouca oferta na região"}
                  {status === 'no_drivers' && "Nenhum piloto encontrado"}
                  {status === 'accepted' && "Piloto Confirmado!"}
                </h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  {status === 'searching' && "Buscando o melhor piloto para você"}
                  {status === 'expanding' && "Verificando pilotos em bairros vizinhos"}
                  {status === 'few_drivers' && "Aguardando disponibilidade de pilotos"}
                  {status === 'no_drivers' && "Tente novamente em alguns instantes"}
                  {status === 'accepted' && "Carlos Henrique aceitou sua corrida"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo da Corrida */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-rovya-blue">
                <Bike size={18} />
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-tight">Rovya Moto</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">Preço Fixo • R$ 10,00</span>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-lg font-black italic text-navy tracking-tighter">R$ 10,00</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase">Pix Direto</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rovya-orange"></div>
              <p className="text-[10px] font-medium text-slate-500 truncate">Av. Getúlio Vargas, 890</p>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={12} className="text-rovya-blue" />
              <p className="text-[10px] font-black uppercase tracking-widest text-navy truncate">Shopping Jacarezinho</p>
            </div>
          </div>
        </div>

        {/* Mensagem de Segurança */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
          <ShieldCheck size={18} className="text-rovya-blue shrink-0" />
          <p className="text-[9px] text-blue-800 font-medium leading-relaxed">
            Sua segurança é nossa prioridade. Mantenha o app aberto para agilizar o encontro com o piloto.
          </p>
        </div>

        {/* Controles do Simulador (Apenas para teste) */}
        <div className="mt-auto pt-6 border-t border-slate-100">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-center mb-4 italic">Controles do Simulador</p>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="rounded-xl text-[10px] font-black uppercase h-12"
              onClick={simulateAccept}
              disabled={status === 'accepted'}
            >
              Simular Aceite
            </Button>
            {status === 'no_drivers' && (
              <Button 
                variant="default" 
                className="bg-navy rounded-xl text-[10px] font-black uppercase h-12 gap-2"
                onClick={handleRetry}
              >
                <RotateCcw size={14} />
                Tentar Novamente
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* Dialog de Cancelamento */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent className="rounded-[32px] p-8 max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black italic uppercase tracking-tight text-navy">Cancelar Solicitação?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 leading-relaxed pt-2">
              Não há penalidades por cancelar enquanto buscamos um piloto. Por que você deseja cancelar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-6">
            <RadioGroup value={cancelReason} onValueChange={setCancelReason} className="space-y-3">
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
                <RadioGroupItem value="too_long" id="too_long" className="text-rovya-orange border-slate-300" />
                <Label htmlFor="too_long" className="flex-1 text-[11px] font-bold uppercase tracking-wider text-navy cursor-pointer">Demora excessiva</Label>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
                <RadioGroupItem value="mistake" id="mistake" className="text-rovya-orange border-slate-300" />
                <Label htmlFor="mistake" className="flex-1 text-[11px] font-bold uppercase tracking-wider text-navy cursor-pointer">Pedi por engano</Label>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
                <RadioGroupItem value="other_app" id="other_app" className="text-rovya-orange border-slate-300" />
                <Label htmlFor="other_app" className="flex-1 text-[11px] font-bold uppercase tracking-wider text-navy cursor-pointer">Consegui outro transporte</Label>
              </div>
            </RadioGroup>
          </div>

          <AlertDialogFooter className="flex-col sm:flex-row gap-3">
            <AlertDialogCancel className="rounded-2xl h-14 text-[11px] font-black uppercase border-slate-200 mt-0">Manter Busca</AlertDialogCancel>
            <button 
              onClick={handleCancel}
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
