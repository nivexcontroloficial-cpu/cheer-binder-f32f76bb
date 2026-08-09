import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/passageiro/termos")({
  component: TermosScreen,
});

function TermosScreen() {
  const navigate = useNavigate();
  return (
    <div className="p-6 font-sans text-navy bg-white min-h-screen">
      <button onClick={() => navigate({ to: -1 as any })} className="mb-6"><ArrowLeft /></button>
      <h1 className="text-xl font-black uppercase mb-4">Termos de Uso</h1>
      <p className="text-sm leading-relaxed text-slate-600">
        Esta é uma demonstração do aplicativo Rovya. Nesta demonstração, todos os dados são fictícios e armazenados apenas localmente no seu dispositivo. Nenhuma funcionalidade real como pagamento, GPS ou armazenamento externo está conectada. A verificação real será implementada futuramente após definição jurídica e técnica.
      </p>
    </div>
  );
}
