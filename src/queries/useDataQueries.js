import { useQuery } from '@tanstack/react-query';
import { getVehiclesApi, getVehicleApi, getVehicleHistoryApi, searchVehiclesApi } from '../api/vehicleApi';
import { getJobCardsApi, getJobCardApi } from '../api/jobCardApi';
import { getApprovalsApi } from '../api/approvalApi';
import { getUsersApi } from '../api/userApi';
import { getServicesApi, getBrandsApi, getModelsApi, getPricingApi } from '../api/masterApi';
import { customerApi } from '../api/customerApi';

// ─── MOCK DATA ────────────────────────────────────────────
const MOCK_VEHICLES = {
  data: [
    { id: '1', vehicleNumber: 'TN 01 AB 1234', ownerName: 'Ramesh Kumar', mobile: '9876543210', makeModel: 'Hyundai i20', type: 'HATCHBACK', fuelType: 'PETROL', status: 'IN_PROGRESS', entryTime: '2024-06-12T08:00:00Z' },
    { id: '2', vehicleNumber: 'KA 05 XY 9876', ownerName: 'Priya Singh', mobile: '9876543211', makeModel: 'Maruti Swift', type: 'HATCHBACK', fuelType: 'PETROL', status: 'PENDING', entryTime: '2024-06-12T09:15:00Z' },
    { id: '3', vehicleNumber: 'MH 12 PQ 4567', ownerName: 'Arun Patel', mobile: '9876543212', makeModel: 'Honda City', type: 'SEDAN', fuelType: 'PETROL', status: 'COMPLETED', entryTime: '2024-06-12T07:30:00Z' },
    { id: '4', vehicleNumber: 'DL 04 RS 3344', ownerName: 'Suresh Nair', mobile: '9876543213', makeModel: 'Toyota Fortuner', type: 'SUV', fuelType: 'DIESEL', status: 'DELAYED', entryTime: '2024-06-11T10:00:00Z' },
    { id: '5', vehicleNumber: 'TN 09 LM 8899', ownerName: 'Deepa Menon', mobile: '9876543214', makeModel: 'Mahindra XUV500', type: 'SUV', fuelType: 'DIESEL', status: 'BODY_SHOP', entryTime: '2024-06-12T08:45:00Z' },
    { id: '6', vehicleNumber: 'AP 16 ZZ 7700', ownerName: 'Kiran Reddy', mobile: '9876543215', makeModel: 'Tata Nexon', type: 'SUV', fuelType: 'ELECTRIC', status: 'WATER_WASH', entryTime: '2024-06-12T11:00:00Z' },
  ],
  total: 6,
  page: 1,
  limit: 10,
};

const MOCK_JOB_CARDS = {
  data: [
    { id: 'JC001', vehicleNumber: 'TN 01 AB 1234', ownerName: 'Ramesh Kumar', ownerMobile: '9876543210', serviceType: 'GENERAL_SERVICE', status: 'IN_PROGRESS', estimatedCost: 3500, technician: 'Rajan M.', createdAt: '2024-06-12T08:00:00Z', services: ['Oil Change', 'Brake Check', 'AC Service'] },
    { id: 'JC002', vehicleNumber: 'KA 05 XY 9876', ownerName: 'Priya Singh', ownerMobile: '9876543211', serviceType: 'OIL_CHANGE', status: 'PENDING', estimatedCost: 1200, technician: '', createdAt: '2024-06-12T09:15:00Z', services: ['Oil Change'] },
    { id: 'JC003', vehicleNumber: 'MH 12 PQ 4567', ownerName: 'Arun Patel', ownerMobile: '9876543212', serviceType: 'BODY_REPAIR', status: 'COMPLETED', estimatedCost: 18500, technician: 'Vikram S.', createdAt: '2024-06-12T07:30:00Z', services: ['Body Repair', 'Paint Job'] },
    { id: 'JC004', vehicleNumber: 'DL 04 RS 3344', ownerName: 'Suresh Nair', ownerMobile: '9876543213', serviceType: 'ENGINE_REPAIR', status: 'DELAYED', estimatedCost: 25000, technician: 'Anand P.', createdAt: '2024-06-11T10:00:00Z', services: ['Engine Repair', 'Brake Service'] },
    { id: 'JC005', vehicleNumber: 'TN 09 LM 8899', ownerName: 'Deepa Menon', ownerMobile: '9876543214', serviceType: 'GENERAL_SERVICE', status: 'BODY_SHOP', estimatedCost: 8000, technician: 'Rajan M.', createdAt: '2024-06-12T08:45:00Z', services: ['General Service', 'Tyre Rotation'] },
  ],
  total: 5,
  page: 1,
  limit: 10,
};

