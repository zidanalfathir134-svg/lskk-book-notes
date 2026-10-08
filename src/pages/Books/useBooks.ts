import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getBooks } from '../../services/bookService';

export const useBookQuery = (page: number, limit: number) => {
  return useQuery({
    queryKey: ['books', page, limit],
    queryFn: () => getBooks(page, limit),
    placeholderData: keepPreviousData,
  });
};
