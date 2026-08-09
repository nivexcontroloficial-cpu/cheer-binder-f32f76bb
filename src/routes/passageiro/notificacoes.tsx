import { createFileRoute } from "@tanstack/react-router";
import { 
  Bell, 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  Clock,
  MoreVertical,
  Check,
  Settings,
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

// Mock de notificações
const INITIAL_NOTIFICATIONS = [
  {
    id: "n1",
    title: "Corrida Concluída",
    message: "Sua viagem com Carlos Henrique foi finalizada. Avalie agora!",
    type: "success",
    isRead: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "n2",
    title: "Promoção Ativa",
    message: "Ganhe 10% de desconto usando o cupom ROVYA10 na próxima viagem.",
    type: "info",
    isRead: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "n3",
    title: "Segurança em Primeiro Lugar",
    message: "Lembre-se de sempre conferir a placa da moto e o nome do piloto.",
    type: "warning",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "n4",
    title: "Atualização de Cadastro",
    message: "Sua foto de perfil foi aprovada com sucesso.",
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

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-navy/5 flex items-center justify-center text-navy relative">
            <Bell size={20} strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rovya-red text-[8px] font-black text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-navy uppercase">Notificações</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Avisos e novidades</p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <MoreVertical size={20} className="text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 w-48 p-2">
            <DropdownMenuItem onClick={markAllAsRead} className="rounded-xl text-xs font-bold text-navy uppercase tracking-wider gap-2">
              <Check size={14} /> Marcar todas
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl text-xs font-bold text-navy uppercase tracking-wider gap-2">
              <Settings size={14} /> Preferências
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-8">
        {groupedNotifications.today.length > 0 && (
          <section>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Hoje</h2>
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
          <section>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Anteriores</h2>
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
          <div className="py-20 text-center bg-white border border-dashed border-slate-200 rounded-[32px]">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Bell size={32} />
            </div>
            <p className="text-sm font-bold text-navy uppercase tracking-tight">Tudo em dia!</p>
            <p className="text-xs text-slate-400 mt-1 px-10">Você não tem novas notificações por enquanto.</p>
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
      onClick={onRead}
      className={`group relative p-4 bg-white border rounded-[24px] transition-all hover:border-navy/10 cursor-pointer ${
        !notification.isRead ? 'border-navy/5 shadow-sm' : 'border-slate-100 opacity-80'
      }`}
    >
      <div className="flex gap-4">
        <div className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center ${iconColor}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[13px] font-black text-navy leading-tight truncate">
              {notification.title}
            </h3>
            {!notification.isRead && (
              <span className="h-2 w-2 rounded-full bg-rovya-orange animate-pulse" />
            )}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-2 line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            <Clock size={10} />
            {format(new Date(notification.createdAt), "dd MMM, HH:mm", { locale: ptBR })}
          </div>
        </div>
      </div>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-4 right-4 p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
