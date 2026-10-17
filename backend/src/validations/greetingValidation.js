import { z } from 'zod'

export const greetingOccasions = [
  'birthday',
  'monthsary',
  'anniversary',
  'romantic',
  'valentines',
  'graduation',
  'celebration',
  'other'
]

export const greetingThemes = [
  'birthday',
  'monthsary',
  'anniversary',
  'romantic',
  'valentines',
  'graduation',
  'elegant',
  'celebration'
]

export const greetingStatuses = ['draft', 'active', 'disabled', 'archived']

const optionalText = (maxLength) => {
  return z.union([
    z.string().trim().min(1).max(maxLength),
    z.literal(''),
    z.null()
  ]).optional()
}

export const createGreetingSchema = z.object({
  recipientName: z.string().trim().min(1).max(100),
  senderName: optionalText(100),
  message: z.string().trim().min(1).max(1000),
  occasion: z.enum(greetingOccasions),
  theme: z.enum(greetingThemes),
  status: z.enum(greetingStatuses).default('draft'),
  orderReference: optionalText(80)
})

export const updateGreetingSchema = createGreetingSchema
  .partial()
  .extend({
    status: z.enum(greetingStatuses).optional()
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one greeting field is required'
  })

export const greetingIdSchema = z.coerce.number().int().positive()

export const greetingTokenSchema = z.string()
  .length(43)
  .regex(/^[A-Za-z0-9_-]+$/)

export const greetingListSchema = z.object({
  search: z.string().trim().max(100).optional().default(''),
  status: z.enum(greetingStatuses).optional(),
  occasion: z.enum(greetingOccasions).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20)
})
