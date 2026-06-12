import { z } from 'zod';

export const vehicleSchema = z.object({
  vehicleNumber: z.string().min(4, 'Enter a valid vehicle number').toUpperCase(),
  ownerName: z.string().min(2, 'Owner name is required'),
  ownerMobile: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
  makeModel: z.string().min(2, 'Make & Model is required'),
  notes: z.string().optional(),
});
