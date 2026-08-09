import { createFileRoute } from "@tanstack/react-router";
import { 
  Bell, 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  Clock,
  MoreVertical,
  Check,
  Trash2
} from "lucide-react";
import { useState, useMemo } from "react";
import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Banner } from "@/components/ui/banner";

// Mock de notificações simuladas para demonstração
const INITIAL_NOTIFICATIONS = [
  {
    id: "n1",
    title: "Simulação: Corrida Finalizada",
    message: "Esta é uma notificação simulada de uma viagem que teria ocorrido com um piloto fictício.",
    type: "success",
    isRead: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "n2",
    title: "Exemplo: Dica de Uso",
    message: "Em uma versão real, você receberia avisos sobre novidades e atualizações do sistema aqui.",
    type: "info",
    isRead: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "n3",
    title: "Aviso de Segurança (Demonstração)",
    message: "Lembre-se: em uma operação real, a conferência de dados do piloto é essencial para sua segurança.",
    type: "warning",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "n4",
    title: "Simulação: Perfil Atualizado",
    message: "Exemplo de como o sistema confirmaria a aprovação de seus dados em uma conta real.",
    type: "success",
    isRead: true,
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

export const Route = createFileRoute("/passageiro/notificacoes")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const groupedNotifications = useMemo(() => {
    const today = notifications.filter(n => isToday(new Date(n.createdAt)));
    const previous = notifications.filter(n => !isToday(new Date(n.createdAt)));
    return { today, previous };
  }, [notifications]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const hasUnread = unreadCount > 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <Banner 
        variant="info" 
        className="mb-6"
        message="Demonstração local: estas notificações e suas ações existem apenas nesta interface e não representam avisos reais."
      />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-navy/5 flex items-center justify-center text-navy relative">
            <Bell size={20} strokeWidth={2} aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rovya-red text-[8px] font-black text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-navy uppercase">Notificações</h1>
            <p 
              className="text-[10px] text-slate-400 font-bold uppercase tracking-widest"
              aria-live="polite"
            >
              {unreadCount === 0 
                ? "Nenhuma notificação nova" 
                : `${unreadCount} ${unreadCount === 1 ? 'notificação não lida' : 'notificações não lidas'}`
              }
            </p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-xl"
              aria-label="Opções de notificações"
              type="button"
            >
              <MoreVertical size={20} className="text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 w-48 p-2">
            <DropdownMenuItem 
              onClick={markAllAsRead} 
              disabled={!hasUnread}
              className="rounded-xl text-xs font-bold text-navy uppercase tracking-wider gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={14} /> Marcar todas como lidas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-8">
        {groupedNotifications.today.length > 0 && (
          <section aria-labelledby="section-today">
            <h2 id="section-today" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Hoje</h2>
            <div className="space-y-3">
              {groupedNotifications.today.map(n => (
                <NotificationItem 
                  key={n.id} 
                  notification={n} 
                  onRead={() => markAsRead(n.id)}
                  onDelete={() => deleteNotification(n.id)}
                />
              ))}
            </div>
          </section>
        )}

        {groupedNotifications.previous.length > 0 && (
          <section aria-labelledby="section-previous">
            <h2 id="section-previous" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Anteriores</h2>
            <div className="space-y-3">
              {groupedNotifications.previous.map(n => (
                <NotificationItem 
                  key={n.id} 
                  notification={n} 
                  onRead={() => markAsRead(n.id)}
                  onDelete={() => deleteNotification(n.id)}
                />
              ))}
            </div>
          </section>
        )}

        {notifications.length === 0 && (
          <div 
            className="py-20 text-center bg-white border border-dashed border-slate-200 rounded-[32px]"
            aria-live="polite"
          >
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Bell size={32} aria-hidden="true" />
            </div>
            <p className="text-sm font-bold text-navy uppercase tracking-tight">Tudo em dia!</p>
            <p className="text-xs text-slate-400 mt-1 px-10">Não existem notificações na demonstração atual.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationItem({ 
  notification, 
  onRead, 
  onDelete 
}: { 
  notification: typeof INITIAL_NOTIFICATIONS[0], 
  onRead: () => void,
  onDelete: () => void
}) {
  const Icon = notification.type === 'success' ? CheckCircle2 : 
               notification.type === 'warning' ? AlertTriangle : Info;
  
  const iconColor = notification.type === 'success' ? 'text-emerald-500 bg-emerald-50' : 
                    notification.type === 'warning' ? 'text-amber-500 bg-amber-50' : 'text-blue-500 bg-blue-50';

  return (
    <div 
      className={`group relative p-4 bg-white border rounded-[24px] transition-all hover:border-navy/10 flex gap-4 ${
        !notification.isRead ? 'border-navy/5 shadow-sm' : 'border-slate-100 opacity-80'
      }`}
    >
      <button
        type="button"
        onClick={onRead}
        className="flex flex-1 text-left items-start gap-4 focus:outline-none focus:ring-2 focus:ring-navy/20 rounded-xl"
        aria-label={`${notification.isRead ? '' : 'Não lida: '}${notification.title}. ${notification.message}. Clique para marcar como lida.`}
      >
        <div className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center ${iconColor}`}>
          <Icon size={20} aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[13px] font-black text-navy leading-tight truncate">
              {notification.title}
              {!notification.isRead && (
                <span className="sr-only"> (Não lida)</span>
              )}
            </h3>
            {!notification.isRead && (
              <span className="h-2 w-2 rounded-full bg-rovya-orange animate-pulse" aria-hidden="true" />
            )}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-2 line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            <Clock size={10} aria-hidden="true" />
            {format(new Date(notification.createdAt), "dd MMM, HH:mm", { locale: ptBR })}
          </div>
        </div>
      </button>
      
      <button 
        type="button"
        onClick={onDelete}
        className="absolute top-4 right-4 p-2 text-slate-300 hover:text-rose-500 group-focus-within:opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
        aria-label={`Excluir notificação: ${notification.title}`}
      >
        <Trash2 size={16} aria-hidden="true" />
      </button>
    </div>
  );
}