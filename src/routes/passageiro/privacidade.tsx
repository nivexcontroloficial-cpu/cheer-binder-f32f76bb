import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Info, ShieldCheck, Database, HardDrive, Lock } from "lucide-react";

export const Route = createFileRoute("/passageiro/privacidade")({
  component: PrivacidadeScreen,
});

function PrivacidadeScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-navy">
      {/* Banner de Demonstração */}
      <div
        className="flex items-center gap-3 border-b border-amber-100 bg-amber-50 px-6 py-2 shrink-0"
        role="alert"
      >
        <Info size={14} className="text-amber-500 shrink-0" aria-hidden="true" />
        <p className="text-[9px] font-bold uppercase tracking-wider text-amber-700 leading-tight">
          Documento demonstrativo: este texto ainda não representa os termos jurídicos finais da
          Rovya.
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
          Privacidade — Demonstração
        </h1>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-6 py-8">
        <div className="space-y-8">
          <section>
            <div className="mb-3 flex items-center gap-2 text-rovya-orange">
              <ShieldCheck size={16} aria-hidden="true" />
              <h2 className="text-[10px] font-black uppercase tracking-widest">
                1. Dados dos formulários
              </h2>
            </div>
            <p className="text-[11px] font-medium leading-relaxed text-slate-500 italic">
              Os dados digitados nas telas de cadastro e verificação permanecem somente no estado
              temporário da interface. São descartados ao atualizar a página ou sair do navegador.
              Qualquer foto selecionada serve apenas para preview local; ela não é enviada nem
              persistida. O CPF do passageiro não é armazenado em qualquer local.
            </p>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2 text-rovya-orange">
              <Database size={16} aria-hidden="true" />
              <h2 className="text-[10px] font-black uppercase tracking-widest">
                2. Dados mockados do protótipo
              </h2>
            </div>
            <p className="text-[11px] font-medium leading-relaxed text-slate-500">
              Para fins de fluidez da demonstração, alguns dados gerais e fictícios podem ser
              mantidos temporariamente na memória local do navegador. Isso não representa um banco
              de dados ou armazenamento em nuvem. Este mecanismo pode ser limpo através do reset da
              demonstração. Dados sensíveis como CPF são excluídos de qualquer persistência local.
            </p>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2 text-rovya-orange">
              <HardDrive size={16} aria-hidden="true" />
              <h2 className="text-[10px] font-black uppercase tracking-widest">
                3. Recursos não utilizados
              </h2>
            </div>
            <p className="text-[11px] font-medium leading-relaxed text-slate-500">
              Nesta fase, o protótipo não utiliza: banco de dados persistente, sistemas de backend,
              autenticação real, GPS, serviços de pagamento, notificações push, análise biométrica
              ou upload remoto de arquivos.
            </p>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2 text-rovya-orange">
              <Lock size={16} aria-hidden="true" />
              <h2 className="text-[10px] font-black uppercase tracking-widest">
                4. Uso responsável
              </h2>
            </div>
            <p className="text-[11px] font-medium leading-relaxed text-slate-500">
              Reforçamos a orientação para não inserir dados pessoais reais, como seu endereço ou
              documentos, neste ambiente de prototipagem.
            </p>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2 text-rovya-orange">
              <Info size={16} aria-hidden="true" />
              <h2 className="text-[10px] font-black uppercase tracking-widest">5. Fase futura</h2>
            </div>
            <p className="text-[11px] font-medium leading-relaxed text-slate-500">
              Uma política de privacidade jurídica definitiva e em conformidade com a LGPD deverá
              ser publicada e apresentada para consentimento antes de qualquer coleta real de dados.
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
