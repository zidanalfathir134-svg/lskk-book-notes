import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username wajib diisi')
    .max(50, 'Username maksimal 50 karakter'),

  password: z
    .string()
    .min(6, 'Password minimal 6 karakter')
    .max(100, 'Password maksimal 100 karakter'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