const MOCK_APPROVALS = {
  data: [
    { id: 'APV001', jobCardId: 'JC001', vehicleNumber: 'TN 01 AB 1234', customerName: 'Ramesh Kumar', type: 'ADDITIONAL_WORK', description: 'Engine timing belt replacement required', estimatedCost: 8500, status: 'PENDING', requestedBy: 'Rajan M.', createdAt: '2024-06-12T10:00:00Z' },
    { id: 'APV002', jobCardId: 'JC004', vehicleNumber: 'DL 04 RS 3344', customerName: 'Suresh Nair', type: 'COST_ESCALATION', description: 'Additional parts required for engine repair', estimatedCost: 5000, status: 'PENDING', requestedBy: 'Anand P.', createdAt: '2024-06-12T09:30:00Z' },
    { id: 'APV003', jobCardId: 'JC002', vehicleNumber: 'KA 05 XY 9876', customerName: 'Priya Singh', type: 'PART_REPLACEMENT', description: 'Air filter needs replacement', estimatedCost: 1200, status: 'APPROVED', requestedBy: 'Vikram S.', createdAt: '2024-06-11T14:00:00Z', approvedAt: '2024-06-11T15:30:00Z', remarks: 'Approved as requested' },
    { id: 'APV004', jobCardId: 'JC003', vehicleNumber: 'MH 12 PQ 4567', customerName: 'Arun Patel', type: 'ADDITIONAL_WORK', description: 'Additional dent removal needed', estimatedCost: 3500, status: 'REJECTED', requestedBy: 'Rajan M.', createdAt: '2024-06-11T12:00:00Z', approvedAt: '2024-06-11T13:00:00Z', remarks: 'Customer declined' },
  ],
  total: 4,
};

const MOCK_USERS = {
  data: [
    { id: 'U001', name: 'Ramesh Kumar', email: 'ramesh@dvsos.com', mobile: '9876543210', role: 'MANAGER', status: 'ACTIVE', lastLogin: '2024-06-12T08:00:00Z' },
    { id: 'U002', name: 'Priya Singh', email: 'priya@dvsos.com', mobile: '9876543211', role: 'CRM_TEAM', status: 'ACTIVE', lastLogin: '2024-06-12T09:00:00Z' },
    { id: 'U003', name: 'Arun Gate', email: 'arun@dvsos.com', mobile: '9876543212', role: 'GATE_SECURITY', status: 'ACTIVE', lastLogin: '2024-06-12T07:30:00Z' },
    { id: 'U004', name: 'Suresh Floor', email: 'suresh@dvsos.com', mobile: '9876543213', role: 'FLOOR_SUPERVISOR', status: 'ACTIVE', lastLogin: '2024-06-11T18:00:00Z' },
    { id: 'U005', name: 'Deepa MD', email: 'deepa@dvsos.com', mobile: '9876543214', role: 'MD', status: 'ACTIVE', lastLogin: '2024-06-12T10:00:00Z' },
    { id: 'U006', name: 'Kiran Admin', email: 'kiran@dvsos.com', mobile: '9876543215', role: 'SUPER_ADMIN', status: 'ACTIVE', lastLogin: '2024-06-12T08:30:00Z' },
  ],
  total: 6,
};

// ─── VEHICLE QUERIES ─────────────────────────────────────
export const useVehicles = (params = {}) => {
  return useQuery({
    queryKey: ['vehicles', params],
    queryFn: async () => {
      try { return await getVehiclesApi(params); }
      catch { return MOCK_VEHICLES; }
    },
    staleTime: 30000,
  });
};

export const useVehicle = (id) => {
  return useQuery({
    queryKey: ['vehicles', id],
    queryFn: async () => {
      try { return await getVehicleApi(id); }
      catch { return MOCK_VEHICLES.data.find((v) => v.id === id) || null; }
    },
    enabled: !!id,
  });
};

export const useVehicleHistory = (id) => {
  return useQuery({
    queryKey: ['vehicles', id, 'history'],
    queryFn: async () => {
      try { return await getVehicleHistoryApi(id); }
      catch {
        return [
          { id: 'H1', date: '2024-05-10', serviceType: 'General Service', cost: 3200, technician: 'Rajan M.' },
          { id: 'H2', date: '2024-03-22', serviceType: 'Oil Change', cost: 900, technician: 'Vikram S.' },
          { id: 'H3', date: '2024-01-15', serviceType: 'Brake Service', cost: 2500, technician: 'Anand P.' },
        ];
      }
    },
    enabled: !!id,
  });
};

