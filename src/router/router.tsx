import { Suspense } from 'react';
import { createHashRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoadingPage from './LoadingPage';
import { Login, Books } from './LazyPages';

const router = createHashRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingPage />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingPage />}>
        <Login />
      </Suspense>
    ),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/books',
        element: (
          <Suspense fallback={<LoadingPage />}>
            <Books />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;