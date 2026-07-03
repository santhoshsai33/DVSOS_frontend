import { RouterProvider } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Providers from './Providers';
import { router } from '../routes/index';
import useAuthStore from '../store/useAuthStore';
import { getMeApi } from '../api/authApi';
import { hasAnyReadableMenu } from '../utils/authAccess';

function AuthInitializer({ children }) {
  const { login, logout, isAuthenticated } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token && !isAuthenticated) {
        try {
          const response = await getMeApi();
          if (response?.success) {
            const { user, menus = [] } = response.data;
            const role = user?.role?.slug || null;

            if (hasAnyReadableMenu(menus)) {
              login(user, role, token, menus);
            } else {
              logout();
            }
          } else {
            logout();
          }
        } catch (error) {
          logout();
        }
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, [isAuthenticated, login, logout]);

  if (isInitializing) return null;

  return children;
}

function App() {
  return (
    <Providers>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
    </Providers>
  );
}

export default App;
