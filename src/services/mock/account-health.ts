import { AccountHealth, AccountHealthStatus, AccountOccurrence, CancellationConsequence } from '../../types/account-health';

export const MOCK_ACCOUNT_HEALTH: AccountHealth = {
  status: 'excellent',
  score: 98,
  lastUpdated: new Date().toISOString(),
  occurrences: [
    {
      id: 'occ-1',
      type: 'cancellation',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Cancelamento após 5 min de espera',
      impactScore: -2,
      rideId: 'RY-2026-00712'
    },
    {
      id: 'occ-2',
      type: 'other',
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Pontualidade exemplar (Bonus)',
      impactScore: 5
    }
  ]
};

export const getHealthLabel = (status: AccountHealthStatus): string => {
  const labels: Record<AccountHealthStatus, string> = {
    excellent: 'Excelente',
    on_track: 'Em dia',
    attention: 'Atenção',
    risk: 'Risco',
    suspended: 'Suspensa',
    under_review: 'Em análise',
    banned: 'Banida'
  };
  return labels[status];
};

export const getHealthColor = (status: AccountHealthStatus): string => {
  const colors: Record<AccountHealthStatus, string> = {
    excellent: 'text-emerald-500 bg-emerald-50 border-emerald-100',
    on_track: 'text-blue-500 bg-blue-50 border-blue-100',
    attention: 'text-amber-500 bg-amber-50 border-amber-100',
    risk: 'text-orange-500 bg-orange-50 border-orange-100',
    suspended: 'text-red-500 bg-red-50 border-red-100',
    under_review: 'text-slate-500 bg-slate-50 border-slate-100',
    banned: 'text-black bg-slate-100 border-slate-200'
  };
  return colors[status];
};

export const calculateCancellationConsequence = (
  rideState: 'before_accept' | 'tolerance' | 'driving' | 'arrived',
  reasonId: string
): CancellationConsequence => {
  // Motivos protegidos
  const protectedReasons = ['pilot_asked', 'different_vehicle', 'safety_concern', 'system_error'];
  
  if (protectedReasons.includes(reasonId)) {
    return {
      fee: 0,
      impact: 'none',
      message: 'Este cancelamento não afetará sua pontuação por ser um motivo de segurança ou operacional.',
      canCancelFree: true
    };
  }

  if (rideState === 'before_accept') {
    return {
      fee: 0,
      impact: 'none',
      message: 'Você pode cancelar agora sem taxas ou impacto na conta.',
      canCancelFree: true
    };
  }

  if (rideState === 'tolerance') {
    return {
      fee: 0,
      impact: 'low',
      message: 'Cancelamento dentro do tempo de tolerância. Sem taxa, mas monitorado.',
      canCancelFree: true
    };
  }

  if (rideState === 'driving') {
    return {
      fee: 5.50,
      impact: 'medium',
      message: 'Taxa de R$ 5,50 aplicada pelo deslocamento do piloto. Impacto moderado na saúde da conta.',
      canCancelFree: false
    };
  }

  // arrived
  return {
    fee: 8.00,
    impact: 'high',
    message: 'Taxa de R$ 8,00 aplicada (Piloto no local). Impacto alto na saúde da conta.',
    canCancelFree: false
  };
};
