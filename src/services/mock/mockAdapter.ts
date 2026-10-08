import MockAdapter from 'axios-mock-adapter';
import api from '../api';
import type { IBook } from '../../types/book';
import type { IResponseEntity } from '../../types/api';

const STORAGE_KEY = 'lskk-books';

const mockAdapter = new MockAdapter(api, {
  delayResponse: 300,
});

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBooks));

    return [...initialBooks];
  }

  try {
    return JSON.parse(storedBooks) as IBook[];
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBooks));

    return [...initialBooks];
  }
};

const saveBooks = (books: IBook[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
};

const getResponse = (
  books: IBook[],
  page: number,
  limit: number,
): IResponseEntity<IBook[]> => {
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

mockAdapter.onGet('/books').reply((config) => {
  const page = Number(config.params?.page ?? 1);
  const limit = Number(config.params?.limit ?? 5);

  const books = getStoredBooks();

  return [200, getResponse(books, page, limit)];
});

mockAdapter.onPost('/books').reply((config) => {
  const books = getStoredBooks();

  const requestData = JSON.parse(config.data) as Omit<IBook, 'id'>;

  const newId =
    books.length > 0 ? Math.max(...books.map((book) => book.id)) + 1 : 1;

  const newBook: IBook = {
    id: newId,
    ...requestData,
  };

  const updatedBooks = [...books, newBook];

  saveBooks(updatedBooks);

  return [
    201,
    {
      code: 201,
      status: true,
      message: 'Book created successfully',
      data: newBook,
    } satisfies IResponseEntity<IBook>,
  ];
});

mockAdapter.onPut(/\/books\/\d+/).reply((config) => {
  const books = getStoredBooks();

  const id = Number(config.url?.split('/').pop());

  const requestData = JSON.parse(config.data) as Omit<IBook, 'id'>;

  const index = books.findIndex((book) => book.id === id);

  if (index === -1) {
    return [
      404,
      {
        code: 404,
        status: false,
        message: 'Book not found',
      } satisfies IResponseEntity<null>,
    ];
  }

  const updatedBook: IBook = {
    id,
    ...requestData,
  };

  books[index] = updatedBook;

  saveBooks(books);

  return [
    200,
    {
      code: 200,
      status: true,
      message: 'Book updated successfully',
      data: updatedBook,
    } satisfies IResponseEntity<IBook>,
  ];
});

mockAdapter.onDelete(/\/books\/\d+/).reply((config) => {
  const books = getStoredBooks();

  const id = Number(config.url?.split('/').pop());

  const updatedBooks = books.filter((book) => book.id !== id);

  saveBooks(updatedBooks);

  return [
    200,
    {
      code: 200,
      status: true,
      message: 'Book deleted successfully',
    } satisfies IResponseEntity<null>,
  ];
});

mockAdapter.onPost('/auth/login').reply((config) => {
  const requestData = JSON.parse(config.data) as {
    username: string;
    password: string;
  };

  if (requestData.username !== 'admin' || requestData.password !== 'admin123') {
    return [
      401,
      {
        code: 401,
        status: false,
        message: 'Username atau password salah',
      },
    ];
  }

  return [
    200,
    {
      code: 200,
      status: true,
      message: 'Login berhasil',
      data: {
        token: 'mock-token-12345',
        user: {
          id: 1,
          username: 'admin',
          name: 'Administrator',
        },
      },
    },
  ];
});

export default mockAdapter;
