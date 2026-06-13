export const WORKFLOW_STAGES = [
  { key: 'GATE_ENTRY', label: 'Gate Entry' },
  { key: 'JOB_CARD_PENDING', label: 'Job Card Pending' },
  { key: 'CUSTOMER_APPROVAL', label: 'Customer Approval' },
  { key: 'MECHANICAL', label: 'Mechanical Work' },
  { key: 'ADDITIONAL_APPROVAL', label: 'Additional Approval' },
  { key: 'BODY_SHOP', label: 'Body Shop' },
  { key: 'WATER_WASH', label: 'Water Wash' },
  { key: 'READY_FOR_DELIVERY', label: 'Ready for Delivery' },
  { key: 'DELIVERED', label: 'Delivered' },
];

export const SLA_LIMITS_MINUTES = {
  JOB_CARD_CREATION: 30,
  CUSTOMER_APPROVAL_FOLLOWUP: 60,
  MECHANICAL_QUEUE: 240,
  BODY_SHOP_QUEUE: 480,
  WATER_WASH_QUEUE: 90,
};

