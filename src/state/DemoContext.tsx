import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ALL_DRIVERS, 
  ALL_RIDES, 
  ALL_INVOICES, 
  ALL_COMPLAINTS, 
  ALL_CANCELLATIONS 
} from '../mocks/fixtures';
import { Driver, Ride, DriverInvoice, Complaint, Cancellation } from '../types';

interface DemoContextType {
  drivers: Driver[];
  rides: Ride[];
  invoices: DriverInvoice[];
  complaints: Complaint[];
  cancellations: Cancellation[];
  resetData: () => void;
  addRideToHistory: (ride: Ride) => void;
  loginPilot: () => void;
  isLoading: boolean;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drivers, setDrivers] = useState<Driver[]>(ALL_DRIVERS);
  const [rides, setRides] = useState<Ride[]>(ALL_RIDES);
  const [invoices, setInvoices] = useState<DriverInvoice[]>(ALL_INVOICES);
  const [complaints, setComplaints] = useState<Complaint[]>(ALL_COMPLAINTS);
  const [cancellations, setCancellations] = useState<Cancellation[]>(ALL_CANCELLATIONS);
  const [isLoading, setIsLoading] = useState(false);

  // Persistência em localStorage (opcional conforme prompt)
  useEffect(() => {
    const saved = localStorage.getItem('rovya_demo_data');
    if (saved) {
      const data = JSON.parse(saved);
      setDrivers(data.drivers);
      setRides(data.rides);
      setInvoices(data.invoices);
      complaints && setComplaints(data.complaints);
      cancellations && setCancellations(data.cancellations);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rovya_demo_data', JSON.stringify({
      drivers, rides, invoices, complaints, cancellations
    }));
  }, [drivers, rides, invoices, complaints, cancellations]);

  const resetData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDrivers(ALL_DRIVERS);
      setRides(ALL_RIDES);
      setInvoices(ALL_INVOICES);
      setComplaints(ALL_COMPLAINTS);
      setCancellations(ALL_CANCELLATIONS);
      setIsLoading(false);
    }, 500);
  };

  const addRideToHistory = (ride: Ride) => {
    setRides(prev => [ride, ...prev]);
  };

  const loginPilot = () => {
    // Apenas simulação de estado de login
    console.log("Piloto logado na demo");
  };


  return (
    <DemoContext.Provider value={{
      drivers,
      rides,
      invoices,
      complaints,
      cancellations,
      resetData,
      addRideToHistory,
      loginPilot,
      isLoading
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
