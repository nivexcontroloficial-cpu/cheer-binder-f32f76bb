import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, MessageSquare, Phone, ShieldCheck, Share2, AlertTriangle, Clock, Navigation, CheckCircle2, Info, Lock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/passageiro/corrida/$rideId")({
  component: ActiveRideScreen,
});

function ActiveRideScreen() {
  const { rideId } = useParams({ from: "/passageiro/corrida/$rideId" });
  const navigate = useNavigate();
  const [isDivergentVehicleAlertOpen, setIsDivergentVehicleAlertOpen] = useState(false);

  const handleStartRide = () => navigate({ to: "/passageiro/corrida/$rideId/em-andamento", params: { rideId: rideId || "" } });

  return (
    <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy">
      <header className="p-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: "/passageiro/inicio" })}><ArrowLeft /></Button>
        <h1 className="font-black italic uppercase text-lg">Corrida</h1>
        <Button variant="ghost" onClick={() => navigate({ to: "/passageiro/seguranca", search: { rideId: rideId || "" } })}><ShieldCheck /></Button>
      </header>

      <main className="flex-1 p-6 space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
          <p className="text-sm font-bold mb-4">Carlos H. está a caminho</p>
          <Button onClick={handleStartRide} className="w-full">Simular Início da Corrida</Button>
        </div>
      </main>

      <AlertDialog open={isDivergentVehicleAlertOpen} onOpenChange={setIsDivergentVehicleAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reportar divergência</AlertDialogTitle>
            <AlertDialogDescription>Confirme se o veículo ou piloto não conferem.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate({ to: "/passageiro/denunciar/$rideId", params: { rideId: rideId || "" } })}>Reportar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
