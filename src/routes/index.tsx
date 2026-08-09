import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    title: "Rovya - Plataforma Brasileira de Mototáxi",
    meta: [
      {
        name: "description",
        content: "Conectando passageiros e pilotos com segurança e agilidade.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans text-[#111827]">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Rovya
        </h1>
        <p className="text-xl md:text-2xl text-[#1F2937] mb-12">
          A plataforma premium para mototáxi no Brasil.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <a
            href="/passageiro"
            className="group p-8 bg-white border border-[#F1F5F9] rounded-2xl shadow-sm hover:shadow-md transition-all hover:border-[#F97316]"
          >
            <h2 className="text-2xl font-bold mb-2 group-hover:text-[#F97316]">Passageiro</h2>
            <p className="text-[#4B5563]">Viaje com segurança e conforto.</p>
          </a>
          
          <a
            href="/piloto"
            className="group p-8 bg-white border border-[#F1F5F9] rounded-2xl shadow-sm hover:shadow-md transition-all hover:border-[#F97316]"
          >
            <h2 className="text-2xl font-bold mb-2 group-hover:text-[#F97316]">Piloto</h2>
            <p className="text-[#4B5563]">Aumente seus ganhos com profissionalismo.</p>
          </a>
        </div>

        <div className="mt-12 flex gap-4">
          <a href="/admin" className="text-sm font-medium text-[#2F80ED] hover:underline">Rovya Control</a>
          <span className="text-gray-300">|</span>
          <a href="/simulador" className="text-sm font-medium text-[#2F80ED] hover:underline">Simulador</a>
        </div>
      </main>

      <footer className="p-6 text-center text-sm text-[#94A3B8]">
        © 2026 Rovya. Todos os direitos reservados.
      </footer>
    </div>
  );
}
