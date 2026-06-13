import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const INITIAL_SERVICES = [
  { id: 'S1', name: 'General Service', price: 2500, category: 'Mechanical' },
  { id: 'S2', name: 'Oil Change', price: 1200, category: 'Mechanical' },
  { id: 'S3', name: 'Brake Pad Replacement', price: 1800, category: 'Mechanical' },
  { id: 'S4', name: 'AC Servicing', price: 1500, category: 'Mechanical' },
  { id: 'S5', name: 'Tyre Rotation & Alignment', price: 800, category: 'Mechanical' },
  { id: 'S6', name: 'Battery Replacement', price: 4500, category: 'Mechanical' },
  { id: 'S7', name: 'Body Dent & Paint (Per Panel)', price: 3000, category: 'Body Shop' },
  { id: 'S8', name: 'Premium Water Wash', price: 600, category: 'Water Wash' },
  { id: 'S9', name: 'Interior Detailing', price: 1500, category: 'Water Wash' },
];

const INITIAL_COMPANY = {
  companyName: 'DVSOS Premium Auto Services',
  address: '123 Automotive Ave, Metro City',
  phone: '+91 98765 43210',
  email: 'service@dvsos.in',
  gstNumber: '29ABCDE1234F1Z5',
  defaultTaxRate: 18,
};

const useMasterDataStore = create(
  persist(
    (set) => ({
      companySettings: INITIAL_COMPANY,
      masterServices: INITIAL_SERVICES,

      updateCompanySettings: (newSettings) =>
        set((state) => ({
          companySettings: { ...state.companySettings, ...newSettings },
        })),

      addService: (service) =>
        set((state) => ({
          masterServices: [
            ...state.masterServices,
            { ...service, id: `S${Date.now()}` },
          ],
        })),

      updateService: (id, updatedService) =>
        set((state) => ({
          masterServices: state.masterServices.map((s) =>
            s.id === id ? { ...s, ...updatedService } : s
          ),
        })),

      deleteService: (id) =>
        set((state) => ({
          masterServices: state.masterServices.filter((s) => s.id !== id),
        })),
    }),
    {
      name: 'dvsos-master-data',
    }
  )
);

export default useMasterDataStore;
