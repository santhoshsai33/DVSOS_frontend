import { z } from 'zod';

export const serviceSchema = z.object({
  name: z.string().min(2, 'Service name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const brandSchema = z.object({
  name: z.string().min(2, 'Brand name is required').regex(/^[a-zA-Z0-9\s]+$/, 'Special characters and symbols are not allowed').regex(/[a-zA-Z]/, 'Brand name must contain at least one letter'),
  country: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const modelSchema = z.object({
  brandId: z.string().min(1, 'Brand is required'),
  name: z.string().min(2, 'Model name is required'),
  year: z.coerce.number().min(1990).max(2030).optional(),
  fuelType: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const pricingSchema = z.object({
  serviceId: z.string().min(1, 'Service is required'),
  vehicleType: z.string().min(1, 'Vehicle type is required'),
  price: z.coerce.number().min(0, 'Price must be 0 or more'),
  isActive: z.boolean().default(true),
});
