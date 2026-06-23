import { RouterProvider } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Providers from './Providers';
import { router } from '../routes/index';
import useAuthStore from '../store/useAuthStore';
import { getMeApi } from '../api/authApi';
import { ROLES, mapSlugToRole } from '../constants/roles';

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
            const { user } = response.data;
            const role = mapSlugToRole(user?.role?.slug);
            login(user, role, token);
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
