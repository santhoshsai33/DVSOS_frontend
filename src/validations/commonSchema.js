import { z } from 'zod';

export const commonValidations = {
  // Required strings
  requiredString: (fieldName, maxLength) => {
    let schema = z.string().trim().min(1, `${fieldName} is required`);
    if (maxLength) {
      schema = schema.max(maxLength, `${fieldName} must not exceed ${maxLength} characters`);
    }
    return schema;
  },
  
  // Optional strings (allows empty or missing)
  optionalString: z.string().trim().optional().or(z.literal('')),
  
  // Description validation
  optionalDescription: z.string().trim().max(200, 'Description cannot exceed 200 characters').optional().or(z.literal('')),
  
  // Address validation
  address: z.string().trim().max(200, 'Address cannot exceed 200 characters').optional().or(z.literal('')),

  // Pincode validation (Pro-level: 6 digits, cannot start with 0)
  pincode: z.string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, 'Pincode must be exactly 6 digits and cannot start with 0')
    .optional()
    .or(z.literal('')),

  
  // Alpha-numeric (no special characters except space)
  alphaNumeric: (fieldName, maxLength = 50) => {
    let schema = z.string()
      .trim()
      .min(3, `${fieldName} must be at least 3 characters`)
      .regex(/^[a-zA-Z0-9\s]+$/, 'Special characters and symbols are not allowed')
      .regex(/[a-zA-Z]/, `${fieldName} must contain at least one letter`);
    if (maxLength) {
      schema = schema.max(maxLength, `${fieldName} must not exceed ${maxLength} characters`);
    }
    return schema;
  },
      
  // Letters only
  lettersOnly: (fieldName, maxLength = 50) => {
    let schema = z.string()
      .trim()
      .min(3, `${fieldName} must be at least 3 characters`)
      .regex(/^[a-zA-Z\s]+$/, 'Special characters and numbers are not allowed');
    if (maxLength) {
      schema = schema.max(maxLength, `${fieldName} must not exceed ${maxLength} characters`);
    }
    return schema;
  },
      
  // Numbers & IDs
  requiredNumber: (fieldName) => z.coerce.number({ required_error: `${fieldName} is required`, invalid_type_error: `${fieldName} is required` }).min(1, `${fieldName} is required`),
  requiredUnionId: (fieldName) => z.union([z.string(), z.number()]).refine(val => !!val, { message: `Please select a ${fieldName}` }),
  positiveAmount: (fieldName) => z.coerce.number({ required_error: `${fieldName} is required` }).min(0, `${fieldName} cannot be negative`),
  optionalAmount: z.union([z.coerce.number().min(0, 'Amount cannot be negative'), z.literal('')]).optional(),
  
  // Contact & Auth
  email: z.string().trim().min(1, 'Email is required').max(100, 'Email cannot exceed 100 characters').email('Invalid email format').refine(val => /[a-zA-Z]/.test(val.split('@')[0]), 'Email must contain at least one letter before @'),
  optionalEmail: z.string().trim().max(100, 'Email cannot exceed 100 characters').email('Invalid email format').refine(val => /[a-zA-Z]/.test(val.split('@')[0]), 'Email must contain at least one letter before @').optional().or(z.literal('')),
  mobile: z.string().trim().min(1, 'Mobile Number is required').regex(/^[0-9]{10}$/, 'Mobile Number must be exactly 10 digits').refine(val => !/^0+$/.test(val), 'Mobile Number cannot be all zeros'),
  optionalMobile: z.literal('').or(z.string().trim().regex(/^[0-9]{10}$/, 'Mobile Number must be exactly 10 digits').refine(val => !/^0+$/.test(val), 'Mobile Number cannot be all zeros')).optional(),
  password: (minLength = 6) => z.string().min(minLength, `Password must be at least ${minLength} characters`),
  optionalPassword: z.string().optional(),
  
  // Specialized formats
  gstNumber: z.string().trim().toUpperCase().length(15, 'GST Number must be exactly 15 characters').regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i, 'Invalid GST Number format (e.g., 29ABCDE1234F1Z5)'),
  optionalUrl: z.string().trim().refine(val => {
    if (!val) return true;
    
    // Explicitly reject domains that are just "www.tld" (like www.com or http://www.com)
    const domainPart = val.replace(/^(https?:\/\/)?/i, '').split('/')[0];
    if (/^www\.[a-zA-Z]{2,6}$/i.test(domainPart)) {
      return false; 
    }

    const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i;
    return urlPattern.test(val);
  }, 'Please enter a valid URL (e.g., www.example.com or https://example.com)').optional().or(z.literal('')),
  taxNumber: z.string().trim().min(1, 'Tax is required').regex(/^[0-9]+(\.[0-9]+)?$/, 'Tax must be a valid number').refine(val => Number(val) <= 100, 'Tax cannot exceed 100'),
  licenceNumber: z.string().trim().toUpperCase().length(15, 'Licence Number must be exactly 15 characters').regex(/^[A-Z]{2}[0-9]{13}$/i, 'Invalid Licence Number format (e.g., MH1220100000000)'),
  pastDate: (fieldName) => z.string().trim().min(1, `${fieldName} is required`).refine((val) => {
    const inputDate = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate < today;
  }, `${fieldName} must be in the past and cannot be today`),
  
  // Booleans & Any
  statusToggle: z.boolean().default(true),
  optionalAny: z.any().optional(),
  optionalStatus: z.string().optional(),
};
