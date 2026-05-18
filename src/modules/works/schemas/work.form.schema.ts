import { z } from 'zod';

const priceSchema = z
  .union([z.string(), z.number()])
  .transform((value) => {
    if (typeof value === 'number') {
      return value;
    }
    return value.trim().replace(',', '.');
  })
  .refine((value) => value !== '', 'Informe um preço válido')
  .transform((value) => Number(value))
  .refine((value) => Number.isFinite(value), 'Informe um preço válido')
  .refine((value) => value >= 0, 'O preço não pode ser negativo');

export const workFormSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome do serviço'),
  description: z
    .string()
    .trim()
    .transform((value) => (value === '' ? null : value))
    .nullable(),
  price: priceSchema,
  status: z.enum(['active', 'inactive']).default('active'),
});

export type WorkFormInput = z.input<typeof workFormSchema>;
export type WorkFormData = z.output<typeof workFormSchema>;
