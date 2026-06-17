import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const INITIAL_SERVICES = [
  { id: 'S1', name: 'General Service', price: 2500, category: 'Mechanical', estimatedMinutes: 120 },
  { id: 'S2', name: 'Oil Change', price: 1200, category: 'Mechanical', estimatedMinutes: 30 },
  { id: 'S3', name: 'Brake Pad Replacement', price: 1800, category: 'Mechanical', estimatedMinutes: 60 },
  { id: 'S4', name: 'AC Servicing', price: 1500, category: 'Mechanical', estimatedMinutes: 90 },
  { id: 'S5', name: 'Tyre Rotation & Alignment', price: 800, category: 'Mechanical', estimatedMinutes: 45 },
  { id: 'S6', name: 'Battery Replacement', price: 4500, category: 'Mechanical', estimatedMinutes: 15 },
  { id: 'S7', name: 'Body Dent & Paint (Per Panel)', price: 3000, category: 'Body Shop', estimatedMinutes: 240 },
  { id: 'S8', name: 'Premium Water Wash', price: 600, category: 'Water Wash', estimatedMinutes: 45 },
  { id: 'S9', name: 'Interior Detailing', price: 1500, category: 'Water Wash', estimatedMinutes: 90 },
];

const INITIAL_CATEGORIES = [
  { id: 'C1', name: 'Mechanical', description: 'Mechanical maintenance and repairs' },
  { id: 'C2', name: 'Body Shop', description: 'Denting, painting and panel work' },
  { id: 'C3', name: 'Water Wash', description: 'Washing and interior detailing' }
];

const INITIAL_STATES = [
  { id: 'ST1', name: 'Tamil Nadu', status: 'ACTIVE' },
  { id: 'ST2', name: 'Kerala', status: 'ACTIVE' },
  { id: 'ST3', name: 'Karnataka', status: 'ACTIVE' },
  { id: 'ST4', name: 'Maharashtra', status: 'ACTIVE' },
  { id: 'ST5', name: 'Andhra Pradesh', status: 'ACTIVE' },
];

const INITIAL_DISTRICTS = [
  { id: 'D1', name: 'Chennai', stateId: 'ST1', status: 'ACTIVE' },
  { id: 'D2', name: 'Coimbatore', stateId: 'ST1', status: 'ACTIVE' },
  { id: 'D3', name: 'Kochi', stateId: 'ST2', status: 'ACTIVE' },
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
      serviceCategories: INITIAL_CATEGORIES,
      masterStates: INITIAL_STATES,
      masterDistricts: INITIAL_DISTRICTS,

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

      addCategory: (category) =>
        set((state) => ({
          serviceCategories: [
            ...state.serviceCategories,
            { ...category, id: `C${Date.now()}` },
          ],
        })),

      updateCategory: (id, updatedCategory) =>
        set((state) => ({
          serviceCategories: state.serviceCategories.map((c) =>
            c.id === id ? { ...c, ...updatedCategory } : c
          ),
        })),

      deleteCategory: (id) =>
        set((state) => ({
          serviceCategories: state.serviceCategories.filter((c) => c.id !== id),
        })),

      addState: (newState) =>
        set((state) => ({
          masterStates: [
            ...state.masterStates,
            { ...newState, id: `ST${Date.now()}`, status: 'ACTIVE' },
          ],
        })),

      updateState: (id, updatedState) =>
        set((state) => ({
          masterStates: state.masterStates.map((s) =>
            s.id === id ? { ...s, ...updatedState } : s
          ),
        })),

      deleteState: (id) =>
        set((state) => ({
          masterStates: state.masterStates.filter((s) => s.id !== id),
        })),

      addDistrict: (newDistrict) =>
        set((state) => ({
          masterDistricts: [
            ...state.masterDistricts,
            { ...newDistrict, id: `D${Date.now()}`, status: 'ACTIVE' },
          ],
        })),

      updateDistrict: (id, updatedDistrict) =>
        set((state) => ({
          masterDistricts: state.masterDistricts.map((d) =>
            d.id === id ? { ...d, ...updatedDistrict } : d
          ),
        })),

      deleteDistrict: (id) =>
        set((state) => ({
          masterDistricts: state.masterDistricts.filter((d) => d.id !== id),
        })),
    }),
    {
      name: 'dvsos-master-data-v3',
    }
  )
);

export default useMasterDataStore;