// ─── JOB CARD QUERIES ────────────────────────────────────
export const useJobCards = (params = {}) => {
  return useQuery({
    queryKey: ['job-cards', params],
    queryFn: async () => {
      try { return await getJobCardsApi(params); }
      catch { return MOCK_JOB_CARDS; }
    },
    staleTime: 30000,
  });
};

export const useJobCard = (id) => {
  return useQuery({
    queryKey: ['job-cards', id],
    queryFn: async () => {
      try { return await getJobCardApi(id); }
      catch { return MOCK_JOB_CARDS.data.find((j) => j.id === id) || null; }
    },
    enabled: !!id,
  });
};

// ─── APPROVAL QUERIES ────────────────────────────────────
export const useApprovals = (params = {}) => {
  return useQuery({
    queryKey: ['approvals', params],
    queryFn: async () => {
      try { return await getApprovalsApi(params); }
      catch { return MOCK_APPROVALS; }
    },
    staleTime: 20000,
    refetchInterval: 30000,
  });
};

// ─── USER QUERIES ────────────────────────────────────────
export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      try { return await getUsersApi(params); }
      catch { return MOCK_USERS; }
    },
    staleTime: 60000,
  });
};

// ─── CUSTOMER QUERIES ────────────────────────────────────
export const useCustomers = (params = {}) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customerApi.getCustomers(params),
    staleTime: 60000,
  });
};

export const useCustomerDetails = (id) => {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => customerApi.getCustomerDetail(id),
    enabled: !!id,
  });
};

// ─── MASTER QUERIES ──────────────────────────────────────
export const useServices = () => {
  return useQuery({
    queryKey: ['masters', 'services'],
    queryFn: async () => {
      try { return await getServicesApi(); }
      catch {
        return { data: [
          { id: 'S1', name: 'General Service', category: 'Maintenance', price: 3000, isActive: true },
          { id: 'S2', name: 'Oil Change', category: 'Maintenance', price: 800, isActive: true },
          { id: 'S3', name: 'Brake Service', category: 'Repair', price: 2000, isActive: true },
          { id: 'S4', name: 'Body Repair', category: 'Body', price: 15000, isActive: true },
          { id: 'S5', name: 'Paint Job', category: 'Body', price: 20000, isActive: true },
          { id: 'S6', name: 'AC Service', category: 'Electrical', price: 2500, isActive: true },
          { id: 'S7', name: 'Water Wash', category: 'Cleaning', price: 300, isActive: true },
        ]};
      }
    },
    staleTime: 300000,
  });
};

export const useBrands = () => {
  return useQuery({
    queryKey: ['masters', 'brands'],
    queryFn: async () => {
      try { return await getBrandsApi(); }
      catch {
        return { data: [
          { id: 'B1', name: 'Hyundai', country: 'South Korea', isActive: true },
          { id: 'B2', name: 'Maruti Suzuki', country: 'India', isActive: true },
          { id: 'B3', name: 'Honda', country: 'Japan', isActive: true },
          { id: 'B4', name: 'Toyota', country: 'Japan', isActive: true },
          { id: 'B5', name: 'Mahindra', country: 'India', isActive: true },
          { id: 'B6', name: 'Tata', country: 'India', isActive: true },
        ]};
      }
    },
    staleTime: 300000,
  });
};

export const useModels = (brandId) => {
  return useQuery({
    queryKey: ['masters', 'models', brandId],
    queryFn: async () => {
      try { return await getModelsApi(brandId); }
      catch {
        return { data: [
          { id: 'M1', brandId: 'B1', name: 'i20', fuelType: 'PETROL', year: 2023 },
          { id: 'M2', brandId: 'B1', name: 'Creta', fuelType: 'DIESEL', year: 2023 },
          { id: 'M3', brandId: 'B2', name: 'Swift', fuelType: 'PETROL', year: 2023 },
          { id: 'M4', brandId: 'B3', name: 'City', fuelType: 'PETROL', year: 2023 },
        ]};
      }
    },
    staleTime: 300000,
  });
};

export const usePricing = () => {
  return useQuery({
    queryKey: ['masters', 'pricing'],
    queryFn: async () => {
      try { return await getPricingApi(); }
      catch {
        return { data: [
          { id: 'P1', serviceName: 'General Service', vehicleType: 'SEDAN', price: 3000, isActive: true },
          { id: 'P2', serviceName: 'General Service', vehicleType: 'SUV', price: 4500, isActive: true },
          { id: 'P3', serviceName: 'Oil Change', vehicleType: 'SEDAN', price: 800, isActive: true },
          { id: 'P4', serviceName: 'Oil Change', vehicleType: 'SUV', price: 1200, isActive: true },
        ]};
      }
    },
    staleTime: 300000,
  });
};
