import { z } from 'zod';

export const approvalActionSchema = z.object({
  remarks: z.string().min(3, 'Please provide a remark'),
});

export const approvalSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  description: z.string().min(5, 'Description required'),
  estimatedCost: z.coerce.number().min(0),
  jobCardId: z.string().min(1, 'Job Card reference required'),
});
