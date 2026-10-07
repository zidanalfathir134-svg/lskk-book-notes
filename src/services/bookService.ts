import type { IBook } from '../types/book';
import type { IResponseEntity } from '../types/api';

const STORAGE_KEY = 'lskk-books';

const initialBooks: IBook[] = [
  {
    id: 1,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    description: 'A handbook of agile software craftsmanship.',
    publishedYear: 2008,
  },
  {
    id: 2,
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt',
    description: 'A practical guide to software development.',
    publishedYear: 1999,
  },
  {
    id: 3,
    title: 'Design Patterns',
    author: 'Erich Gamma',
    description: 'Elements of reusable object-oriented software.',
    publishedYear: 1994,
  },
  {
    id: 4,
    title: 'Refactoring',
    author: 'Martin Fowler',
    description: 'Improving the design of existing code.',
    publishedYear: 1999,
  },
  {
    id: 5,
    title: 'You Don’t Know JS',
    author: 'Kyle Simpson',
    description: 'A deep dive into JavaScript concepts.',
    publishedYear: 2015,
  },
  {
    id: 6,
    title: 'Eloquent JavaScript',
    author: 'Marijn Haverbeke',
    description: 'Modern introduction to JavaScript programming.',
    publishedYear: 2018,
  },
];

const getStoredBooks = (): IBook[] => {
  const storedBooks = localStorage.getItem(STORAGE_KEY);

  if (!storedBooks) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(initialBooks),
    );

    return [...initialBooks];
  }

  return JSON.parse(storedBooks) as IBook[];
};

const saveBooks = (books: IBook[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
};

export const getBooks = async (
  page: number,
  limit: number,
): Promise<IResponseEntity<IBook[]>> => {
  const books = getStoredBooks();

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedBooks = books.slice(startIndex, endIndex);

  const totalData = books.length;
  const totalPages = Math.ceil(totalData / limit);

  return {
    code: 200,
    status: true,
    message: 'Books retrieved successfully',
    data: paginatedBooks,
    meta: {
      totalPages,
      totalData,
      totalDataPerPage: limit,
      page,
      limit,
    },
  };
};

export const createBook = async (
  book: Omit<IBook, 'id'>,
): Promise<IBook> => {
  const books = getStoredBooks();

  const newId =
    books.length > 0
      ? Math.max(...books.map((item) => item.id)) + 1
      : 1;

  const newBook: IBook = {
    id: newId,
    ...book,
  };

  const updatedBooks = [...books, newBook];

  saveBooks(updatedBooks);

  return newBook;
};

export const updateBook = async (
  id: number,
  book: Omit<IBook, 'id'>,
): Promise<IBook> => {
  const books = getStoredBooks();

  const index = books.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error('Book not found');
  }

  const updatedBook: IBook = {
    id,
    ...book,
  };

  books[index] = updatedBook;

  saveBooks(books);

  return updatedBook;
};

export const deleteBook = async (
  id: number,
): Promise<void> => {
  const books = getStoredBooks();

  const updatedBooks = books.filter(
    (book) => book.id !== id,
  );

  saveBooks(updatedBooks);
};