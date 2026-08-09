import { 
  Passenger, 
  Driver, 
  Vehicle, 
  Ride, 
  CityOperation, 
  Complaint, 
  Cancellation, 
  DriverInvoice 
} from "../types";

export const MOCK_CITY: CityOperation = {
  id: "city-1",
  name: "Jacarezinho",
  state: "PR",
  isActive: true,
  radiusKm: 15,
  center: { lat: -23.1614, lng: -49.9733 }
};

export const MOCK_PASSENGERS: Passenger[] = [
  {
    id: "p1",
    name: "Rafael",
    email: "raf***@email.com",
    phone: "(43) 999**-**12",
    status: "active",
    rating: 4.9,
    totalRides: 42,
    createdAt: "2025-01-10T10:00:00Z"
  },
  {
    id: "p2",
    name: "Mariana",
    email: "mar***@email.com",
    phone: "(43) 988**-**45",
    status: "active",
    rating: 5.0,
    totalRides: 15,
    createdAt: "2025-02-15T14:30:00Z"
  }
];

export const MOCK_VEHICLE: Vehicle = {
  id: "v1",
  model: "Honda CG 160",
  brand: "Honda",
  plate: "ABC-***1",
  color: "Vermelha",
  year: 2023,
  type: "moto"
};

export const MOCK_DRIVER: Driver = {
  id: "d1",
  name: "Carlos Henrique",
  email: "car***@email.com",
  phone: "(43) 991**-**88",
  status: "active",
  rating: 4.8,
  totalRides: 156,
  walletBalance: 245.50,
  activeVehicleId: "v1",
  isOnline: true,
  createdAt: "2024-11-20T08:00:00Z"
};

// Gerador de mais motoristas (25 total)
export const ALL_DRIVERS: Driver[] = [
  MOCK_DRIVER,
  ...Array.from({ length: 24 }).map((_, i) => ({
    id: `d-${i + 2}`,
    name: `Motorista Teste ${i + 2}`,
    email: `driver${i + 2}***@email.com`,
    phone: `(43) 99***-***${i}`,
    status: (i % 10 === 0) ? "pending" : "active",
    rating: 4.5 + (Math.random() * 0.5),
    totalRides: Math.floor(Math.random() * 200),
    walletBalance: Math.floor(Math.random() * 500),
    activeVehicleId: `v-${i + 2}`,
    isOnline: Math.random() > 0.5,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
  }))
];

// Gerador de mais corridas (30 total)
export const ALL_RIDES: Ride[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `ride-${i + 1}`,
  passengerId: i % 2 === 0 ? "p1" : "p2",
  driverId: "d1",
  origin: { address: `Rua A, ${i + 10}`, lat: -23.16, lng: -49.97 },
  destination: { address: `Av B, ${i + 50}`, lat: -23.17, lng: -49.98 },
  status: i < 20 ? "completed" : i < 25 ? "cancelled" : "requested",
  fare: 10 + Math.random() * 30,
  distance: 2 + Math.random() * 5,
  duration: 5 + Math.random() * 15,
  requestedAt: new Date(Date.now() - i * 3600000).toISOString(),
  completedAt: i < 20 ? new Date(Date.now() - i * 3600000 + 15 * 60000).toISOString() : undefined,
  cancellationReason: i >= 20 && i < 25 ? "Desistência do passageiro" : undefined
}));

// Gerador de cobranças (8 total)
export const ALL_INVOICES: DriverInvoice[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `inv-${i + 1}`,
  driverId: "d1",
  amount: 25.00,
  dueDate: new Date(Date.now() + (i - 2) * 86400000).toISOString(),
  status: i < 4 ? "paid" : "pending",
  paidAt: i < 4 ? new Date(Date.now() - 86400000).toISOString() : undefined,
  pixCode: "pix-mock-key-123456789"
}));

// Gerador de denúncias (6 total)
export const ALL_COMPLAINTS: Complaint[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `comp-${i + 1}`,
  rideId: `ride-${i + 1}`,
  reporterId: "p1",
  reportedId: "d1",
  type: i % 2 === 0 ? "behavior" : "safety",
  description: "Descrição fictícia de denúncia para fins de teste de interface.",
  status: i < 3 ? "resolved" : "open",
  createdAt: new Date(Date.now() - i * 172800000).toISOString()
}));

// Gerador de cancelamentos (5 total)
export const ALL_CANCELLATIONS: Cancellation[] = Array.from({ length: 5 }).map((_, i) => ({
  id: `can-${i + 1}`,
  rideId: `ride-${i + 20}`,
  userId: "p1",
  role: "passenger",
  reason: "Demora para aceitar a corrida",
  createdAt: new Date(Date.now() - i * 3600000).toISOString()
}));
