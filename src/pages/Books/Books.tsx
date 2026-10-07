import {
  Button,
  Empty,
  message,
  Pagination,
  Popconfirm,
  Spin,
  Table,
} from 'antd';
import type { TableColumnsType } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import type { IBook } from '../../types/book';
import BookForm from './BookForm';
import type { BookFormValues } from './bookSchema';
import { useBookQuery } from './useBooks';
import {
  useCreateBook,
  useDeleteBook,
  useUpdateBook,
} from './useBookMutation';

function Books() {
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingBook, setEditingBook] = useState<IBook | null>(null);

  const username = useAuthStore((state) => state.username);
  const logout = useAuthStore((state) => state.logout);

  const { data, isLoading, isError } = useBookQuery(
    page,
    limit,
  );

  const createBookMutation = useCreateBook();
  const updateBookMutation = useUpdateBook();
  const deleteBookMutation = useDeleteBook();

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  const handleAdd = (): void => {
    setEditingBook(null);
    setIsFormOpen(true);
  };

  const handleEdit = (book: IBook): void => {
    setEditingBook(book);
    setIsFormOpen(true);
  };

  const handleDelete = async (
  id: number,
): Promise<void> => {
  try {
    await deleteBookMutation.mutateAsync(id);

    message.success('Buku berhasil dihapus');
  } catch {
    message.error('Gagal menghapus buku');
  }
};

  const handleCloseForm = (): void => {
    setIsFormOpen(false);
    setEditingBook(null);
  };

  const handleSubmit = async (
    values: BookFormValues,
  ): Promise<void> => {
    try {
      if (editingBook) {
        await updateBookMutation.mutateAsync({
          id: editingBook.id,
          book: values,
        });

        message.success('Buku berhasil diperbarui');
      } else {
        await createBookMutation.mutateAsync(values);

        message.success('Buku berhasil ditambahkan');
      }

      handleCloseForm();
    } catch {
      message.error(
        'Terjadi kesalahan saat menyimpan buku',
      );
    }
  };

  const columns: TableColumnsType<IBook> = [
    {
      title: 'No',
      key: 'number',
      width: 70,
      render: (_value, _record, index) =>
        (page - 1) * limit + index + 1,
    },
    {
      title: 'Judul',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Penulis',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Tahun',
      dataIndex: 'publishedYear',
      key: 'publishedYear',
    },
    {
      title: 'Deskripsi',
      dataIndex: 'description',
      key: 'description',
    },
    {
  title: 'Aksi',
  key: 'action',
  width: 180,
  render: (_value, record) => (
    <div className="flex gap-2">
      <Button
        type="link"
        onClick={() => handleEdit(record)}
      >
        Edit
      </Button>

      <Popconfirm
        title="Hapus buku?"
        description={`Yakin ingin menghapus "${record.title}"?`}
        okText="Hapus"
        cancelText="Batal"
        okButtonProps={{
          danger: true,
        }}
        onConfirm={() => handleDelete(record.id)}
      >
        <Button
          type="link"
          danger
        >
          Hapus
        </Button>
      </Popconfirm>
    </div>
  ),
},
  ];

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Catatan Buku
            </h1>

            <p className="text-gray-500">
              Selamat datang, {username}
            </p>
          </div>

          <Button onClick={handleLogout}>
            Logout
          </Button>
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

            <Button
              type="primary"
              onClick={handleAdd}
            >
              + Tambah Buku
            </Button>
          </div>

          {isLoading && (
            <div className="flex justify-center py-10">
              <Spin size="large" />
            </div>
          )}

          {isError && (
            <Empty description="Gagal mengambil data buku" />
          )}

          {!isLoading && !isError && (
            <>
              <Table<IBook>
                rowKey="id"
                columns={columns}
                dataSource={data?.data ?? []}
                pagination={false}
                scroll={{ x: 800 }}
              />

              <div className="mt-6 flex justify-end">
                <Pagination
                  current={page}
                  pageSize={limit}
                  total={data?.meta?.totalData ?? 0}
                  showSizeChanger
                  onChange={(newPage, newLimit) => {
                    setPage(newPage);
                    setLimit(newLimit);
                  }}
                />
              </div>
            </>
          )}
        </section>
      </div>

      <BookForm
        open={isFormOpen}
        editingBook={editingBook}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />
    </main>
  );
}

export default Books;