export type AccountHealthStatus = 
  | 'excellent' 
  | 'on_track' 
  | 'attention' 
  | 'risk' 
  | 'suspended' 
  | 'under_review' 
  | 'banned';

export interface AccountOccurrence {
  id: string;
  type: 'cancellation' | 'complaint' | 'safety' | 'other';
  date: string;
  description: string;
  impactScore: number; // Positive or negative
  rideId?: string;
  isContested?: boolean;
  contestationReason?: string;
  contestationStatus?: 'pending' | 'accepted' | 'rejected';
}

export interface AccountHealth {
  status: AccountHealthStatus;
  score: number; // 0 to 100
  occurrences: AccountOccurrence[];
  lastUpdated: string;
}

export interface CancellationConsequence {
  fee: number;
  impact: 'none' | 'low' | 'medium' | 'high';
  message: string;
  canCancelFree: boolean;
}
