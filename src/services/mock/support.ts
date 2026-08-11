import {
  AccountHealth,
  AccountHealthStatus,
  AccountOccurrence,
  CancellationConsequence,
} from "../../types/account-health";

export type ProtocolStatus = "nova" | "em_triagem" | "aguardando_informacoes" | "resolvida";
export type UrgencyLevel = "baixa" | "media" | "alta" | "critica";

export interface ProtocolEvent {
  id: string;
  status: ProtocolStatus;
  message: string;
  timestamp: string;
}

export interface SupportProtocol {
  id: string;
  rideId: string;
  category: string;
  description: string;
  status: ProtocolStatus;
  urgency: UrgencyLevel;
  createdAt: string;
  updatedAt: string;
  timeline: ProtocolEvent[];
}

export const CATEGORIES = [
  { id: "direcao_perigosa", label: "Direção Perigosa" },
  { id: "assedio", label: "Assédio" },
  { id: "discriminacao", label: "Discriminação" },
  { id: "ameaca_agressao", label: "Ameaça/Agressão" },
  { id: "piloto_diferente", label: "Piloto Diferente" },
  { id: "veiculo_divergente", label: "Moto/Placa Diferente" },
  { id: "capacete", label: "Problemas com Capacete" },
  { id: "desvio", label: "Desvio de Rota" },
  { id: "cobranca_maior", label: "Cobrança Maior" },
  { id: "pagamento", label: "Problemas no Pagamento" },
  { id: "acidente", label: "Acidente" },
  { id: "outro", label: "Outro" },
];

export const MOCK_PROTOCOLS: SupportProtocol[] = [
  {
    id: "PR-2026-001",
    rideId: "ride-1",
    category: "veiculo_divergente",
    description: "Placa da moto era diferente da mostrada no app.",
    status: "resolvida",
    urgency: "media",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    timeline: [
      {
        id: "e1",
        status: "nova",
        message: "Denúncia recebida pelo sistema.",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "e2",
        status: "em_triagem",
        message: "Caso encaminhado para equipe de conformidade.",
        timestamp: new Date(Date.now() - 4.5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "e3",
        status: "resolvida",
        message: "O piloto foi advertido e a ocorrência registrada em seu perfil.",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "PR-2026-002",
    rideId: "ride-2",
    category: "direcao_perigosa",
    description: "O piloto estava em alta velocidade no corredor.",
    status: "em_triagem",
    urgency: "alta",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    timeline: [
      {
        id: "e1",
        status: "nova",
        message: "Denúncia recebida.",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "e2",
        status: "em_triagem",
        message: "Analisando telemetria da corrida.",
        timestamp: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
];

export const MOCK_ACCOUNT_HEALTH: AccountHealth = {
  status: "excellent",
  score: 98,
  lastUpdated: new Date().toISOString(),
  occurrences: [
    {
      id: "occ-1",
      type: "cancellation",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Cancelamento após 5 min de espera",
      impactScore: -2,
      rideId: "RY-2026-00712",
    },
    {
      id: "occ-2",
      type: "other",
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Pontualidade exemplar (Bonus)",
      impactScore: 5,
    },
  ],
};

export const getHealthLabel = (status: AccountHealthStatus): string => {
  const labels: Record<AccountHealthStatus, string> = {
    excellent: "Excelente",
    on_track: "Em dia",
    attention: "Atenção",
    risk: "Risco",
    suspended: "Suspensa",
    under_review: "Em análise",
    banned: "Banida",
  };
  return labels[status];
};

export const getHealthColor = (status: AccountHealthStatus): string => {
  const colors: Record<AccountHealthStatus, string> = {
    excellent: "text-emerald-500 bg-emerald-50 border-emerald-100",
    on_track: "text-blue-500 bg-blue-50 border-blue-100",
    attention: "text-amber-500 bg-amber-50 border-amber-100",
    risk: "text-orange-500 bg-orange-50 border-orange-100",
    suspended: "text-red-500 bg-red-50 border-red-100",
    under_review: "text-slate-500 bg-slate-50 border-slate-100",
    banned: "text-black bg-slate-100 border-slate-200",
  };
  return colors[status];
};

export const calculateCancellationConsequence = (
  rideState: "before_accept" | "tolerance" | "driving" | "arrived",
  reasonId: string,
): CancellationConsequence => {
  const protectedReasons = ["pilot_asked", "different_vehicle", "safety_concern", "system_error"];

  if (protectedReasons.includes(reasonId)) {
    return {
      fee: 0,
      impact: "none",
      message:
        "Este cancelamento não afetará sua pontuação por ser um motivo de segurança ou operacional.",
      canCancelFree: true,
    };
  }

  if (rideState === "before_accept") {
    return {
      fee: 0,
      impact: "none",
      message: "Você pode cancelar agora sem taxas ou impacto na conta.",
      canCancelFree: true,
    };
  }

  if (rideState === "tolerance") {
    return {
      fee: 0,
      impact: "low",
      message: "Cancelamento dentro do tempo de tolerância. Sem taxa, mas monitorado.",
      canCancelFree: true,
    };
  }

  if (rideState === "driving") {
    return {
      fee: 5.5,
      impact: "medium",
      message:
        "Taxa de R$ 5,50 aplicada pelo deslocamento do piloto. Impacto moderado na saúde da conta.",
      canCancelFree: false,
    };
  }

  return {
    fee: 8.0,
    impact: "high",
    message: "Taxa de R$ 8,00 aplicada (Piloto no local). Impacto alto na saúde da conta.",
    canCancelFree: false,
  };
};

export const getStatusLabel = (status: ProtocolStatus) => {
  const labels: Record<ProtocolStatus, string> = {
    nova: "Nova",
    em_triagem: "Em triagem",
    aguardando_informacoes: "Aguardando informações",
    resolvida: "Resolvida",
  };
  return labels[status];
};

export const getUrgencyColor = (urgency: UrgencyLevel) => {
  const colors: Record<UrgencyLevel, string> = {
    baixa: "bg-blue-100 text-blue-700",
    media: "bg-amber-100 text-amber-700",
    alta: "bg-orange-100 text-orange-700",
    critica: "bg-red-100 text-red-700",
  };
  return colors[urgency];
};
