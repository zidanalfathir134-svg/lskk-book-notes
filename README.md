# LSKK Book Notes

Frontend web application untuk mengelola data buku secara sederhana, dibuat sebagai bagian dari onboarding PKL Frontend Web Development di PT. Langgeng Sejahtera Kreasi Komputasi (LSKK).

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Ant Design
- React Hook Form
- Zod
- Zustand
- TanStack Query
- Axios
- React Router
- Axios Mock Adapter

## Fitur

- Login dengan validasi form
- Persistensi status autentikasi
- Protected route
- Menampilkan daftar buku
- Pagination
- Menambahkan buku
- Mengedit buku
- Menghapus buku
- Validasi form menggunakan Zod
- Loading state pada proses submit
- Response API menggunakan format `IResponseEntity`
- Mock API menggunakan Axios Mock Adapter
- Penyimpanan data buku menggunakan localStorage

## Struktur Folder

```text
src/
├── components/
├── layouts/
├── pages/
│   ├── Login/
│   └── Books/
├── router/
├── services/
│   └── mock/
├── stores/
├── types/
├── App.tsx
├── main.tsx
└── index.css
```

## Instalasi

Clone repository kemudian masuk ke folder project:

```bash
git clone https://github.com/zidanalfathir134-svg/lskk-book-notes
cd lskk-book-notes
```

Install dependency:

```bash
npm install
```

## Environment

Buat file `.env` pada root project:

```env
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCK=true
```

File `.env` tidak disimpan ke repository.

## Menjalankan Project

Jalankan development server:

```bash
npm run dev
```

Kemudian buka alamat yang ditampilkan oleh Vite pada terminal.

## Login Mock

Karena project saat ini menggunakan mock API, gunakan akun berikut:

```text
Username: admin
Password: admin123
```

## Build

Untuk melakukan pengecekan production build:

```bash
npm run build
```

## Lint

Untuk melakukan pengecekan kode menggunakan ESLint:

```bash
npm run lint
```

## Catatan

Project menggunakan Axios Mock Adapter sebagai simulasi backend selama proses onboarding. Data buku disimpan pada localStorage sehingga perubahan data tetap dapat digunakan selama browser masih menyimpan data project.

Setelah backend tersedia, service pada folder `src/services/` dapat diarahkan ke API backend yang sebenarnya.