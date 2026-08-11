import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
/*
ETAPA 20.2D — PERMISSÕES LOCAIS TRANSPARENTES E ACESSÍVEIS

Base obrigatória:
2e3fbd84a082b3d09c2a287612f3364c31390ac8

Corrija exclusivamente:
src/routes/passageiro/permissoes.tsx

src/routeTree.gen.ts somente poderá aparecer se for atualizado automaticamente pelo build e deverá terminar no hash obrigatório.

Não alterar qualquer outro arquivo.

OBJETIVO

Transformar a tela de permissões em uma demonstração inteiramente local, acessível e transparente, sem solicitar permissões reais do aparelho.

PRESERVAR

- Identidade visual da Rovya.
- As três categorias:
  - localização;
  - câmera;
  - notificações.
- Selo de identidade, identificado como simulado.
- Navegação final para /passageiro/inicio.
- Funcionamento em telas pequenas.

TRANSPARÊNCIA

Adicionar banner visível:

“Demonstração local: estes controles não solicitam permissões reais do aparelho.”

Substituir alegações que sugiram:

- GPS ou monitoramento real;
- câmera ativa;
- QR Code real;
- notificações reais;
- segurança garantida;
- identidade realmente verificada.

O selo deve aparecer como:

“Identidade verificada — simulação”

E explicar:

“Nenhuma verificação real foi realizada.”

ESTADOS LOCAIS

Cada permissão deve possuir três estados locais:

- pendente;
- permitida na demonstração;
- negada na demonstração.

Utilizar um tipo explícito em TypeScript, por exemplo:

type SimulatedPermission = "pending" | "allowed" | "denied";

Os estados devem existir somente na memória da tela.

Não usar localStorage.

Não chamar:

- navigator.geolocation;
- navigator.permissions;
- Notification.requestPermission;
- navigator.mediaDevices;
- câmera do aparelho;
- qualquer API do navegador ou serviço externo.

CONTROLES

Cada cartão deve ser semanticamente acessível.

Não usar div com onClick.

Em cada cartão, disponibilizar dois botões:

- “Permitir na demonstração”
- “Agora não”

Os botões devem:

- usar type="button";
- possuir aria-pressed;
- ter foco visível;
- funcionar por teclado;
- atualizar somente o estado local.

Não criar botões aninhados.

TEXTOS E ALTERNATIVAS

Localização:

Descrição:

“Simula a localização durante o uso para demonstrar a escolha de origem e o acompanhamento da corrida.”

Se permitida:

“Estado simulado: localização permitida durante o uso. Nenhum GPS foi acessado.”

Se negada:

“Você poderá informar origem e destino manualmente nesta demonstração.”

Câmera:

Descrição:

“Simula a permissão de câmera usada no preview local da foto.”

Se permitida:

“Estado simulado: câmera permitida. A câmera não foi aberta nesta tela.”

Se negada:

“Você poderá continuar sem capturar uma nova foto.”

Notificações:

Descrição:

“Simula avisos sobre chegada do piloto e atualizações da corrida.”

Se permitida:

“Estado simulado: notificações permitidas. Nenhuma notificação do aparelho foi enviada.”

Se negada:

“Os avisos continuarão aparecendo somente dentro das telas da demonstração.”

Estado pendente:

“Nenhuma decisão simulada foi selecionada.”

CONCLUSÃO

- Remover isLoading, Loader2 e o setTimeout.
- Não criar novo timer.
- Não tornar localização obrigatória.
- Permitir concluir mesmo com permissões negadas ou pendentes.
- Ao concluir, exibir toast:
  “Preferências simuladas concluídas. Nenhuma permissão real foi solicitada.”
- Navegar imediatamente para /passageiro/inicio.
- Não salvar as escolhas.
- Ao atualizar a página, os estados devem voltar para pendente.

ACESSIBILIDADE

- Manter um único h1.
- Usar section ou article para cada permissão.
- Usar heading coerente para o título de cada cartão.
- Agrupar os dois botões com role="group" e aria-label contextual.
- Usar aria-live="polite" para anunciar mudanças de estado.
- Marcar ícones decorativos with aria-hidden="true".
- Todos os botões devem ter type="button".
- Garantir foco visível e área de toque adequada.
- Não esconder informações essenciais apenas por cor.
- Não usar elementos clicáveis sem semântica.

PROIBIDO

- Permissões reais do navegador ou aparelho.
- GPS, câmera ou notificações reais.
- Backend, banco, Supabase ou Lovable Cloud.
- Autenticação ou pagamento real.
- Persistência das escolhas.
- Alterar verificação, cadastro ou tela inicial.
- Alterar Piloto ou Administrativo.
- Alterar CSS global, dependências ou configurações.
- Inventar novas permissões.

ROUTETREE

Após a alteração:

1. Execute npm run build.
2. Confirme o bloco Register.
3. Confirme o hash:
   b4c2182230f995137cc73fe9f586cd7f1d707a08806b7a0579b3af59b8fd7d49
4. Execute um segundo build.
5. Confirme que não houve nova diferença.
6. Confirme também:

git show HEAD:src/routeTree.gen.ts | sha256sum

Não publicar o hash c44f003e….

VALIDAÇÕES

npx prettier --check src/routes/passageiro/permissoes.tsx src/routeTree.gen.ts
npx eslint src/routes/passageiro/permissoes.tsx src/routeTree.gen.ts
npx tsc --noEmit
npm run build
npm run build
git diff --check
git status --short
sha256sum src/routeTree.gen.ts
git show HEAD:src/routeTree.gen.ts | sha256sum

TESTAR

- acesso direto e F5 em /passageiro/permissoes;
- três estados de cada permissão;
- alternativas após negar;
- aria-pressed;
- navegação por teclado;
- conclusão com tudo pendente;
- conclusão com tudo negado;
- conclusão com combinações diferentes;
- navegação para /passageiro/inicio;
- atualização da página restaurando estados pendentes;
- ausência de qualquer solicitação real do aparelho.

RELATÓRIO FINAL

Informar:

- commit publicado;
- arquivos realmente alterados;
- estados testados;
- resultado das validações;
- hashes antes e depois dos builds;
- confirmação de que nenhuma API real foi chamada.

Não avance para origem ou destino.

“Nenhum backend, banco, autenticação real, pagamento real, GPS real ou notificação real foi conectado nesta etapa.”
*/
import { RovyaBrand } from "@/components/RovyaBrand";
import { User, ShieldCheck, PlayCircle, Bike, Palette, RotateCcw, ArrowRight, MessageSquare, Navigation as NavigationIcon, CheckCircle2, HeartPulse, Clock } from "lucide-react";
import { useDemo } from "@/state/DemoContext";

