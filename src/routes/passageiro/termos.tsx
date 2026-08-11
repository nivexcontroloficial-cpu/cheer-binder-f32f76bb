import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Info, FileText, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/passageiro/termos")({
  component: TermosScreen,
});

function TermosScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-navy">
      {/* Banner de Demonstração */}
      <div
        className="flex items-center gap-3 border-b border-amber-100 bg-amber-50 px-6 py-2 shrink-0"
        role="alert"
      >
        <Info size={14} className="text-amber-500 shrink-0" aria-hidden="true" />
        <p className="text-[9px] font-bold uppercase tracking-wider text-amber-700 leading-tight">
          Documento demonstrativo: este texto ainda não representa os termos jurídicos finais da Rovya.
        </p>
      </div>

      <header className="sticky top-0 z-50 flex items-center gap-4 border-b border-slate-100 bg-white px-6 py-5">
        <Link
          to="/passageiro/entrar"
          aria-label="Voltar para entrada"
          className="flex h-11 w-11 items-center justify-center rounded-full text-slate-400 transition-colors hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rovya-orange"
        >
          <ArrowLeft size={24} aria-hidden="true" />
        </Link>
        <h1 className="text-[11px] font-black italic uppercase tracking-widest">
          Termos de Uso — Demonstração
        </h1>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-6 py-8">
        <div className="space-y-8">
          <section>
            <div className="mb-3 flex items-center gap-2 text-rovya-orange">
              <FileText size={16} aria-hidden="true" />
              <h2 className="text-[10px] font-black uppercase tracking-widest">
                1. Natureza do protótipo
              </h2>
            </div>
            <p className="text-[11px] font-medium leading-relaxed text-slate-500 italic">
              Esta é uma interface frontend de demonstração. Corridas, usuários, pilotos, preços e
              protocolos visualizados são fictícios. Nenhuma relação contratual ou serviço de
              transporte real é criado através deste protótipo.
            </p>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2 text-rovya-orange">
              <ShieldAlert size={16} aria-hidden="true" />
              <h2 className="text-[10px] font-black uppercase tracking-widest">
                2. Dados fictícios
              </h2>
            </div>
            <p className="text-[11px] font-medium leading-relaxed text-slate-500">
              Solicitamos que utilize somente dados fictícios para explorar a interface. Não informe
              CPF, endereço, documento ou qualquer informação pessoal real. Os campos existem apenas
              para testar o fluxo visual e a experiência do usuário.
            </p>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2 text-rovya-orange">
              <Info size={16} aria-hidden="true" />
              <h2 className="text-[10px] font-black uppercase tracking-widest">
                3. Funcionalidades simuladas
              </h2>
            </div>
            <p className="text-[11px] font-medium leading-relaxed text-slate-500">
              As seguintes funcionalidades não estão ativas neste ambiente: autenticação real, envio
              de SMS, rastreamento por GPS, processamento de pagamento, notificações push, canais de
              atendimento ou denúncia, análise humana e transporte físico.
            </p>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2 text-rovya-orange">
              <FileText size={16} aria-hidden="true" />
              <h2 className="text-[10px] font-black uppercase tracking-widest">
                4. Pagamento presencial planejado
              </h2>
            </div>
            <p className="text-[11px] font-medium leading-relaxed text-slate-500">
              As opções de pagamento presenciais exibidas são apenas demonstrações do fluxo
              planejado. Nenhuma cobrança financeira ou transferência de valores acontece nesta fase
              de testes.
            </p>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2 text-rovya-orange">
              <FileText size={16} aria-hidden="true" />
              <h2 className="text-[10px] font-black uppercase tracking-widest">
                5. Versão futura
              </h2>
            </div>
            <p className="text-[11px] font-medium leading-relaxed text-slate-500">
              Os termos jurídicos reais e vinculativos serão devidamente elaborados, revisados e
              aprovados por assessoria jurídica antes do início de qualquer operação real da Rovya.
              Este documento não substitui os termos definitivos.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-100 bg-white px-8 py-10 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">
          Rovya © 2026 — Protótipo de Interface
        </p>
      </footer>
    </div>
  );
}
