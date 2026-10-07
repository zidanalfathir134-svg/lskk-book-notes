import { z } from 'zod';

export const bookSchema = z.object({
  title: z
    .string()
    .min(1, 'Judul buku wajib diisi')
    .max(100, 'Judul buku maksimal 100 karakter'),

  author: z
    .string()
    .min(1, 'Penulis wajib diisi')
    .max(100, 'Nama penulis maksimal 100 karakter'),

  description: z
    .string()
    .min(1, 'Deskripsi wajib diisi')
    .max(500, 'Deskripsi maksimal 500 karakter'),

  publishedYear: z
    .number({
      error: 'Tahun terbit wajib diisi',
    })
    .int('Tahun harus berupa bilangan bulat')
    .min(1000, 'Tahun tidak valid')
    .max(new Date().getFullYear(), 'Tahun tidak boleh melebihi tahun sekarang'),
});

export type BookFormValues = z.infer<typeof bookSchema>;