export const Route = createFileRoute("/")({
  head: () => ({
    title: "Rovya - Demonstração",
    meta: [
      {
        name: "description",
        content: "Seletor de experiência da plataforma Rovya.",
      },
    ],
  }),
  component: DemoSelector,
});

function DemoSelector() {
  const { resetData, isLoading } = useDemo();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans text-[#111827]">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-5xl mx-auto w-full">
        <div className="mb-12 flex flex-col items-center">
          <RovyaBrand className="mb-6" />
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase italic">
            SELETOR DE <span className="text-[#F97316]">DEMO</span>
          </h1>
          <p className="text-slate-500 max-w-md mx-auto">
            Selecione uma das experiências abaixo para explorar o protótipo funcional da plataforma.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
          <div className="flex flex-col gap-3">
            <DemoCard 
              to="/passageiro/boas-vindas"
              title="Passageiro"
              description="Entrada na Demonstração"
              icon={<User className="h-6 w-6" strokeWidth={1.8} />}
              color="border-blue-200 hover:border-[#2F80ED] text-[#2F80ED]"
              bg="bg-blue-50"
            />
            <Link 
              to="/passageiro/saude-da-conta"
              className="w-full py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-100 transition-all active:scale-95"
            >
              <HeartPulse size={10} strokeWidth={2.5} />
              Saúde da Conta (Direto)
            </Link>

            <Link 
              to="/passageiro/buscando"
              className="w-full py-2 bg-slate-100 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all active:scale-95"
            >
              Tela de Busca (Direto)
            </Link>
            <Link 
              to="/passageiro/corrida/$rideId/em-andamento"
              params={{ rideId: "ride-active-mock" }}
              className="w-full py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-100 transition-all active:scale-95"
            >
              <NavigationIcon size={10} strokeWidth={2.5} />
              Corrida Em Andamento (Direto)
            </Link>
            <Link 
              to="/passageiro/chat/$rideId"
              params={{ rideId: "ride-active-mock" }}
              className="w-full py-2 bg-blue-50 text-blue-500 border border-blue-100 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-100 transition-all active:scale-95"
            >
              <MessageSquare size={10} strokeWidth={2.5} />
              Chat com Piloto (Direto)
            </Link>
            <Link 
              to="/passageiro/corrida/$rideId/concluida"
              params={{ rideId: "RY-2026-00842" }}
              className="w-full py-2 bg-slate-800 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-900 transition-all active:scale-95"
            >
              <CheckCircle2 size={10} strokeWidth={2.5} />
              Corrida Concluída (Direto)
            </Link>
            <button 
              onClick={() => navigate({ to: '/passageiro/boas-vindas' })}
              className="w-full py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 rovya-shadow"
            >
              Iniciar Fluxo Boas-Vindas
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            <DemoCard 
              to="/piloto"
              title="Piloto"
              description="Interface Carlos H."
              icon={<Bike className="h-6 w-6" strokeWidth={1.8} />}
              color="border-orange-200 hover:border-[#F97316] text-[#F97316]"
              bg="bg-orange-50"
            />
            <button 
              onClick={() => navigate({ to: '/piloto/boas-vindas' })}
              className="w-full py-3 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-700 transition-all active:scale-95 rovya-shadow"
            >
              Entrada Piloto (Boas-Vindas)
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
            <button 
              onClick={() => navigate({ to: '/piloto/cadastro/pessoal' })}
              className="w-full py-3 bg-white border border-orange-200 text-orange-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-50 transition-all active:scale-95 rovya-shadow"
            >
              Novo Cadastro Piloto
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
            <button 
              onClick={() => navigate({ to: '/piloto/operacao' })}
              className="w-full py-3 bg-rovya-green text-navy rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rovya-green/90 transition-all active:scale-95 rovya-shadow"
            >
              Central de Operação
              <NavigationIcon size={14} strokeWidth={2.5} />
            </button>
            <button 
              onClick={() => navigate({ to: '/piloto/analise' })}
              className="w-full py-3 bg-slate-900 text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 rovya-shadow"
            >
              Status da Análise
              <Clock size={14} strokeWidth={2.5} />
            </button>
          </div>
 
          <DemoCard 
            to="/admin"
            title="Rovya Control"
            description="Administração"
            icon={<ShieldCheck className="h-6 w-6" strokeWidth={1.8} />}
            color="border-slate-200 hover:border-slate-900 text-slate-900"
            bg="bg-slate-50"
          />
        </div>

        <div className="mb-12">
          <Link 
            to="/simulador"
            className="group inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-600 transition-all"
          >
            <PlayCircle size={14} strokeWidth={1.8} className="group-hover:scale-110 transition-transform" />
            Acessar Simulador de Eventos
          </Link>
        </div>
 
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/design-system"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-navy font-bold hover:bg-slate-50 transition-colors rovya-shadow"
          >
            <Palette size={18} strokeWidth={1.8} />
            Visual Identity
          </Link>
          <Link 
            to="/design-system/componentes"
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-2xl font-bold hover:bg-navy/90 transition-colors rovya-shadow"
          >
            <Palette size={18} strokeWidth={1.8} />
            Component Library
          </Link>
          <button 
            onClick={resetData}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 transition-colors rovya-shadow disabled:opacity-50"
          >
            <RotateCcw size={18} strokeWidth={1.8} className={isLoading ? "animate-spin" : ""} />
            Reset Demo Data
          </button>
        </div>
 
        <div className="mt-16 p-6 bg-amber-50 border border-amber-100 rounded-3xl max-w-md">
          <p className="text-[10px] text-amber-800 font-bold uppercase tracking-widest leading-relaxed">
            Camada de Dados Mock
          </p>
          <p className="mt-2 text-xs text-amber-900 leading-relaxed">
            Os dados mostrados são gerados localmente e podem ser resetados. Nenhuma persistência real em nuvem está ativa.
          </p>
          <p className="mt-4 text-[10px] text-amber-800 font-bold uppercase tracking-widest leading-relaxed">
            Invariantes de Segurança
          </p>
          <p className="mt-2 text-xs text-amber-900 leading-relaxed">
            Nenhum backend, banco, autenticação real, pagamento real, GPS real ou notificação real foi conectado nesta etapa.
          </p>
        </div>
      </main>
 
      <footer className="p-8 text-center text-[10px] text-slate-400 uppercase tracking-widest font-black">
        ROVYA PROJECT • 2026
      </footer>
    </div>
  );
}
 
function DemoCard({ to, title, description, icon, color, bg }: { 
  to: string; 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  color: string;
  bg: string;
}) {
  return (
    <Link
      to={to}
      className={`group p-8 bg-white border rounded-[32px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center text-center ${color}`}
    >
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 ${bg}`}>
        {icon}
      </div>
      <h2 className="text-xl font-black mb-1 text-navy tracking-tight">{title}</h2>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em]">{description}</p>
    </Link>
  );
}
