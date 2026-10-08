import api from './api';
import type { IResponseEntity } from '../types/api';
import type { IBook } from '../types/book';

export const getBooks = async (
  page: number,
  limit: number,
): Promise<IResponseEntity<IBook[]>> => {
  const response = await api.get<IResponseEntity<IBook[]>>('/books', {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

export const createBook = async (
  book: Omit<IBook, 'id'>,
): Promise<IResponseEntity<IBook>> => {
  const response = await api.post<IResponseEntity<IBook>>('/books', book);

  return response.data;
};

export const updateBook = async (
  id: number,
  book: Omit<IBook, 'id'>,
): Promise<IResponseEntity<IBook>> => {
  const response = await api.put<IResponseEntity<IBook>>(`/books/${id}`, book);

  return response.data;
};

export const deleteBook = async (
  id: number,
): Promise<IResponseEntity<null>> => {
  const response = await api.delete<IResponseEntity<null>>(`/books/${id}`);

  return response.data;
};
