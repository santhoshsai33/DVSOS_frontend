export const STATUS = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  DELAYED: 'DELAYED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  READY: 'READY',
  DELIVERED: 'DELIVERED',
  BODY_SHOP: 'BODY_SHOP',
  WATER_WASH: 'WATER_WASH',
  CANCELLED: 'CANCELLED',
};

export const STATUS_LABELS = {
  PENDING: 'Pending',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  DELAYED: 'Delayed',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  READY: 'Ready for Delivery',
  DELIVERED: 'Delivered',
  BODY_SHOP: 'Body Shop',
  WATER_WASH: 'Water Wash',
  CANCELLED: 'Cancelled',
};

export const STATUS_VARIANTS = {
  PENDING: 'warning',
  ASSIGNED: 'info',
  IN_PROGRESS: 'primary',
  COMPLETED: 'success',
  DELAYED: 'danger',
  APPROVED: 'success',
  REJECTED: 'danger',
  READY: 'success',
  DELIVERED: 'secondary',
  BODY_SHOP: 'info',
  WATER_WASH: 'info',
  CANCELLED: 'secondary',
};

export const SERVICE_TYPES = [
  { value: 'GENERAL_SERVICE', label: 'General Service' },
  { value: 'OIL_CHANGE', label: 'Oil Change' },
  { value: 'BRAKE_SERVICE', label: 'Brake Service' },
  { value: 'TYRE_SERVICE', label: 'Tyre Service' },
  { value: 'ENGINE_REPAIR', label: 'Engine Repair' },
  { value: 'BODY_REPAIR', label: 'Body Repair' },
  { value: 'PAINT_JOB', label: 'Paint Job' },
  { value: 'ELECTRICAL', label: 'Electrical Work' },
  { value: 'AC_SERVICE', label: 'AC Service' },
  { value: 'WASHING', label: 'Washing & Cleaning' },
  { value: 'INSPECTION', label: 'Full Inspection' },
  { value: 'CUSTOM', label: 'Custom Service' },
];

export const FUEL_TYPES = [
  { value: 'PETROL', label: 'Petrol' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'ELECTRIC', label: 'Electric' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'CNG', label: 'CNG' },
];

export const VEHICLE_TYPES = [
  { value: 'SEDAN', label: 'Sedan' },
  { value: 'SUV', label: 'SUV' },
  { value: 'HATCHBACK', label: 'Hatchback' },
  { value: 'TRUCK', label: 'Truck' },
  { value: 'VAN', label: 'Van' },
  { value: 'BUS', label: 'Bus' },
  { value: 'TWO_WHEELER', label: 'Two Wheeler' },
];

export const APPROVAL_TYPES = [
  { value: 'ADDITIONAL_WORK', label: 'Additional Work' },
  { value: 'COST_ESCALATION', label: 'Cost Escalation' },
  { value: 'PART_REPLACEMENT', label: 'Part Replacement' },
  { value: 'INSURANCE_CLAIM', label: 'Insurance Claim' },
];
