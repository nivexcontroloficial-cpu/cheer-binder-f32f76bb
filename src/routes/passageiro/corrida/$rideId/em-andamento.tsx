import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  Shield, 
  ChevronRight,
  Clock,
  MapPin,
  Navigation,
  ShieldAlert,
  AlertTriangle,
  Star,
  User,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/passageiro/corrida/$rideId/em-andamento")({
  component: InProgressRideScreen,
});

function InProgressRideScreen() {
  const { rideId } = useParams({ from: '/passageiro/corrida/$rideId/em-andamento' });
  const navigate = useNavigate();
  const [progress, setProgress] = useState(35);
  const [eta, setEta] = useState(12);

  // Simulação de progresso
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95;
        return prev + 0.5;
      });
      setEta(prev => {
        if (prev <= 2) return 2;
        return prev > 5 ? prev - 1 : prev;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const pilot = {
    name: "Carlos H.",
    rating: 4.96,
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
    vehicle: "Honda CG 160 • ABC1D23"
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-navy relative overflow-hidden">
      {/* Mapa Esquemático Simplificado */}
      <div className="flex-1 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" 
          style={{ 
            backgroundImage: 'radial-gradient(#111827 1px, transparent 1px)', 
            backgroundSize: '24px 24px' 
          }} 
        />
        
        {/* Rota */}
        <svg className="absolute inset-0 w-full h-full p-20">
          <path 
            d="M 50 400 Q 200 300 350 100" 
            fill="none" 
            stroke="#E2E8F0" 
            strokeWidth="6" 
            strokeLinecap="round"
          />
          <path 
            d="M 50 400 Q 200 300 350 100" 
            fill="none" 
            stroke="#F97316" 
            strokeWidth="6" 
            strokeLinecap="round"
            strokeDasharray="500"
            strokeDashoffset={500 - (progress * 5)}
          />
          
          {/* Marcador Moto */}
          <g transform={`translate(${50 + (progress * 3)}, ${400 - (progress * 3)})`}>
            <circle r="12" fill="white" className="shadow-md" />
            <circle r="10" fill="#F97316" />
            <Navigation size={12} className="text-white absolute -translate-x-1.5 -translate-y-1.5 rotate-45" fill="currentColor" />
          </g>

          {/* Marcador Destino */}
          <g transform="translate(350, 100)">
            <circle r="8" fill="#F97316" className="animate-ping opacity-20" />
            <MapPin size={24} className="text-navy -translate-x-3 -translate-y-6" fill="currentColor" />
          </g>
        </svg>

        {/* Info Suspensa */}
        <div className="absolute top-8 left-6 right-6">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-black italic uppercase tracking-tight text-navy">Corrida em andamento</h1>
              <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <CheckCircle2 size={12} />
                Seguro
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mt-1">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Destino</span>
                  <span className="text-sm font-bold text-navy italic">Shopping Jacarezinho - Centro</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Progresso do Trajeto</span>
                  <span className="text-navy italic">{eta} min restantes</span>
                </div>
                <Progress value={progress} className="h-2 bg-slate-100" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interface Inferior */}
      <div className="bg-white px-6 pb-8 pt-4 space-y-6 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-t-[40px] border-t border-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={pilot.avatar} className="w-14 h-14 rounded-2xl object-cover border border-slate-100" alt={pilot.name} />
              <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg shadow-sm border border-slate-100">
                <Star size={10} fill="#F97316" className="text-rovya-orange" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black italic tracking-tighter text-navy">{pilot.name}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pilot.vehicle}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Valor</span>
            <span className="text-xl font-black italic text-navy">R$ 14,90</span>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            type="button"
            onClick={() => navigate({ to: '/passageiro/seguranca' })}
            className="w-full h-14 bg-slate-50 border border-slate-100 text-navy rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-slate-100 transition-all active:scale-95"
          >
            <Shield size={18} className="text-blue-500" />
            Central de Segurança
          </button>

          <Button 
            onClick={() => navigate({ to: "/passageiro/corrida/$rideId/concluida", params: { rideId } })}
            className="w-full h-16 bg-navy text-white rounded-2xl font-black uppercase italic tracking-widest text-[11px] rovya-shadow"
          >
            Finalizar Corrida
            <ChevronRight size={18} strokeWidth={2.5} />
          </Button>
        </div>

        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <AlertTriangle size={16} className="text-amber-600 shrink-0" />
          <p className="text-[9px] text-amber-800 font-medium leading-relaxed italic">
            Demonstração local — nenhum rastreamento real está ativo.
          </p>
        </div>
      </div>
    </div>
  );
}