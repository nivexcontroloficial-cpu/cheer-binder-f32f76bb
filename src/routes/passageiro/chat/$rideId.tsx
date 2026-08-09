import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  MoreVertical, 
  Shield, 
  Flag, 
  Phone, 
  Check, 
  CheckCheck, 
  AlertCircle,
  Clock,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/passageiro/chat/$rideId")({
  component: ChatScreen,
});

type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

interface Message {
  id: string;
  text: string;
  sender: "passenger" | "driver";
  timestamp: Date;
  status: MessageStatus;
  attachment?: string | undefined;
}

const DEFAULT_MESSAGES: Message[] = [
  {
    id: "1",
    text: "Olá Rafael, estou chegando ao local de embarque.",
    sender: "driver",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    status: "read",
  },
  {
    id: "2",
    text: "Estou em uma Honda CG 160 Vermelha.",
    sender: "driver",
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    status: "read",
  }
];

function ChatScreen() {
  const { rideId } = useParams({ from: "/passageiro/chat/$rideId" });
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showProtectedCall, setShowProtectedCall] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>(DEFAULT_MESSAGES);
  const [isHydrated, setIsHydrated] = useState(false);

  // Read from localStorage on client only
  useEffect(() => {
    const storageKey = `chat_history_${rideId}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const validMessages: Message[] = parsed
            .map((m: unknown): Message | null => {
              if (!m || typeof m !== 'object') return null;
              const msg = m as Record<string, unknown>;
              
              // Minimal validation
              if (
                typeof msg.id !== 'string' ||
                typeof msg.text !== 'string' ||
                (msg.sender !== 'passenger' && msg.sender !== 'driver') ||
                !['sending', 'sent', 'delivered', 'read', 'failed'].includes(msg.status as string)
              ) {
                return null;
              }

              const timestamp = new Date(msg.timestamp as string);
              if (isNaN(timestamp.getTime())) return null;

              return {
                id: msg.id,
                text: msg.text,
                sender: msg.sender as "passenger" | "driver",
                timestamp,
                status: msg.status as MessageStatus,
                // Do NOT restore attachments
              };
            })
            .filter((m): m is Message => m !== null);

          if (validMessages.length > 0) {
            setMessages(validMessages);
          }
        }
      }
    } catch (error) {
      console.error("Error parsing chat history:", error);
      localStorage.removeItem(storageKey);
    } finally {
      setIsHydrated(true);
    }
  }, [rideId]);

  // Save to localStorage only after hydration
  useEffect(() => {
    if (!isHydrated) return;

    const storageKey = `chat_history_${rideId}`;
    try {
      // Remove attachments before saving
      const messagesToSave = messages.map(({ attachment, ...rest }) => rest);
      localStorage.setItem(storageKey, JSON.stringify(messagesToSave));
    } catch (error) {
      console.error("Error saving chat history:", error);
    }

    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, rideId, isHydrated]);

  const handleSendMessage = (text = inputText) => {
    if (!text.trim() && !selectedFile) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "passenger",
      timestamp: new Date(),
      status: "sending",
      attachment: selectedFile || undefined
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText("");
    setSelectedFile(null);

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: "sent" } : m));
    }, 800);

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: "delivered" } : m));
    }, 1500);

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: "read" } : m));
      
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const reply: Message = {
            id: (Date.now() + 1).toString(),
            text: "Combinado! Já te vejo.",
            sender: "driver",
            timestamp: new Date(),
            status: "read",
          };
          setMessages(prev => [...prev, reply]);
        }, 2000);
      }, 1000);
    }, 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result as string);
        toast.info("Foto anexada à mensagem.");
      };
      reader.readAsDataURL(file);
    }
  };

  const resendMessage = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: "sending" } : m));
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: "sent" } : m));
    }, 1000);
  };

  const handleReport = () => {
    toast.success("Mensagem denunciada. Nossa equipe de segurança irá analisar.");
  };

  const quickReplies = [
    "Estou saindo!",
    "Estou no local.",
    "Pode me esperar?",
    "Ok, obrigado."
  ];

  return (
    <div className="flex h-screen flex-col bg-[#F8FAFC] font-sans text-navy">
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate({ to: '/passageiro/corrida/$rideId', params: { rideId } })}
            className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-navy active:scale-95 transition-all"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-slate-200 overflow-hidden border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop" 
                  alt="Carlos H."
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-blue-500 border-2 border-white"></div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-sm font-black italic tracking-tighter text-navy uppercase leading-none">Carlos H.</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Online</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">• Visto há 2 min</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setShowProtectedCall(true)}
            className="h-10 w-10 bg-slate-50 text-navy rounded-xl flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all"
          >
            <Phone size={18} strokeWidth={2.5} />
          </button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="h-10 w-10 bg-slate-50 text-navy rounded-xl flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all">
                <MoreVertical size={18} strokeWidth={2.5} />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl max-w-[90vw] w-[320px]">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-black italic tracking-tighter text-navy uppercase">Opções do Chat</AlertDialogTitle>
                <AlertDialogDescription className="text-xs font-medium text-slate-500">
                  Gerencie sua conversa com o piloto.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex flex-col gap-2 py-2">
                <button 
                  onClick={() => {
                    toast.info("Monitoramento de segurança intensificado.");
                  }}
                  className="flex items-center gap-3 w-full p-4 rounded-2xl bg-slate-50 text-navy hover:bg-slate-100 transition-colors text-left"
                >
                  <Shield size={18} className="text-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-widest">Ativar Segurança</span>
                </button>
                <button 
                  onClick={handleReport}
                  className="flex items-center gap-3 w-full p-4 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-left"
                >
                  <Flag size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Denunciar Conversa</span>
                </button>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-2xl border-slate-200 text-xs font-bold uppercase tracking-widest">Fechar</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-porcelain/50"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-white/80 border border-slate-100 px-4 py-1.5 rounded-full shadow-sm">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Conversa segura e criptografada
            </span>
          </div>
        </div>

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.sender === 'passenger' ? 'items-end' : 'items-start'}`}
          >
            <div className={`
              max-w-[80%] rounded-2xl p-4 shadow-sm relative group
              ${msg.sender === 'passenger' 
                ? 'bg-navy text-white rounded-tr-none' 
                : 'bg-white text-navy border border-slate-100 rounded-tl-none'}
            `}>
              {msg.attachment && (
                <div className="mb-2 rounded-xl overflow-hidden bg-slate-100">
                  <img src={msg.attachment} alt="Anexo" className="w-full h-auto max-h-48 object-cover" />
                </div>
              )}
              <p className="text-[13px] font-medium leading-relaxed">{msg.text}</p>
              
              <div className={`flex items-center gap-1.5 mt-2 justify-end`}>
                <span className={`text-[9px] font-bold opacity-50 uppercase`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                
                {msg.sender === 'passenger' && (
                  <div className="flex items-center">
                    {msg.status === 'sending' && <Clock size={10} className="animate-pulse" />}
                    {msg.status === 'sent' && <Check size={10} />}
                    {msg.status === 'delivered' && <CheckCheck size={10} />}
                    {msg.status === 'read' && <CheckCheck size={10} className="text-blue-400" />}
                    {msg.status === 'failed' && (
                      <button onClick={() => resendMessage(msg.id)} className="text-red-400">
                        <AlertCircle size={10} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            {msg.status === 'failed' && (
              <span className="text-[8px] text-red-500 font-black uppercase mt-1 tracking-widest">
                Falha no envio. Toque para tentar novamente.
              </span>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex flex-col items-start">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-white border-t border-slate-100 p-4 pb-safe z-10">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(reply)}
              className="whitespace-nowrap px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>

        {selectedFile && (
          <div className="mb-4 relative inline-block">
            <div className="h-16 w-16 rounded-xl overflow-hidden border-2 border-blue-500">
              <img src={selectedFile} className="w-full h-full object-cover" alt="Preview" />
            </div>
            <button 
              onClick={() => setSelectedFile(null)}
              className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <label className="h-12 w-12 bg-slate-50 text-navy rounded-2xl flex items-center justify-center cursor-pointer active:scale-95 transition-all">
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            <Paperclip size={20} strokeWidth={2.5} />
          </label>
          
          <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 flex items-center">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Envie uma mensagem..."
              className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium placeholder:text-slate-400"
            />
          </div>

          <button 
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() && !selectedFile}
            className={`
              h-12 w-12 rounded-2xl flex items-center justify-center transition-all active:scale-95
              ${(inputText.trim() || selectedFile) ? 'bg-navy text-white shadow-lg' : 'bg-slate-100 text-slate-300'}
            `}
          >
            <Send size={20} strokeWidth={2.5} />
          </button>
        </div>
      </footer>

      {showProtectedCall && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-sm p-10 flex flex-col items-center text-center gap-6 shadow-2xl animate-in zoom-in duration-300">
            <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <Phone size={40} strokeWidth={2} className="animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-black italic tracking-tighter text-navy uppercase">Chamada Protegida</h3>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                Seu número real nunca será compartilhado. A conexão é feita através do nosso servidor seguro.
              </p>
            </div>

            <div className="w-full bg-slate-50 border border-slate-100 p-4 rounded-3xl flex flex-col gap-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Número Virtual Temporário</span>
              <span className="text-lg font-black italic tracking-tighter text-navy">(43) 4004-9827</span>
            </div>

            <div className="flex flex-col w-full gap-3 mt-4">
              <Button 
                onClick={() => {
                  toast.success("Ligando...");
                  setShowProtectedCall(false);
                }}
                className="w-full bg-navy text-white h-14 rounded-2xl text-xs font-black uppercase tracking-widest"
              >
                Iniciar Chamada
              </Button>
              <button 
                onClick={() => setShowProtectedCall(false)}
                className="text-xs font-bold text-slate-400 uppercase tracking-widest py-2"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}