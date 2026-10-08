import { Button, Empty, message, Popconfirm, Spin } from 'antd';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import type { IBook } from '../../types/book';
import BookForm from './BookForm';
import type { BookFormValues } from './bookSchema';
import { useBookQuery } from './useBooks';
import { useCreateBook, useDeleteBook, useUpdateBook } from './useBookMutation';

function Books() {
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingBook, setEditingBook] = useState<IBook | null>(null);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const { data, isLoading, isError } = useBookQuery(page, limit);

  const createBookMutation = useCreateBook();
  const updateBookMutation = useUpdateBook();
  const deleteBookMutation = useDeleteBook();

  const totalPages = data?.meta?.totalPages ?? 0;
  const currentDataLength = data?.data?.length ?? 0;


  const handleLogout = useCallback((): void => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const handleAdd = useCallback((): void => {
    setEditingBook(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((book: IBook): void => {
    setEditingBook(book);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback(
  async (id: number): Promise<void> => {
    try {
      const response =
        await deleteBookMutation.mutateAsync(id);

      message.success(response.message);

      if (
        totalPages > 1 &&
        page === totalPages &&
        currentDataLength === 1
      ) {
        setPage(page - 1);
      }
    } catch {
      message.error('Gagal menghapus buku');
    }
  },
  [
    deleteBookMutation,
    totalPages,
    page,
    currentDataLength,
  ],
);

  const handleCloseForm = useCallback((): void => {
    setIsFormOpen(false);
    setEditingBook(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: BookFormValues): Promise<void> => {
      try {
        if (editingBook) {
          const response = await updateBookMutation.mutateAsync({
            id: editingBook.id,
            book: values,
          });

          message.success(response.message);
        } else {
          const response = await createBookMutation.mutateAsync(values);

          message.success(response.message);
        }

        handleCloseForm();
      } catch {
        message.error('Terjadi kesalahan saat menyimpan buku');
      }
    },
    [editingBook, updateBookMutation, createBookMutation, handleCloseForm],
  );

  const columns: GridColDef<IBook>[] = useMemo(
  () => [
    {
      field: 'title',
      headerName: 'Judul',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'author',
      headerName: 'Penulis',
      flex: 1,
      minWidth: 160,
    },
    {
      field: 'description',
      headerName: 'Deskripsi',
      flex: 2,
      minWidth: 250,
    },
    {
      field: 'publishedYear',
      headerName: 'Tahun Terbit',
      width: 130,
    },
    {
      field: 'action',
      headerName: 'Aksi',
      width: 190,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="flex h-full items-center gap-2">
          <Button onClick={() => handleEdit(params.row)}>
            Edit
          </Button>

          <Popconfirm
            title="Hapus buku?"
            description="Buku ini akan dihapus."
            onConfirm={() => handleDelete(params.row.id)}
            okText="Ya"
            cancelText="Tidak"
          >
            <Button danger>Hapus</Button>
          </Popconfirm>
        </div>
      ),
    },
  ],
  [handleEdit, handleDelete],
);

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Catatan Buku</h1>

            <p className="text-gray-500">Selamat datang, {user?.name}</p>
          </div>

          <Button onClick={handleLogout}>Logout</Button>
        </div>

        <section className="rounded-xl bg-white p-4 shadow-sm md:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Daftar Buku
              </h2>

              <p className="text-sm text-gray-500">
                Daftar buku yang tersedia.
              </p>
            </div>

            <Button type="primary" onClick={handleAdd}>
              + Tambah Buku
            </Button>
          </div>

          {isLoading && (
            <div className="flex justify-center py-10">
              <Spin size="large" />
            </div>
          )}

          {isError && <Empty description="Gagal mengambil data buku" />}

          {!isLoading && !isError && (
            <>
              <div className="w-full">
                <DataGrid
                  rows={data?.data ?? []}
                  columns={columns}
                  getRowId={(row) => row.id}
                  loading={isLoading}
                  pagination
                  paginationMode="server"
                  rowCount={data?.meta?.totalData ?? 0}
                  paginationModel={{
                    page: page - 1,
                    pageSize: limit,
                  }}
                  onPaginationModelChange={(model) => {
                    setPage(model.page + 1);
                    setLimit(model.pageSize);
                  }}
                  pageSizeOptions={[5, 10, 20]}
                  disableRowSelectionOnClick
                  autoHeight
                />
              </div>
            </>
          )}
        </section>
      </div>

      <BookForm
        open={isFormOpen}
        editingBook={editingBook}
        loading={createBookMutation.isPending || updateBookMutation.isPending}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />
    </main>
  );
}

export default Books;
