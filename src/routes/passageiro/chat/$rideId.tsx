import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ACTIVE_PASSENGER_DEMO_RIDE } from "@/data/passenger-demo-rides";
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
  X,
  Ban,
  ImageIcon,
  MessageSquareX,
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
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
}

const DEFAULT_MESSAGES: Message[] = [
  {
    id: "m1",
    text: "Olá Rafael, estou chegando ao local de embarque.",
    sender: "driver",
    timestamp: new Date("2026-08-11T10:30:00Z"),
    status: "read",
  },
  {
    id: "m2",
    text: "Estou saindo!",
    sender: "passenger",
    timestamp: new Date("2026-08-11T10:31:00Z"),
    status: "read",
  },
  {
    id: "m3",
    text: "Perfeito, te aguardo no ponto de encontro combinado.",
    sender: "driver",
    timestamp: new Date("2026-08-11T10:31:00Z"),
    status: "read",
  },
];

function formatMessageTime(date: Date) {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  });
}

function ChatScreen() {
  const { rideId } = useParams({ from: "/passageiro/chat/$rideId" });
  const isValidRide = useMemo(() => rideId === ACTIVE_PASSENGER_DEMO_RIDE.id, [rideId]);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Timers management
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const addTimer = useCallback(
    (callback: () => void, ms: number) => {
      if (!isValidRide) return null;
      const timerId = setTimeout(() => {
        timersRef.current.delete(timerId);
        callback();
      }, ms);
      timersRef.current.add(timerId);
      return timerId;
    },
    [isValidRide],
  );

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current.clear();
  }, []);

  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showProtectedCall, setShowProtectedCall] = useState(false);
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const isBlockedRef = useRef(isBlocked);
  const messageCounterRef = useRef(4); // Inicia após m1, m2, m3

  useEffect(() => {
    isBlockedRef.current = isBlocked;
  }, [isBlocked]);

  const [lastActivity, setLastActivity] = useState<string>("agora");

  const [messages, setMessages] = useState<Message[]>(DEFAULT_MESSAGES);
  const [hydratedRideId, setHydratedRideId] = useState<string | null>(null);

  // Removido localStorage e hidratação variável para garantir chat determinístico e volátil
  useEffect(() => {
    setMessages(DEFAULT_MESSAGES);
    messageCounterRef.current = 4;
  }, [rideId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = useCallback(
    (text = inputText) => {
      const trimmedText = text.trim();
      if (!trimmedText || isBlocked || !isValidRide) return;

      const newMessageId = `m${messageCounterRef.current++}`;
      const newMessage: Message = {
        id: newMessageId,
        text: trimmedText,
        sender: "passenger",
        timestamp: new Date(),
        status: "sending",
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputText("");

      if (simulateFailure) {
        setSimulateFailure(false);
        addTimer(() => {
          setMessages((prev) =>
            prev.map((m) => (m.id === newMessageId ? { ...m, status: "failed" } : m)),
          );
        }, 1000);
        return;
      }

      // Fluxo normal de estados
      addTimer(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === newMessageId ? { ...m, status: "sent" } : m)),
        );

        addTimer(() => {
          setMessages((prev) =>
            prev.map((m) => (m.id === newMessageId ? { ...m, status: "delivered" } : m)),
          );

          addTimer(() => {
            setMessages((prev) =>
              prev.map((m) => (m.id === newMessageId ? { ...m, status: "read" } : m)),
            );

            // Resposta simulada após visualização
            if (!isBlockedRef.current) {
              addTimer(() => {
                if (isBlockedRef.current) return;
                setIsTyping(true);
                addTimer(() => {
                  if (isBlockedRef.current) {
                    setIsTyping(false);
                    return;
                  }
                  setIsTyping(false);
                  const reply: Message = {
                    id: `m${messageCounterRef.current++}`,
                    text: "Recebido. Te aguardo no local.",
                    sender: "driver",
                    timestamp: new Date(),
                    status: "read",
                  };
                  setMessages((prev) => [...prev, reply]);
                  setLastActivity("agora");
                }, 2500);
              }, 1000);
            }
          }, 1500);
        }, 1000);
      }, 800);
    },
    [inputText, hasFakeAttachment, isBlocked, simulateFailure, addTimer, isValidRide],
  );

  const resendMessage = (id: string) => {
    if (!isValidRide) return;
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: "sending" } : m)));

    addTimer(() => {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: "sent" } : m)));
      addTimer(() => {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: "delivered" } : m)));
        addTimer(() => {
          setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: "read" } : m)));

          if (!isBlockedRef.current) {
            addTimer(() => {
              if (isBlockedRef.current) return;
              setIsTyping(true);
              addTimer(() => {
                if (isBlockedRef.current) {
                  setIsTyping(false);
                  return;
                }
                setIsTyping(false);
                const reply: Message = {
                id: `m${messageCounterRef.current++}`,
                text: "Certo, estou chegando.",
                  sender: "driver",
                  timestamp: new Date(),
                  status: "read",
                };
                setMessages((prev) => [...prev, reply]);
                setLastActivity("agora");
              }, 2000);
            }, 1000);
          }
        }, 1500);
      }, 1000);
    }, 1000);
  };

  const handleReport = () => {
    toast.info("Demonstração: nenhuma denúncia real foi enviada.");
    navigate({ to: "/passageiro/denunciar/$rideId", params: { rideId } });
  };

  const quickReplies = ["Estou saindo!", "Estou no local.", "Pode me esperar?", "Ok, obrigado."];

  if (!isValidRide) {
    return (
      <div className="flex h-screen flex-col bg-[#F8FAFC] font-sans text-navy">
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-4 z-10 shrink-0">
          <Link
            to="/passageiro/mensagens"
            className="h-11 w-11 bg-slate-50 rounded-xl flex items-center justify-center text-navy active:scale-95 transition-all focus:ring-2 focus:ring-navy focus:outline-none"
            aria-label="Voltar para mensagens"
          >
            <ArrowLeft size={20} strokeWidth={2.5} aria-hidden="true" />
          </Link>
          <span className="text-sm font-black italic tracking-tighter text-navy uppercase leading-none">
            Conversa não encontrada
          </span>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-6">
          <div className="bg-white/80 border border-slate-100 px-4 py-1.5 rounded-full shadow-sm mb-4">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
              Aviso de demonstração — Recurso simulado
            </span>
          </div>

          <div className="h-24 w-24 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-300">
            <MessageSquareX size={48} strokeWidth={1.5} aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-black italic tracking-tighter text-navy uppercase leading-tight">
              Conversa simulada não encontrada
            </h1>
            <p className="text-xs font-medium text-slate-500 max-w-[240px] mx-auto">
              Nenhuma conversa real foi consultada. Este ID não faz parte do fluxo demonstrativo.
            </p>
          </div>

          <div className="flex flex-col w-full gap-3 mt-4 max-w-[280px]">
            <Link
              to="/passageiro/mensagens"
              className="flex items-center justify-center w-full bg-navy text-white h-14 rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all focus:ring-2 focus:ring-navy focus:outline-offset-2"
            >
              Ver Minhas Mensagens
            </Link>
            <Link
              to="/passageiro/inicio"
              className="flex items-center justify-center w-full bg-white border border-slate-200 text-navy h-14 rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all focus:ring-2 focus:ring-navy focus:outline-offset-2"
            >
              Ir para o Início
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#F8FAFC] font-sans text-navy">
      <h1 className="sr-only">Chat simulado da corrida</h1>
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate({ to: "/passageiro/corrida/$rideId", params: { rideId }, search: { technical: false } })}
            className="h-11 w-11 bg-slate-50 rounded-xl flex items-center justify-center text-navy active:scale-95 transition-all focus:ring-2 focus:ring-navy focus:outline-none"
            aria-label="Voltar para detalhes da corrida"
          >
            <ArrowLeft size={20} strokeWidth={2.5} aria-hidden="true" />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="h-10 w-10 rounded-xl bg-navy flex items-center justify-center border border-slate-100"
                role="img"
                aria-label={`Avatar de ${ACTIVE_PASSENGER_DEMO_RIDE.driver.name}`}
              >
                <span className="text-white font-black italic tracking-tighter text-sm uppercase">
                  CH
                </span>
              </div>
              <div
                className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-blue-500 border-2 border-white"
                aria-hidden="true"
              ></div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-sm font-black italic tracking-tighter text-navy uppercase leading-none">
                {ACTIVE_PASSENGER_DEMO_RIDE.driver.name}
              </h2>
              <div className="flex flex-col mt-0.5" aria-live="polite">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                    Online — simulado
                  </span>
                </div>
                <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                  Última atividade simulada: {lastActivity}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowProtectedCall(true)}
            className="h-11 w-11 bg-slate-50 text-navy rounded-xl flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all focus:ring-2 focus:ring-navy focus:outline-none"
            aria-label="Abrir simulação de chamada"
          >
            <Phone size={18} strokeWidth={2.5} aria-hidden="true" />
          </button>

          <AlertDialog open={showReportConfirm} onOpenChange={setShowReportConfirm}>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                className="h-11 w-11 bg-slate-50 text-navy rounded-xl flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all focus:ring-2 focus:ring-navy focus:outline-none"
                aria-label="Opções adicionais"
              >
                <MoreVertical size={18} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl max-w-[90vw] w-[320px]">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-black italic tracking-tighter text-navy uppercase">
                  Opções do Chat
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs font-medium text-slate-500">
                  Gerencie sua conversa com o piloto.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex flex-col gap-2 py-2">
                <button
                  type="button"
                  onClick={() => navigate({ to: "/passageiro/seguranca", search: { rideId } })}
                  className="flex items-center gap-3 w-full p-4 rounded-2xl bg-slate-50 text-navy hover:bg-slate-100 transition-colors text-left focus:ring-2 focus:ring-navy focus:outline-none"
                >
                  <Shield size={18} className="text-blue-500" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Central de Segurança
                  </span>
                </button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className={`flex items-center gap-3 w-full p-4 rounded-2xl transition-colors text-left focus:ring-2 focus:ring-navy focus:outline-none ${isBlocked ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-slate-50 text-navy hover:bg-slate-100"}`}
                    >
                      <Ban size={18} aria-hidden="true" />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        {isBlocked ? "Desbloquear Piloto" : "Bloquear Piloto — simulado"}
                      </span>
                    </button>
                  </AlertDialogTrigger>
                  {!isBlocked && (
                    <AlertDialogContent className="rounded-3xl max-w-[90vw] w-[320px]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-black italic tracking-tighter text-navy uppercase">
                          Bloquear piloto?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xs font-medium text-slate-500">
                          Esta ação é apenas local para demonstração e não afeta contas reais ou o
                          serviço de transporte.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex flex-col gap-2 mt-4 sm:flex-col">
                        <AlertDialogAction
                          onClick={() => {
                            isBlockedRef.current = true;
                            setIsBlocked(true);
                            setIsTyping(false);
                            toast.info("Piloto bloqueado localmente.");
                          }}
                          className="w-full bg-navy text-white rounded-2xl text-xs font-bold uppercase tracking-widest h-12"
                        >
                          Bloquear (Simulado)
                        </AlertDialogAction>
                        <AlertDialogCancel className="w-full rounded-2xl border-slate-200 text-xs font-bold uppercase tracking-widest h-12">
                          Cancelar
                        </AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  )}
                  {isBlocked && (
                    <AlertDialogContent className="rounded-3xl max-w-[90vw] w-[320px]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-black italic tracking-tighter text-navy uppercase">
                          Desbloquear piloto?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xs font-medium text-slate-500">
                          Esta ação apenas desfaz o bloqueio local da demonstração.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex flex-col gap-2 mt-4 sm:flex-col">
                        <AlertDialogAction
                          onClick={() => {
                            isBlockedRef.current = false;
                            setIsBlocked(false);
                            toast.info("Piloto desbloqueado localmente.");
                          }}
                          className="w-full bg-navy text-white rounded-2xl text-xs font-bold uppercase tracking-widest h-12"
                        >
                          Desbloquear
                        </AlertDialogAction>
                        <AlertDialogCancel className="w-full rounded-2xl border-slate-200 text-xs font-bold uppercase tracking-widest h-12">
                          Cancelar
                        </AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  )}
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-3 w-full p-4 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-left focus:ring-2 focus:ring-red-600 focus:outline-none"
                    >
                      <Flag size={18} aria-hidden="true" />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        Denunciar Conversa
                      </span>
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-3xl max-w-[90vw] w-[320px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-black italic tracking-tighter text-navy uppercase">
                        Confirmar Denúncia?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-xs font-medium text-slate-500">
                        Você será encaminhado para a tela de denúncia para relatar o ocorrido.
                        Nenhuma denúncia real será enviada.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col gap-2 mt-4 sm:flex-col">
                      <AlertDialogAction
                        onClick={handleReport}
                        className="w-full bg-red-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest h-12"
                      >
                        Confirmar
                      </AlertDialogAction>
                      <AlertDialogCancel className="w-full rounded-2xl border-slate-200 text-xs font-bold uppercase tracking-widest h-12">
                        Voltar
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <div className="flex items-center gap-3 w-full p-4 rounded-2xl bg-slate-50 text-navy">
                  <input
                    type="checkbox"
                    id="sim-fail"
                    checked={simulateFailure}
                    onChange={(e) => setSimulateFailure(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-navy focus:ring-navy"
                  />
                  <label
                    htmlFor="sim-fail"
                    className="text-[10px] font-bold uppercase tracking-widest cursor-pointer"
                  >
                    Simular falha no próximo envio
                  </label>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-2xl border-slate-200 text-xs font-bold uppercase tracking-widest h-10">
                  Fechar
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-porcelain/50"
        aria-live="polite"
      >
        <div className="flex justify-center mb-6 text-center">
          <div className="bg-white/80 border border-slate-100 px-4 py-1.5 rounded-full shadow-sm max-w-[90%]">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
              Conversa simulada — Nenhuma mensagem utiliza internet ou telefone
            </span>
          </div>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "passenger" ? "items-end" : "items-start"}`}
          >
            <div
              className={`
              max-w-[80%] rounded-2xl p-4 shadow-sm relative group
              ${
                msg.sender === "passenger"
                  ? "bg-navy text-white rounded-tr-none"
                  : "bg-white text-navy border border-slate-100 rounded-tl-none"
              }
            `}
            >
              <p className="text-[13px] font-medium leading-relaxed">{msg.text}</p>

              <div className="flex items-center gap-1.5 mt-2 justify-end">
                <span
                  className="text-[9px] font-bold opacity-50 uppercase"
                  aria-label={`Enviada às ${formatMessageTime(msg.timestamp)}`}
                >
                  {formatMessageTime(msg.timestamp)}
                </span>

                {msg.sender === "passenger" && (
                  <div
                    className="flex items-center"
                    aria-label={`Status: ${msg.status}. Horário: ${formatMessageTime(msg.timestamp)}`}
                  >
                    {msg.status === "sending" && (
                      <Clock size={10} className="animate-pulse" aria-hidden="true" />
                    )}
                    {msg.status === "sent" && <Check size={10} aria-hidden="true" />}
                    {msg.status === "delivered" && <CheckCheck size={10} aria-hidden="true" />}
                    {msg.status === "read" && (
                      <CheckCheck size={10} className="text-blue-400" aria-hidden="true" />
                    )}
                    {msg.status === "failed" && (
                      <AlertCircle size={10} className="text-red-400" aria-hidden="true" />
                    )}
                  </div>
                )}

                {msg.sender === "driver" && (
                  <div
                    className="flex items-center"
                    aria-label={`Horário: ${formatMessageTime(msg.timestamp)}`}
                  />
                )}

                {msg.sender === "passenger" && (
                  <span className="sr-only">
                    Status:{" "}
                    {msg.status === "sending"
                      ? "Enviando"
                      : msg.status === "sent"
                        ? "Enviada"
                        : msg.status === "delivered"
                          ? "Entregue"
                          : msg.status === "read"
                            ? "Visualizada"
                            : "Falha no envio"}
                  </span>
                )}
              </div>
            </div>
            {msg.status === "failed" && (
              <button
                type="button"
                onClick={() => resendMessage(msg.id)}
                className="flex items-center gap-1.5 mt-1 hover:opacity-80"
              >
                <span className="text-[8px] text-red-500 font-black uppercase tracking-widest">
                  Falha no envio. Reenviar mensagem
                </span>
                <AlertCircle size={10} className="text-red-500" aria-hidden="true" />
              </button>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex flex-col items-start" aria-live="polite">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce delay-150"></div>
                <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce delay-300"></div>
              </div>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                Carlos H. está digitando — simulado
              </span>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-white border-t border-slate-100 p-4 pb-safe z-10">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              type="button"
              disabled={isBlocked}
              onClick={() => handleSendMessage(reply)}
              className="whitespace-nowrap px-4 py-2 min-h-[44px] bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:grayscale focus:ring-2 focus:ring-navy focus:outline-none"
            >
              {reply}
            </button>
          ))}
        </div>


        {isBlocked && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-600">
              <Ban size={14} aria-hidden="true" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Bloqueio somente nesta demonstração
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                isBlockedRef.current = false;
                setIsBlocked(false);
              }}
              className="text-[9px] font-black uppercase tracking-widest text-red-600 underline min-h-[44px] px-2 flex items-center focus:ring-2 focus:ring-red-600 focus:outline-none"
            >
              Desbloquear
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">


          <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 flex items-center focus-within:ring-2 focus-within:ring-navy transition-all">
            <input
              type="text"
              id="chat-input"
              value={inputText}
              disabled={isBlocked}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={isBlocked ? "Piloto bloqueado" : "Envie uma mensagem..."}
              className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium placeholder:text-slate-400 disabled:opacity-50"
              aria-label="Campo de mensagem"
            />
          </div>

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isBlocked}
            className={`
              h-12 w-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 focus:ring-2 focus:ring-navy focus:outline-none
              ${inputText.trim() && !isBlocked ? "bg-navy text-white shadow-lg" : "bg-slate-100 text-slate-300"}
            `}
            aria-label="Enviar mensagem"
          >
            <Send size={20} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 flex justify-center">
          <span className="text-[7px] text-slate-300 font-bold uppercase tracking-[0.2em]">
            Histórico existe apenas neste navegador demonstrativo
          </span>
        </div>
      </footer>

      <Dialog open={showProtectedCall} onOpenChange={setShowProtectedCall}>
        <DialogContent className="rounded-[40px] w-full max-w-sm p-10 flex flex-col items-center text-center gap-6 shadow-2xl">
          <div
            className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600"
            aria-hidden="true"
          >
            <Phone size={40} strokeWidth={2} className="animate-pulse" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <DialogTitle className="text-xl font-black italic tracking-tighter text-navy uppercase">
              Chamada protegida — simulação
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-slate-500 leading-relaxed">
              Esta é uma demonstração visual. Nenhuma ligação será realizada e nenhum número pessoal
              será exibido ou utilizado.
            </DialogDescription>
          </div>

          <div className="flex flex-col w-full gap-3 mt-4">
            <Button
              type="button"
              onClick={() => {
                toast.success("Demonstração concluída: nenhuma ligação foi realizada.");
                setShowProtectedCall(false);
              }}
              className="w-full bg-navy text-white h-14 rounded-2xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-navy focus:outline-offset-2"
            >
              Encerrar demonstração
            </Button>
            <DialogClose asChild>
              <button
                type="button"
                className="text-xs font-bold text-slate-400 uppercase tracking-widest py-2 active:scale-95 transition-transform"
              >
                Voltar
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
