import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Search,
  MessageSquare,
  BookOpen,
  ShieldAlert,
  ChevronRight,
  LifeBuoy,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/passageiro/suporte")({
  component: SupportCenter,
});

const FAQS = [
  {
    id: 1,
    q: "Como cancelar uma corrida?",
    a: "Você pode cancelar clicando no botão 'Cancelar' durante a busca ou no menu da corrida ativa.",
  },
  {
    id: 2,
    q: "Esqueci um objeto na moto",
    a: "Abra um protocolo de 'Outros' informando a data, hora e descrição do objeto.",
  },
  {
    id: 3,
    q: "Taxa de cancelamento indevida",
    a: "Vá em Saúde da Conta, localize a ocorrência e abra um Recurso.",
  },
];

function SupportCenter() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return FAQS;
    return FAQS.filter(
      (faq) => faq.q.toLowerCase().includes(term) || faq.a.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  const handleChatClick = () => {
    toast.info("Demonstração local: o chat será conectado na etapa de backend.");
  };

  return (
    <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy">
      <header className="bg-white px-6 py-8 border-b border-slate-100 space-y-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate({ to: "/passageiro/inicio" })}
            className="h-11 w-11 bg-slate-50 rounded-xl flex items-center justify-center text-navy focus-visible:ring-2 focus-visible:ring-rovya-orange outline-none"
            aria-label="Voltar para o início"
          >
            <ArrowLeft size={20} strokeWidth={2.5} aria-hidden="true" />
          </button>
          <h1 className="text-xl font-black italic tracking-tighter uppercase">Central de Ajuda</h1>
        </div>

        {/* Simulaton Warning */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle size={18} className="text-blue-500 shrink-0" aria-hidden="true" />
          <p className="text-xs font-medium text-blue-700">
            Demonstração local: nenhum atendimento real será iniciado.
          </p>
        </div>

        <div className="relative">
          <label htmlFor="faq-search" className="sr-only">
            Buscar perguntas frequentes
          </label>
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
            size={18}
            aria-hidden="true"
          />
          <input
            id="faq-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Como podemos ajudar?"
            aria-describedby="faq-result-status"
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-navy outline-none transition-all focus-visible:ring-rovya-orange min-h-[44px]"
          />
          <p id="faq-result-status" role="status" aria-live="polite" className="sr-only">
            {filteredFaqs.length > 0
              ? `${filteredFaqs.length} dúvidas simuladas encontradas.`
              : "Nenhuma dúvida simulada encontrada."}
          </p>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-8">
        {/* Quick Contact */}
        <section className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleChatClick}
            className="bg-white p-5 rounded-[32px] border border-slate-100 flex flex-col items-center gap-3 active:scale-95 transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-rovya-orange focus-visible:ring-offset-2 outline-none"
          >
            <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <MessageSquare size={24} aria-hidden="true" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-center">
                Chat de suporte
              </span>
              <span className="text-[8px] font-bold text-blue-500 uppercase tracking-tighter">
                — Simulado
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/passageiro/saude-da-conta" })}
            className="bg-white p-5 rounded-[32px] border border-slate-100 flex flex-col items-center gap-3 active:scale-95 transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-rovya-orange focus-visible:ring-offset-2 outline-none"
          >
            <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <LifeBuoy size={24} aria-hidden="true" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-widest">Protocolos</span>
              <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">
                simulados
              </span>
            </div>
          </button>
        </section>

        {/* FAQ Section */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            Dúvidas Frequentes
          </h2>

          <div className="space-y-2">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <details
                  key={faq.id}
                  className="group bg-white border border-slate-100 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-navy"
                >
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none outline-none">
                    <span className="text-sm font-bold text-navy">{faq.q}</span>
                    <ChevronRight
                      size={18}
                      className="text-slate-200 group-open:rotate-90 transition-transform"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="px-5 pb-5 text-xs text-slate-500 leading-relaxed border-t border-slate-50 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))
            ) : (
              <div
                id="empty-faq-results"
                className="bg-white border border-slate-100 rounded-2xl p-8 text-center space-y-2"
              >
                <p className="text-sm font-bold text-navy">
                  Nenhuma dúvida encontrada nesta demonstração.
                </p>
                <p className="text-xs text-slate-400">
                  Tente buscar por termos como "cancelar", "objeto" ou "taxa".
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Policy Links */}
        <section className="space-y-3">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            Políticas
          </h2>
          <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden">
            <button
              type="button"
              onClick={() => navigate({ to: "/passageiro/termos" })}
              className="w-full flex items-center justify-between p-5 border-b border-slate-50 hover:bg-slate-50 focus:bg-slate-50 outline-none focus-visible:ring-2 focus-visible:ring-rovya-orange min-h-[44px]"
            >
              <div className="flex items-center gap-3 text-slate-400">
                <BookOpen size={18} aria-hidden="true" />
                <span className="text-sm font-bold text-navy">Termos de Uso</span>
              </div>
              <ChevronRight size={16} className="text-slate-200" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/passageiro/privacidade" })}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50 focus:bg-slate-50 outline-none focus-visible:ring-2 focus-visible:ring-rovya-orange min-h-[44px]"
            >
              <div className="flex items-center gap-3 text-slate-400">
                <ShieldAlert size={18} aria-hidden="true" />
                <span className="text-sm font-bold text-navy">Política de Privacidade</span>
              </div>
              <ChevronRight size={16} className="text-slate-200" aria-hidden="true" />
            </button>
          </div>
        </section>
      </main>

      <footer className="p-8 text-center text-[9px] text-slate-300 font-bold uppercase tracking-widest">
        ROVYA SUPORTE • BRASIL
      </footer>
    </div>
  );
}
