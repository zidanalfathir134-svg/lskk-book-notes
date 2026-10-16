
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

function PublicOnlyRoute() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to="/books" replace />;
  }

  return <Outlet />;
}

export default PublicOnlyRoute;
