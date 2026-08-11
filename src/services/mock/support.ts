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
