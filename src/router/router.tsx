import { Suspense } from 'react';
import { createHashRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicOnlyRoute from './PublicOnlyRoute';
import LoadingPage from './LoadingPage';
import { Login, Books } from './LazyPages';

const router = createHashRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: '/',
        element: <Navigate to="/login" replace />,
      },
      {
        path: '/login',
        element: (
          <Suspense fallback={<LoadingPage />}>
            <Login />
          </Suspense>
        ),
      },
    ],
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
