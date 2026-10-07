import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createBook,
  deleteBook,
  updateBook,
} from '../../services/bookService';

import type { IBook } from '../../types/book';

export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      book: Omit<IBook, 'id'>,
    ) => createBook(book),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['books'],
      });
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      book,
    }: {
      id: number;
      book: Omit<IBook, 'id'>;
    }) => updateBook(id, book),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['books'],
      });
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteBook(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['books'],
      });
    },
  });
};