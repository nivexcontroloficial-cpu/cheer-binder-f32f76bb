import { createFileRoute, Link } from "@tanstack/react-router";
import { RovyaBrand, RovyaLogoSymbol } from "@/components/RovyaBrand";
import { 
  Bike, 
  User, 
  ShieldCheck, 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info,
  ChevronRight,
  Search,
  MessageSquare,
  MapPin,
  Clock,
  ChevronLeft
} from "lucide-react";

export const Route = createFileRoute("/design-system")({
  component: DesignSystemPage,
});

function DesignSystemPage() {
  const ICON_SIZE = 24;
  const STROKE = 1.8;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 md:p-16">
      <div className="max-w-6xl mx-auto space-y-24 pb-32">
        {/* Header */}
        <section className="space-y-4">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-navy transition-colors mb-8">
            <ChevronLeft size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">Voltar para Demo</span>
          </Link>
          <h1 className="text-5xl font-black tracking-tight text-navy">Design System</h1>
          <p className="text-xl text-slate-500 max-w-2xl">
            Fundação visual da plataforma Rovya: premium, madura e nativa.
          </p>
        </section>

        {/* Branding */}
        <section className="space-y-12">
          <SectionHeader title="Branding & Logo" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-12 bg-white border border-slate-200 rounded-3xl flex flex-col items-center gap-12">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Fundo Claro (Default)</span>
              <RovyaBrand />
              <div className="flex gap-8">
                <RovyaBrand subBrand="Passageiro" />
                <RovyaBrand subBrand="Piloto" />
                <RovyaBrand subBrand="Control" />
              </div>
            </div>
            <div className="p-12 bg-navy rounded-3xl flex flex-col items-center gap-12">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">Fundo Escuro</span>
              <RovyaBrand variant="white" />
              <div className="flex gap-8">
                <RovyaBrand variant="white" subBrand="Passageiro" />
                <RovyaBrand variant="white" subBrand="Piloto" />
                <RovyaBrand variant="white" subBrand="Control" />
              </div>
            </div>
          </div>
        </section>

        {/* Colors */}
        <section className="space-y-8">
          <SectionHeader title="Paleta de Cores" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <ColorSwatch name="Navy" hex="#111827" className="bg-[#111827] text-white" />
            <ColorSwatch name="Graphite" hex="#1F2937" className="bg-[#1F2937] text-white" />
            <ColorSwatch name="Porcelain" hex="#F8FAFC" className="bg-[#F8FAFC] border border-slate-200" />
            <ColorSwatch name="Orange" hex="#F97316" className="bg-[#F97316] text-white" />
            <ColorSwatch name="Blue" hex="#2F80ED" className="bg-[#2F80ED] text-white" />
            <ColorSwatch name="Green" hex="#10B981" className="bg-[#10B981] text-white" />
            <ColorSwatch name="Amber" hex="#F59E0B" className="bg-[#F59E0B] text-white" />
            <ColorSwatch name="Red" hex="#DC2626" className="bg-[#DC2626] text-white" />
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-8">
          <SectionHeader title="Tipografia" />
          <div className="p-12 bg-white border border-slate-200 rounded-3xl space-y-12">
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Headings / Black / Tight</p>
              <h1 className="text-6xl font-black tracking-tighter text-navy uppercase italic leading-none">ROVYA PLATFORM</h1>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subtitles / Bold</p>
              <p className="text-3xl font-bold tracking-tight text-navy">Premium, madura e focada em resultados.</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Body / Regular</p>
              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                A Rovya é uma plataforma brasileira que conecta passageiros e pilotos com segurança, transparência e eficiência. Nossa interface prioriza a clareza e o profissionalismo.
              </p>
            </div>
          </div>
        </section>

        {/* Icons */}
        <section className="space-y-8">
          <SectionHeader title="Iconografia (Lucide)" />
          <div className="p-12 bg-white border border-slate-200 rounded-3xl">
            <div className="grid grid-cols-4 md:grid-cols-8 gap-8">
              <IconBox icon={<Bike size={ICON_SIZE} strokeWidth={STROKE} />} label="Piloto" />
              <IconBox icon={<User size={ICON_SIZE} strokeWidth={STROKE} />} label="Usuário" />
              <IconBox icon={<ShieldCheck size={ICON_SIZE} strokeWidth={STROKE} />} label="Segurança" />
              <IconBox icon={<Bell size={ICON_SIZE} strokeWidth={STROKE} />} label="Notificação" />
              <IconBox icon={<MessageSquare size={ICON_SIZE} strokeWidth={STROKE} />} label="Chat" />
              <IconBox icon={<MapPin size={ICON_SIZE} strokeWidth={STROKE} />} label="Rota" />
              <IconBox icon={<Clock size={ICON_SIZE} strokeWidth={STROKE} />} label="Histórico" />
              <IconBox icon={<Search size={ICON_SIZE} strokeWidth={STROKE} />} label="Busca" />
            </div>
          </div>
        </section>

        {/* Components */}
        <section className="space-y-8">
          <SectionHeader title="Componentes de Interface" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Buttons */}
            <div className="p-8 bg-white border border-slate-200 rounded-3xl space-y-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Botões & Ações</h3>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-orange text-white font-bold rounded-2xl hover:scale-105 transition-transform">Principal</button>
                <button className="px-8 py-4 bg-navy text-white font-bold rounded-2xl hover:scale-105 transition-transform">Secundário</button>
                <button className="px-8 py-4 border-2 border-slate-200 text-navy font-bold rounded-2xl hover:bg-slate-50 transition-colors">Outline</button>
              </div>
            </div>
            {/* Status */}
            <div className="p-8 bg-white border border-slate-200 rounded-3xl space-y-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Status & Feedback</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-green font-bold">
                  <CheckCircle2 size={20} /> Concluído com Sucesso
                </div>
                <div className="flex items-center gap-3 text-amber font-bold">
                  <AlertTriangle size={20} /> Verificação Necessária
                </div>
                <div className="flex items-center gap-3 text-red font-bold">
                  <XCircle size={20} /> Erro de Processamento
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400 whitespace-nowrap">{title}</h2>
      <div className="h-[1px] w-full bg-slate-200"></div>
    </div>
  );
}

function ColorSwatch({ name, hex, className }: { name: string, hex: string, className: string }) {
  return (
    <div className="space-y-2">
      <div className={`aspect-square rounded-2xl ${className}`}></div>
      <div className="px-1">
        <p className="text-xs font-bold text-navy">{name}</p>
        <p className="text-[10px] font-mono text-slate-400">{hex}</p>
      </div>
    </div>
  );
}

function IconBox({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-navy">
      <div className="p-4 bg-slate-50 rounded-2xl">
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-tighter opacity-40">{label}</span>
    </div>
  );
}
