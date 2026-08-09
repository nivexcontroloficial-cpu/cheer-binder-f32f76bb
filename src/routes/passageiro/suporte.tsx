import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { 
  ArrowLeft, 
  Search, 
  MessageSquare, 
  HeadphonesIcon, 
  BookOpen, 
  ShieldAlert, 
  ChevronRight,
  LifeBuoy
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/passageiro/suporte")({
  component: SupportCenter,
});

function SupportCenter() {
  const navigate = useNavigate();

  const faqs = [
    { id: 1, q: "Como cancelar uma corrida?", a: "Você pode cancelar clicando no botão 'Cancelar' durante a busca ou no menu da corrida ativa." },
    { id: 2, q: "Esqueci um objeto na moto", a: "Abra um protocolo de 'Outros' informando a data, hora e descrição do objeto." },
    { id: 3, q: "Taxa de cancelamento indevida", a: "Vá em Saúde da Conta, localize a ocorrência e abra um Recurso." }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-porcelain font-sans text-navy">
      <header className="bg-white px-6 py-8 border-b border-slate-100 space-y-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate({ to: -1 as any })}
            className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-navy"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <h1 className="text-xl font-black italic tracking-tighter uppercase">Central de Ajuda</h1>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Como podemos ajudar?"
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-navy outline-none transition-all"
          />
        </div>
      </header>

      <main className="flex-1 p-6 space-y-8">
        {/* Quick Contact */}
        <section className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => toast.info("Abrindo chat de suporte...")}
            className="bg-white p-5 rounded-[32px] border border-slate-100 flex flex-col items-center gap-3 active:scale-95 transition-all shadow-sm"
          >
            <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <MessageSquare size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Chat Online</span>
          </button>
          <button 
            onClick={() => navigate({ to: "/passageiro/saude-da-conta" })}
            className="bg-white p-5 rounded-[32px] border border-slate-100 flex flex-col items-center gap-3 active:scale-95 transition-all shadow-sm"
          >
            <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <LifeBuoy size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Protocolos</span>
          </button>
        </section>

        {/* FAQ Section */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Dúvidas Frequentes</h3>
          <div className="space-y-2">
            {faqs.map(faq => (
              <details key={faq.id} className="group bg-white border border-slate-100 rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="text-sm font-bold text-navy">{faq.q}</span>
                  <ChevronRight size={18} className="text-slate-200 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-xs text-slate-500 leading-relaxed border-t border-slate-50 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Policy Links */}
        <section className="space-y-3">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Políticas</h3>
           <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden">
              <button 
                type="button"
                onClick={() => navigate({ to: "/passageiro/termos" })}
                className="w-full flex items-center justify-between p-5 border-b border-slate-50 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3 text-slate-400">
                  <BookOpen size={18} />
                  <span className="text-sm font-bold text-navy">Termos de Uso</span>
                </div>
                <ChevronRight size={16} className="text-slate-200" />
              </button>
              <button 
                type="button"
                onClick={() => navigate({ to: "/passageiro/privacidade" })}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3 text-slate-400">
                  <ShieldAlert size={18} />
                  <span className="text-sm font-bold text-navy">Política de Privacidade</span>
                </div>
                <ChevronRight size={16} className="text-slate-200" />
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
