import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, InputNumber, Modal } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { bookSchema, type BookFormValues } from './bookSchema';
import type { IBook } from '../../types/book';

interface IBookFormProps {
  open: boolean;
  editingBook: IBook | null;
  onClose: () => void;
  onSubmit: (values: BookFormValues) => void;
}

function BookForm({
  open,
  editingBook,
  onClose,
  onSubmit,
}: IBookFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: '',
      author: '',
      description: '',
      publishedYear: new Date().getFullYear(),
    },
  });

  const handleModalOpen = (): void => {
    if (editingBook) {
      reset({
        title: editingBook.title,
        author: editingBook.author,
        description: editingBook.description,
        publishedYear: editingBook.publishedYear,
      });
    } else {
      reset({
        title: '',
        author: '',
        description: '',
        publishedYear: new Date().getFullYear(),
      });
    }
  };

  return (
    <Modal
      title={editingBook ? 'Edit Buku' : 'Tambah Buku'}
      open={open}
      onCancel={onClose}
      afterOpenChange={(isOpen) => {
        if (isOpen) {
          handleModalOpen();
        }
      }}
      footer={null}
      destroyOnHidden
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div>
          <label className="mb-1 block font-medium">
            Judul Buku
          </label>

          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Masukkan judul buku"
              />
            )}
          />

          {errors.title && (
            <p className="mt-1 text-sm text-red-500">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block font-medium">
            Penulis
          </label>

          <Controller
            name="author"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Masukkan nama penulis"
              />
            )}
          />

          {errors.author && (
            <p className="mt-1 text-sm text-red-500">
              {errors.author.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block font-medium">
            Tahun Terbit
          </label>

          <Controller
            name="publishedYear"
            control={control}
            render={({ field }) => (
              <InputNumber
                className="w-full"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value ?? undefined);
                }}
                placeholder="Contoh: 2024"
              />
            )}
          />

          {errors.publishedYear && (
            <p className="mt-1 text-sm text-red-500">
              {errors.publishedYear.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block font-medium">
            Deskripsi
          </label>

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={4}
                placeholder="Masukkan deskripsi buku"
              />
            )}
          />

          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>
            Batal
          </Button>

          <Button type="primary" htmlType="submit">
            {editingBook ? 'Simpan Perubahan' : 'Tambah Buku'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default BookForm;