import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { ROUTES } from '../../config/routes';
import { getFirstReadablePath, hasReadableModule, hasReadablePath } from '../../utils/authAccess';

const AUTHENTICATED_ONLY_PATHS = new Set([ ROUTES.PROFILE, ROUTES.SETTINGS ]);


export default function ProtectedRoute({ allowedModules = [], requiredPath, enforcePath = false }) {
  const { isAuthenticated, menus } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedModules.length > 0 && !hasReadableModule(menus, allowedModules)) {
    return <Navigate to={getFirstReadablePath(menus, ROUTES.PROFILE)} replace />;
  }

  const pathToCheck = requiredPath || (enforcePath ? location.pathname : null);

  if (pathToCheck && AUTHENTICATED_ONLY_PATHS.has(pathToCheck)) {
    return <Outlet />;
  }

  if (pathToCheck && !hasReadablePath(menus, pathToCheck)) {
    return <Navigate to={getFirstReadablePath(menus, ROUTES.PROFILE)} replace />;
  }

  return <Outlet />;
}
