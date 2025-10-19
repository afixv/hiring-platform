import { z } from 'zod';

// Profile field keys
export const PROFILE_FIELD_KEYS = {
  FULL_NAME: 'full_name',
  PHOTO_PROFILE: 'photo_profile',
  GENDER: 'gender',
  DOMICILE: 'domicile',
  EMAIL: 'email',
  PHONE_NUMBER: 'phone_number',
  LINKEDIN_LINK: 'linkedin_link',
  DATE_OF_BIRTH: 'date_of_birth',
} as const;

// Job Type Options
export const JOB_TYPES = [
  'Full-Time',
  'Part-Time',
  'Contract',
  'Internship',
  'Freelance',
] as const;

// Job Status
export const JOB_STATUS = ['active', 'inactive', 'draft'] as const;

// Profile field validation state for Create Job Modal
export const profileFieldStateSchema = z.enum(['mandatory', 'optional', 'off']);

// Application Form Field Schema
export const applicationFormFieldSchema = z.object({
  key: z.string(),
  validation: z.object({
    required: z.boolean(),
  }),
});

// Application Form Section Schema
export const applicationFormSectionSchema = z.object({
  title: z.string(),
  fields: z.array(applicationFormFieldSchema),
});

// Application Form Config Schema
export const applicationFormConfigSchema = z.object({
  sections: z.array(applicationFormSectionSchema),
});

// Create Job Schema
export const createJobSchema = z.object({
  title: z.string().min(1, 'Job name is required'),
  job_type: z.string().min(1, 'Job type is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  number_of_candidates: z
    .number()
    .min(1, 'At least 1 candidate is required')
    .or(z.string().min(1, 'Number of candidates is required').transform(Number)),
  salary_min: z
    .number()
    .min(0, 'Minimum salary must be positive')
    .or(z.string().min(1, 'Minimum salary is required').transform(Number)),
  salary_max: z
    .number()
    .min(0, 'Maximum salary must be positive')
    .or(z.string().min(1, 'Maximum salary is required').transform(Number)),
  profile_fields: z.object({
    full_name: profileFieldStateSchema,
    photo_profile: profileFieldStateSchema,
    gender: profileFieldStateSchema,
    domicile: profileFieldStateSchema,
    email: profileFieldStateSchema,
    phone_number: profileFieldStateSchema,
    linkedin_link: profileFieldStateSchema,
    date_of_birth: profileFieldStateSchema,
  }),
}).refine((data) => data.salary_max >= data.salary_min, {
  message: 'Maximum salary must be greater than or equal to minimum salary',
  path: ['salary_max'],
});

export type CreateJobFormData = z.infer<typeof createJobSchema>;

// Dynamic Application Form Schema Builder
export function buildApplicationFormSchema(
  fields: Array<{ key: string; validation: { required: boolean } }>
) {
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    switch (field.key) {
      case PROFILE_FIELD_KEYS.FULL_NAME:
        schemaShape[field.key] = field.validation.required
          ? z.string().min(1, 'Full name is required')
          : z.string().optional();
        break;

      case PROFILE_FIELD_KEYS.EMAIL:
        schemaShape[field.key] = field.validation.required
          ? z.string().email('Please enter your email in the format: name@example.com').min(1, 'Email is required')
          : z.string().email('Invalid email address').optional().or(z.literal(''));
        break;

      case PROFILE_FIELD_KEYS.PHONE_NUMBER:
        schemaShape[field.key] = field.validation.required
          ? z.string().min(8, 'Phone number must be at least 8 digits')
          : z.string().optional();
        break;

      case PROFILE_FIELD_KEYS.LINKEDIN_LINK:
        schemaShape[field.key] = field.validation.required
          ? z.string().url('Please copy paste your Linkedin URL, example: https://www.linkedin.com/in/username').min(1, 'LinkedIn URL is required')
          : z.string().url('Invalid LinkedIn URL').optional().or(z.literal(''));
        break;

      case PROFILE_FIELD_KEYS.GENDER:
        schemaShape[field.key] = z.enum(['male', 'female'], { message: 'Please select a gender' })
        break;

      case PROFILE_FIELD_KEYS.DOMICILE:
        schemaShape[field.key] = field.validation.required
          ? z.string().min(1, 'Domicile is required')
          : z.string().optional();
        break;

      case PROFILE_FIELD_KEYS.DATE_OF_BIRTH:
        schemaShape[field.key] = field.validation.required
          ? z.string().min(1, 'Date of birth is required')
          : z.string().optional();
        break;

      case PROFILE_FIELD_KEYS.PHOTO_PROFILE:
        schemaShape[field.key] = field.validation.required
          ? z.string().min(1, 'Profile photo is required')
          : z.string().optional();
        break;

      default:
        schemaShape[field.key] = field.validation.required
          ? z.string().min(1, `${field.key} is required`)
          : z.string().optional();
    }
  });

  return z.object(schemaShape);
}

// Helper to convert profile field states to application form config
export function buildApplicationFormConfig(
  profileFields: CreateJobFormData['profile_fields']
) {
  const fields: Array<{ key: string; validation: { required: boolean } }> = [];

  Object.entries(profileFields).forEach(([key, state]) => {
    if (state !== 'off') {
      fields.push({
        key,
        validation: {
          required: state === 'mandatory',
        },
      });
    }
  });

  return {
    sections: [
      {
        title: 'Minimum Profile Information Required',
        fields,
      },
    ],
  };
}

// Format salary for display
export function formatSalary(amount: number, currency: string = 'IDR'): string {
  if (currency === 'IDR') {
    return `Rp${amount.toLocaleString('id-ID')}`;
  }
  return `${currency} ${amount.toLocaleString()}`;
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
