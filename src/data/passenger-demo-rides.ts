import { Ride, Driver, Vehicle } from "../types";

export interface DemoRide extends Omit<Ride, "driverId" | "vehicleId"> {
  driver: Driver;
  vehicle: Vehicle;
  paymentMethod: string;
  driverRating: number;
  driverTotalRides: number;
  driverTimeOnPlatform: string;
  pin: string;
}

/**
 * CANONICAL SOURCE FOR PASSENGER DEMO RIDES
 *
 * This file contains the deterministic mock data for the passenger flow.
 * Do not use Math.random() or new Date() at the module scope.
 */

export const ACTIVE_PASSENGER_DEMO_RIDE: DemoRide = {
  id: "ride-active-mock",
  passengerId: "p-123",
  origin: {
    address: "Centro, Jacarezinho",
    lat: -23.1611,
    lng: -49.9734,
  },
  destination: {
    address: "Shopping Jacarezinho — Centro, Jacarezinho",
    lat: -23.165,
    lng: -49.975,
  },
  status: "accepted",
  fare: 18.0,
  distance: 6.8,
  duration: 18,
  paymentMethod: "Dinheiro",
  requestedAt: "2026-08-11T14:00:00Z",
  pin: "4827",
  driver: {
    id: "d-456",
    name: "Carlos H.",
    email: "carlos@rovya.com",
    phone: "+55 43 99999-9999",
    status: "active",
    rating: 4.96,
    totalRides: 842,
    walletBalance: 0,
    activeVehicleId: "v-789",
    isOnline: true,
    createdAt: "2025-08-11T10:00:00Z",
  },
  vehicle: {
    id: "v-789",
    brand: "Honda",
    model: "CG 160",
    plate: "ABC1D23",
    color: "Vermelha",
    year: 2024,
    type: "moto",
  },
  driverRating: 4.96,
  driverTotalRides: 842,
  driverTimeOnPlatform: "1 ano",
};

export const COMPLETED_PASSENGER_DEMO_RIDE: DemoRide = {
  ...ACTIVE_PASSENGER_DEMO_RIDE,
  id: "RY-2026-00842",
  status: "completed",
  requestedAt: "2026-08-11T10:00:00-03:00",
  acceptedAt: "2026-08-11T10:02:00-03:00",
  startedAt: "2026-08-11T10:05:00-03:00",
  completedAt: "2026-08-11T10:23:00-03:00",
  duration: 18, // 10:23 - 10:05 = 18 min
};

/**
 * Utility to check if a ride ID is valid for the demo flows
 */
export const isValidRideId = (id: string): boolean => {
  return id === ACTIVE_PASSENGER_DEMO_RIDE.id || id === COMPLETED_PASSENGER_DEMO_RIDE.id;
};

/**
 * Utility to get ride data by ID
 */
export const getDemoRideById = (id: string): DemoRide | undefined => {
  if (id === ACTIVE_PASSENGER_DEMO_RIDE.id) return ACTIVE_PASSENGER_DEMO_RIDE;
  if (id === COMPLETED_PASSENGER_DEMO_RIDE.id) return COMPLETED_PASSENGER_DEMO_RIDE;
  return undefined;
};
