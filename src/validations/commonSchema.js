import { z } from 'zod';

export const commonValidations = {
  // Required strings
  requiredString: (fieldName) => z.string().trim().min(1, `${fieldName} is required`),
  
  // Optional strings (allows empty or missing)
  optionalString: z.string().trim().optional().or(z.literal('')),
  
  // Alpha-numeric (no special characters except space)
  alphaNumeric: (fieldName) =>
    z.string()
      .trim()
      .min(1, `${fieldName} is required`)
      .regex(/^[a-zA-Z0-9\s]+$/, 'Special characters and symbols are not allowed')
      .regex(/[a-zA-Z]/, `${fieldName} must contain at least one letter`),
      
  // Letters only
  lettersOnly: (fieldName) =>
    z.string()
      .trim()
      .min(1, `${fieldName} is required`)
      .regex(/^[a-zA-Z\s]+$/, 'Special characters and numbers are not allowed'),
      
  // Numbers & IDs
  requiredNumber: (fieldName) => z.coerce.number({ required_error: `${fieldName} is required`, invalid_type_error: `${fieldName} is required` }).min(1, `${fieldName} is required`),
  requiredUnionId: (fieldName) => z.union([z.string(), z.number()]).refine(val => !!val, { message: `Please select a ${fieldName}` }),
  positiveAmount: (fieldName) => z.coerce.number({ required_error: `${fieldName} is required` }).min(0, `${fieldName} cannot be negative`),
  optionalAmount: z.union([z.coerce.number().min(0, 'Amount cannot be negative'), z.literal('')]).optional(),
  
  // Contact & Auth
  email: z.string().trim().min(1, 'Email is required').email('Invalid email format').refine(val => /[a-zA-Z]/.test(val.split('@')[0]), 'Email must contain at least one letter before @'),
  optionalEmail: z.string().trim().email('Invalid email format').refine(val => /[a-zA-Z]/.test(val.split('@')[0]), 'Email must contain at least one letter before @').optional().or(z.literal('')),
  mobile: z.string().trim().min(1, 'Mobile Number is required').regex(/^[0-9]{10}$/, 'Mobile Number must be exactly 10 digits').refine(val => !/^0+$/.test(val), 'Mobile Number cannot be all zeros'),
  optionalMobile: z.literal('').or(z.string().trim().regex(/^[0-9]{10}$/, 'Mobile Number must be exactly 10 digits').refine(val => !/^0+$/.test(val), 'Mobile Number cannot be all zeros')).optional(),
  password: (minLength = 6) => z.string().min(minLength, `Password must be at least ${minLength} characters`),
  optionalPassword: z.string().optional(),
  
  // Specialized formats
  gstNumber: z.string().trim().toUpperCase().length(15, 'GST Number must be exactly 15 characters').regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i, 'Invalid GST Number format (e.g., 29ABCDE1234F1Z5)'),
  optionalUrl: z.string().trim().url('Invalid URL').optional().or(z.literal('')),
  taxNumber: z.string().trim().min(1, 'Tax is required').regex(/^[0-9]+(\.[0-9]+)?$/, 'Tax must be a valid number'),
  licenceNumber: z.string().trim().toUpperCase().length(15, 'Licence Number must be exactly 15 characters').regex(/^[A-Z]{2}[0-9]{13}$/i, 'Invalid Licence Number format (e.g., MH1220100000000)'),
  pastDate: (fieldName) => z.string().trim().min(1, `${fieldName} is required`).refine((val) => new Date(val) < new Date(), `${fieldName} must be in the past`),
  
  // Booleans & Any
  statusToggle: z.boolean().default(true),
  optionalAny: z.any().optional(),
  optionalStatus: z.string().optional(),
};
