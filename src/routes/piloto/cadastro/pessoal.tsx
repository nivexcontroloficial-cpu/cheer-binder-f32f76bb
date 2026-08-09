import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { RovyaBrand } from "@/components/RovyaBrand";
import { ChevronLeft, ArrowRight, User, Calendar, CreditCard, Mail, Phone, MapPin, Info } from "lucide-react";
import { useState } from "react";
import { useDemo } from "@/state/DemoContext";
import { toast } from "sonner";

export const Route = createFileRoute("/piloto/cadastro/pessoal")({
  component: PilotRegistrationPersonal,
});

function PilotRegistrationPersonal() {
  const navigate = useNavigate();
  const { pilotRegistration, updatePilotRegistration } = useDemo();
  
  const [formData, setFormData] = useState({
    nome: pilotRegistration.nome || "",
    nascimento: pilotRegistration.nascimento || "",
    cpf: pilotRegistration.cpf || "",
    email: pilotRegistration.email || "",
    telefone: pilotRegistration.telefone || "",
    endereco: pilotRegistration.endereco || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === "cpf") {
      formattedValue = value.replace(/\D/g, "").slice(0, 11);
      if (formattedValue.length > 3) formattedValue = formattedValue.slice(0, 3) + "." + formattedValue.slice(3);
      if (formattedValue.length > 7) formattedValue = formattedValue.slice(0, 7) + "." + formattedValue.slice(7);
      if (formattedValue.length > 11) formattedValue = formattedValue.slice(0, 11) + "-" + formattedValue.slice(11);
    } else if (name === "telefone") {
      formattedValue = value.replace(/\D/g, "").slice(0, 11);
      if (formattedValue.length > 0) formattedValue = "(" + formattedValue;
      if (formattedValue.length > 3) formattedValue = formattedValue.slice(0, 3) + ") " + formattedValue.slice(3);
      if (formattedValue.length > 10) formattedValue = formattedValue.slice(0, 10) + "-" + formattedValue.slice(10);
    } else if (name === "nascimento") {
       formattedValue = value.replace(/\D/g, "").slice(0, 8);
       if (formattedValue.length > 2) formattedValue = formattedValue.slice(0, 2) + "/" + formattedValue.slice(2);
       if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5) + "/" + formattedValue.slice(5);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!formData.nome || !formData.cpf || !formData.telefone || !formData.email) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (formData.cpf.length < 14) {
      toast.error("CPF inválido");
      return;
    }

    updatePilotRegistration(formData);
    navigate({ to: "/piloto/cadastro/foto" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-navy text-porcelain font-sans">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-navy/80 backdrop-blur-md z-10">
        <button 
          onClick={() => navigate({ to: "/piloto/boas-vindas" })}
          className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rovya-orange mb-1">Passo 1 de 2</p>
          <div className="flex gap-1.5">
            <div className="h-1 w-8 bg-rovya-orange rounded-full" />
            <div className="h-1 w-8 bg-white/10 rounded-full" />
          </div>
        </div>
        <RovyaBrand variant="white" subBrand="Piloto" className="scale-75 hidden sm:block" />
        <div className="w-12 h-12 sm:hidden" />
      </header>

      <main className="flex-1 flex flex-col px-6 pt-4 pb-32 max-w-lg mx-auto w-full">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-2 animate-in fade-in slide-in-from-left duration-500">
          DADOS PESSOAIS
        </h1>
        <p className="text-sm text-white/40 mb-8 animate-in fade-in slide-in-from-left duration-500 delay-100">
          Precisamos desses dados para validar sua identidade e garantir a segurança de todos.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom duration-700">
          <InputGroup 
            icon={<User size={18} className="text-white/20" />}
            label="Nome Completo"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Como no seu documento"
            reason="Usado para identificação nas corridas e extratos."
          />

          <div className="grid grid-cols-2 gap-4">
            <InputGroup 
              icon={<Calendar size={18} className="text-white/20" />}
              label="Nascimento"
              name="nascimento"
              value={formData.nascimento}
              onChange={handleChange}
              placeholder="DD/MM/AAAA"
              reason="Para confirmar que você tem idade mínima para operar."
            />
            <InputGroup 
              icon={<CreditCard size={18} className="text-white/20" />}
              label="CPF"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
              reason="Obrigatório para emissão de notas e análise de segurança."
            />
          </div>

          <InputGroup 
            icon={<Mail size={18} className="text-white/20" />}
            label="E-mail"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            reason="Canal oficial para envio de faturas e comunicados."
          />

          <InputGroup 
            icon={<Phone size={18} className="text-white/20" />}
            label="Telefone Celular"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
            reason="Usado para login e contato com o passageiro."
          />

          <InputGroup 
            icon={<MapPin size={18} className="text-white/20" />}
            label="Cidade/UF de Operação"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            placeholder="Ex: São Paulo - SP"
            reason="Para direcionarmos as corridas da sua região."
          />

          <div className="pt-8">
            <button 
              type="submit"
              className="w-full h-16 bg-rovya-orange text-white rounded-3xl font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3 hover:bg-rovya-orange/90 active:scale-95 transition-all shadow-xl shadow-black/20"
            >
              Continuar para Foto
              <ArrowRight size={16} strokeWidth={3} />
            </button>
          </div>
        </form>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-navy to-transparent pointer-events-none">
        <div className="max-w-lg mx-auto flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-md pointer-events-auto">
          <Info size={16} className="text-white/30 shrink-0" />
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider leading-relaxed">
            Seus dados são criptografados e seguem rigorosas políticas de privacidade (LGPD).
          </p>
        </div>
      </div>
    </div>
  );
}

function InputGroup({ 
  icon, 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  type = "text",
  reason 
}: { 
  icon: React.ReactNode;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  reason?: string;
}) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-white/40 flex items-center gap-2">
          {icon}
          {label}
        </label>
        {reason && (
          <button 
            type="button" 
            onClick={() => setShowInfo(!showInfo)}
            className={`p-1 rounded-full transition-colors ${showInfo ? "text-rovya-orange bg-rovya-orange/10" : "text-white/20 hover:text-white/40"}`}
          >
            <Info size={12} />
          </button>
        )}
      </div>
      
      {showInfo && reason && (
        <div className="p-3 bg-white/5 border border-white/5 rounded-xl animate-in slide-in-from-top-2 duration-300">
          <p className="text-[9px] text-white/50 font-medium leading-relaxed italic">
             {reason}
          </p>
        </div>
      )}

      <input 
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-sm font-bold focus:outline-none focus:border-rovya-orange/50 transition-all text-porcelain placeholder:text-white/5"
      />
    </div>
  );
}
