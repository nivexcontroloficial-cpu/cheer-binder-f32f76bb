export type UserStatus = 'active' | 'pending' | 'blocked' | 'suspended';
export type RideStatus = 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';
export type ComplaintStatus = 'open' | 'investigating' | 'resolved' | 'dismissed';

export interface Vehicle {
  id: string;
  model: string;
  brand: string;
  plate: string;
  color: string;
  year: number;
  type: 'moto' | 'car' | 'premium';
}

export interface Passenger {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: UserStatus;
  rating: number;
  totalRides: number;
  createdAt: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: UserStatus;
  rating: number;
  totalRides: number;
  walletBalance: number;
  activeVehicleId: string;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  isOnline: boolean;
  createdAt: string;
}

export interface Ride {
  id: string;
  passengerId: string;
  driverId?: string;
  vehicleId?: string;
  origin: {
    address: string;
    lat: number;
    lng: number;
  };
  destination: {
    address: string;
    lat: number;
    lng: number;
  };
  status: RideStatus;
  fare: number;
  distance: number;
  duration: number;
  requestedAt: string;
  acceptedAt?: string | undefined;
  startedAt?: string | undefined;
  completedAt?: string | undefined;
  cancelledAt?: string | undefined;
  cancellationReason?: string | undefined;
}

export interface FareRule {
  id: string;
  cityId: string;
  baseFare: number;
  pricePerKm: number;
  pricePerMinute: number;
  minimumFare: number;
  commissionRate: number;
}

export interface PlatformPlan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  features: string[];
}

export interface DriverInvoice {
  id: string;
  driverId: string;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  paidAt?: string | undefined;
  pixCode?: string | undefined;
}

export interface CityOperation {
  id: string;
  name: string;
  state: string;
  isActive: boolean;
  radiusKm: number;
  center: {
    lat: number;
    lng: number;
  };
}

export interface Shift {
  id: string;
  driverId: string;
  startedAt: string;
  endedAt?: string | undefined;
  totalEarned: number;
  totalRides: number;
}

export interface Complaint {
  id: string;
  rideId: string;
  reporterId: string;
  reportedId: string;
  type: 'behavior' | 'safety' | 'cleanliness' | 'other';
  description: string;
  status: ComplaintStatus;
  createdAt: string;
}

export interface Cancellation {
  id: string;
  rideId: string;
  userId: string;
  role: 'passenger' | 'driver' | 'admin';
  reason: string;
  createdAt: string;
}

export interface IntegrityMatch {
  id: string;
  rideId: string;
  driverId: string;
  passengerId: string;
  riskScore: number;
  alerts: string[];
  status: 'safe' | 'suspicious' | 'blocked';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  userId: string;
  action: string;
  resource: string;
  metadata: any;
  timestamp: string;
}
