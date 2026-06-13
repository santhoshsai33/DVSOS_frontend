import { z } from 'zod';

export const jobCardSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle is required'),
  vehicleNumber: z.string().min(4, 'Vehicle number is required'),
  ownerName: z.string().min(2, 'Owner name is required'),
  ownerMobile: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile'),
  makeModel: z.string().min(2, 'Make & Model is required'),
  serviceType: z.string().min(1, 'Service type is required'),
  estimatedCost: z.coerce.number().min(0, 'Estimated cost must be 0 or more').optional(),
  technician: z.string().optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  notes: z.string().optional(),
  services: z.array(z.string()).min(1, 'Select at least one service'),
  deliveryDate: z.string().min(1, 'Expected delivery date is required'),
});

export const additionalWorkSchema = z.object({
  description: z.string().min(5, 'Describe the additional work'),
  estimatedCost: z.coerce.number().min(0, 'Cost must be 0 or more'),
  reason: z.string().min(5, 'Reason is required'),
});
