import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/passageiro/privacidade")({
  component: PrivacidadeScreen,
});

function PrivacidadeScreen() {
  const navigate = useNavigate();
  return (
    <div className="p-6 font-sans text-navy bg-white min-h-screen">
      <button onClick={() => navigate({ to: -1 as any })} className="mb-6"><ArrowLeft /></button>
      <h1 className="text-xl font-black uppercase mb-4">Política de Privacidade</h1>
      <p className="text-sm leading-relaxed text-slate-600">
        Nesta demonstração, os dados informados (como nome e CPF fictícios) permanecem somente no ambiente local (localStorage) do seu navegador. Não coletamos nem transmitimos suas informações para servidores externos nesta fase de protótipo. A verificação real de identidade não está ativa.
      </p>
    </div>
  );
}
