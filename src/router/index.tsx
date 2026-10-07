import { createHashRouter } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Books from '../pages/Books/Books';

export const router = createHashRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/books',
    element: <Books />,
  },
]);