import { 
  ALL_DRIVERS, 
  ALL_RIDES, 
  ALL_INVOICES, 
  ALL_COMPLAINTS, 
  ALL_CANCELLATIONS 
} from "../../mocks/fixtures";

const MOCK_DELAY = 600;

export const mockService = {
  getDrivers: async () => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return ALL_DRIVERS;
  },
  
  getRides: async () => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return ALL_RIDES;
  },
  
  getInvoices: async () => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return ALL_INVOICES;
  },
  
  getComplaints: async () => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return ALL_COMPLAINTS;
  },
  
  getCancellations: async () => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return ALL_CANCELLATIONS;
  }
};
