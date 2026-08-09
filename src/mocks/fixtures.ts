import { 
  Passenger, 
  Driver, 
  Vehicle, 
  Ride, 
  CityOperation, 
  Complaint, 
  Cancellation, 
  DriverInvoice,
  UserStatus
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
  plate: "ABC1D23",
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

export const ALL_DRIVERS: Driver[] = [
  MOCK_DRIVER,
  {
    id: "d2",
    name: "João Silva",
    email: "joao***@email.com",
    phone: "(43) 992**-**11",
    status: "active",
    rating: 4.7,
    totalRides: 89,
    walletBalance: 120.00,
    activeVehicleId: "v2",
    isOnline: true,
    createdAt: "2024-12-05T09:00:00Z"
  },
  {
    id: "d3",
    name: "Marcos Oliveira",
    email: "marcos***@email.com",
    phone: "(43) 993**-**22",
    status: "active",
    rating: 4.9,
    totalRides: 210,
    walletBalance: 450.00,
    activeVehicleId: "v3",
    isOnline: false,
    createdAt: "2024-10-15T10:00:00Z"
  }
];

export const ALL_RIDES: Ride[] = [
  {
    id: "RY-2026-00842",
    passengerId: "p1",
    driverId: "d1",
    origin: { address: "Avenida Getúlio Vargas, 890 - Centro", lat: -23.1614, lng: -49.9733 },
    destination: { address: "Shopping Jacarezinho, Centro", lat: -23.17, lng: -49.98 },
    status: "completed",
    fare: 18.00,
    distance: 4.2,
    duration: 12,
    requestedAt: "2026-08-08T14:30:00Z",
    completedAt: "2026-08-08T14:45:00Z"
  },
  {
    id: "RY-2026-00712",
    passengerId: "p1",
    driverId: "d2",
    origin: { address: "Terminal Rodoviário, Centro", lat: -23.16, lng: -49.97 },
    destination: { address: "Rua São João, 123 - Vila Setti", lat: -23.15, lng: -49.96 },
    status: "cancelled",
    fare: 12.50,
    distance: 2.8,
    duration: 8,
    requestedAt: "2026-08-07T10:00:00Z",
    cancellationReason: "Demora para aceitar a corrida"
  },
  {
    id: "RY-2026-00650",
    passengerId: "p1",
    driverId: "d1",
    origin: { address: "Praça Rui Barbosa, Centro", lat: -23.1614, lng: -49.9733 },
    destination: { address: "Universidade Estadual do Norte do Paraná", lat: -23.18, lng: -49.99 },
    status: "completed",
    fare: 15.00,
    distance: 3.5,
    duration: 10,
    requestedAt: "2026-08-05T18:20:00Z",
    completedAt: "2026-08-05T18:35:00Z"
  }
];

export const ALL_INVOICES: DriverInvoice[] = [
  {
    id: "INV-2026-001",
    driverId: "d1",
    amount: 25.00,
    dueDate: "2026-08-15T23:59:59Z",
    status: "pending",
    pixCode: "pix-mock-key-123456789"
  }
];

export const ALL_COMPLAINTS: Complaint[] = [
  {
    id: "PR-2026-001",
    rideId: "RY-2026-00650",
    reporterId: "p1",
    reportedId: "d1",
    type: "behavior",
    description: "Piloto foi muito educado e prestativo.",
    status: "resolved",
    createdAt: "2026-08-05T19:00:00Z"
  }
];

export const ALL_CANCELLATIONS: Cancellation[] = [
  {
    id: "CAN-2026-001",
    rideId: "RY-2026-00712",
    userId: "p1",
    role: "passenger",
    reason: "Demora para aceitar a corrida",
    createdAt: "2026-08-07T10:05:00Z"
  }
];

