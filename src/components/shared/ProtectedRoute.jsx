import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { ROUTES } from '../../config/routes';
import { getFirstReadablePath, hasReadableModule, hasReadablePath } from '../../utils/authAccess';

// eslint-disable-next-line react/prop-types
export default function ProtectedRoute({ allowedModules = [], requiredPath, enforcePath = false }) {
  const { isAuthenticated, menus } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedModules.length > 0 && !hasReadableModule(menus, allowedModules)) {
    return <Navigate to={getFirstReadablePath(menus, ROUTES.PROFILE)} replace />;
  }

  const pathToCheck = requiredPath || (enforcePath ? location.pathname : null);

  if (pathToCheck && !hasReadablePath(menus, pathToCheck)) {
    return <Navigate to={getFirstReadablePath(menus, ROUTES.PROFILE)} replace />;
  }

  return <Outlet />;
}
