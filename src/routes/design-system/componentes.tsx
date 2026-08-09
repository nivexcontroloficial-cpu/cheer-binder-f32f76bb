import { createFileRoute } from "@tanstack/react-router";
import { 
  Button, 
  Input, 
  Badge, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Skeleton
} from "@/components/ui";
import { Chip } from "@/components/ui/chip";
import { Banner } from "@/components/ui/banner";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  Search, 
  Send, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Clock, 
  MapPin, 
  Plus,
  Loader2,
  Info,
  Layers,
  Layout,
  MousePointer2,
  Type
} from "lucide-react";

export const Route = createFileRoute("/design-system/componentes")({
  component: ComponentsCatalog,
});

function ComponentsCatalog() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-20 pb-32">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rovya-orange/10 text-rovya-orange rounded-full text-[10px] font-black tracking-widest uppercase">
          <Layers size={14} /> Design System
        </div>
        <h1 className="text-4xl font-black text-navy tracking-tight uppercase">Biblioteca de Componentes</h1>
        <p className="text-slate-500 max-w-2xl font-medium leading-relaxed">
          Base de componentes reutilizáveis para a Rovya. Todos os componentes seguem os tokens de design e padrões de acessibilidade.
        </p>
      </header>

      {/* Buttons Section */}
      <section className="space-y-8">
        <SectionHeader 
          icon={<MousePointer2 size={20} />} 
          title="Botões & Ações" 
          description="Variantes e estados para interações do usuário."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ComponentCard title="Variantes">
            <div className="flex flex-wrap gap-4">
              <Button>Principal</Button>
              <Button variant="secondary">Secundário</Button>
              <Button variant="outline">Contorno</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Perigo</Button>
            </div>
          </ComponentCard>

          <ComponentCard title="Estados">
            <div className="flex flex-wrap gap-4">
              <Button disabled>Desativado</Button>
              <Button className="gap-2">
                <Loader2 className="animate-spin" size={16} /> Carregando
              </Button>
              <Button size="icon" variant="outline"><Trash2 size={18} /></Button>
            </div>
          </ComponentCard>

          <ComponentCard title="Tamanhos">
            <div className="flex items-end flex-wrap gap-4">
              <Button size="sm">Pequeno</Button>
              <Button size="default">Padrão</Button>
              <Button size="lg" className="h-12 px-8">Grande (Touch)</Button>
            </div>
          </ComponentCard>
        </div>
      </section>

      {/* Inputs Section */}
      <section className="space-y-8">
        <SectionHeader 
          icon={<Type size={20} />} 
          title="Entradas de Dados" 
          description="Campos de formulário e buscas."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ComponentCard title="Campos de Texto">
            <div className="space-y-4">
              <Input placeholder="Nome Completo" />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input className="pl-10" placeholder="Buscar destino..." />
              </div>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Seleção & Feedback">
            <div className="flex flex-wrap gap-3">
              <Badge>Ativo</Badge>
              <Badge variant="secondary">Pendente</Badge>
              <Badge variant="outline">Finalizado</Badge>
              <Badge variant="destructive">Cancelado</Badge>
            </div>
          </ComponentCard>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="space-y-8">
        <SectionHeader 
          icon={<AlertCircle size={20} />} 
          title="Feedback & Status" 
          description="Mensagens de sistema e estados de carregamento."
        />
        
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Banner 
                variant="info" 
                title="Novo Recurso" 
                description="Agora você pode agendar corridas com até 24h de antecedência." 
              />
              <Banner 
                variant="success" 
                description="Seu perfil foi verificado com sucesso!" 
              />
              <Banner 
                variant="error" 
                title="Erro de Conexão" 
                description="Não foi possível sincronizar sua localização. Verifique o sinal." 
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <Chip label="SUV" icon={<Layout size={12} />} variant="active" />
                <Chip label="Econômico" />
                <Chip label="Porta-malas" variant="outline" />
              </div>
              <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>
          </div>
          
          <EmptyState 
            icon={<Clock size={32} />}
            title="Nenhuma corrida encontrada"
            description="Você ainda não realizou nenhuma viagem hoje. Que tal começar agora?"
            action={<Button className="rounded-2xl px-8">Solicitar Agora</Button>}
          />
        </div>
      </section>

      {/* Data Display Section */}
      <section className="space-y-8">
        <SectionHeader 
          icon={<Layout size={20} />} 
          title="Exibição de Dados" 
          description="Cards e perfis."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="rounded-[32px] rovya-shadow-lg border-white/5 overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="text-sm uppercase tracking-widest font-black">Perfil do Piloto</CardTitle>
            </CardHeader>
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <Avatar className="h-20 w-20 border-4 border-white shadow-xl">
                <AvatarImage src="https://i.pravatar.cc/150?u=driver" />
                <AvatarFallback>CH</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-lg">Carlos Henrique</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Toyota Corolla • ABC-1234</p>
              </div>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => <Badge key={i} className="bg-rovya-amber h-2 w-2 p-0 rounded-full" />)}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
      <div className="p-3 bg-navy text-white rounded-2xl">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-black uppercase tracking-widest text-navy">{title}</h2>
        <p className="text-sm text-slate-500 font-medium">{description}</p>
      </div>
    </div>
  );
}

function ComponentCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</h3>
      <div className="p-8 bg-white border border-slate-100 rounded-[32px] rovya-shadow flex flex-col gap-6">
        {children}
      </div>
    </div>
  );
}
