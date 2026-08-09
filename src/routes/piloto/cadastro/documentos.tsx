import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RovyaBrand } from "@/components/RovyaBrand";
import { ChevronLeft, ArrowRight, FileCheck, Upload, AlertCircle, Info, FileText } from "lucide-react";
import { useState } from "react";
import { useDemo } from "@/state/DemoContext";
import { toast } from "sonner";

export const Route = createFileRoute("/piloto/cadastro/documentos")({
  component: PilotRegistrationDocs,
});

function PilotRegistrationDocs() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState({ cnh: false, crlv: false });

  const handleNext = () => {
    if (!docs.cnh || !docs.crlv) {
      toast.error("Por favor, simule o envio de todos os documentos.");
      return;
    }
    navigate({ to: "/piloto/cadastro/veiculo" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-navy text-porcelain font-sans">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-navy/80 backdrop-blur-md z-10">
        <button 
          onClick={() => navigate({ to: "/piloto/cadastro/foto" })}
          className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rovya-orange mb-1">Passo 3 de 5</p>
          <div className="flex gap-1.5">
            <div className="h-1 w-6 bg-rovya-orange rounded-full" />
            <div className="h-1 w-6 bg-rovya-orange rounded-full" />
            <div className="h-1 w-6 bg-rovya-orange rounded-full" />
            <div className="h-1 w-6 bg-white/10 rounded-full" />
            <div className="h-1 w-6 bg-white/10 rounded-full" />
          </div>
        </div>
        <div className="w-12 h-12" />
      </header>

      <main className="flex-1 px-6 pt-4 pb-24 max-w-lg mx-auto w-full">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-2">DOCUMENTOS</h1>
        <p className="text-sm text-white/40 mb-8">
           Envie fotos nítidas dos documentos originais para análise. Nenhum arquivo é armazenado.
        </p>

        <div className="space-y-4">
          <DocUploader 
            label="CNH (Com EAR)" 
            uploaded={docs.cnh} 
            onUpload={() => setDocs(p => ({...p, cnh: true}))}
            preview="cnh-demo-preview"
          />
          <DocUploader 
            label="CRLV-e da Moto" 
            uploaded={docs.crlv} 
            onUpload={() => setDocs(p => ({...p, crlv: true}))}
            preview="crlv-demo-preview"
          />
        </div>

        <div className="mt-8 p-4 bg-white/5 border border-white/5 rounded-2xl flex items-start gap-3">
          <Info size={16} className="text-rovya-orange shrink-0 mt-0.5" />
          <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider leading-relaxed">
            Exigência local: A categoria deve ser A e o EAR deve estar visível na CNH.
          </p>
        </div>

        <div className="pt-10">
          <button 
            onClick={handleNext}
            className="w-full h-16 bg-rovya-orange text-white rounded-3xl font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3 hover:bg-rovya-orange/90 active:scale-95 transition-all shadow-xl shadow-black/20"
          >
            Confirmar Documentos
            <ArrowRight size={16} strokeWidth={3} />
          </button>
        </div>
      </main>
    </div>
  );
}

function DocUploader({ label, uploaded, onUpload, preview }: { label: string, uploaded: boolean, onUpload: () => void, preview: string }) {
  return (
    <div className={`p-6 rounded-3xl border transition-all ${uploaded ? "bg-white/5 border-rovya-green/30" : "bg-white/5 border-white/5 hover:border-white/20"}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <FileText size={20} className={uploaded ? "text-rovya-green" : "text-white/30"} />
          <span className="text-xs font-black uppercase tracking-widest text-porcelain">{label}</span>
        </div>
        {uploaded && <FileCheck size={20} className="text-rovya-green" />}
      </div>
      
      {!uploaded ? (
        <button 
          onClick={onUpload}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/5 transition-all"
        >
          <Upload size={16} />
          Simular Upload
        </button>
      ) : (
        <div className="w-full aspect-video bg-navy/50 rounded-xl flex items-center justify-center border border-white/10">
          <span className="text-[9px] font-bold uppercase tracking-widest text-white/20 uppercase">Preview {preview}</span>
        </div>
      )}
    </div>
  );
}
