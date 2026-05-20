import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { getApiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export const useAuth = () => {
  const router = useRouter();
  const { setAuth, logout: logoutStore } = useAuthStore();
  const api = getApiClient();

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        const response = await api.post('/auth/login', credentials);
        const { id, email, firstName, lastName, role, access_token, refresh_token } =
          response.data;

        setAuth(
          {
            id,
            email,
            firstName,
            lastName,
            role,
          },
          access_token,
          refresh_token,
        );

        toast.success('Connexion réussie!');
        router.push('/dashboard');
        return true;
      } catch (error: any) {
        const message = error.response?.data?.message || 'Erreur de connexion';
        toast.error(message);
        return false;
      }
    },
    [setAuth, router, api],
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      try {
        const response = await api.post('/auth/register', data);
        const { id, email, firstName, lastName, role, access_token, refresh_token } =
          response.data;

        setAuth(
          {
            id,
            email,
            firstName,
            lastName,
            role,
          },
          access_token,
          refresh_token,
        );

        toast.success('Inscription réussie!');
        router.push('/dashboard');
        return true;
      } catch (error: any) {
        const message = error.response?.data?.message || 'Erreur lors de l\'inscription';
        toast.error(message);
        return false;
      }
    },
    [setAuth, router, api],
  );

  const logout = useCallback(() => {
    logoutStore();
    router.push('/auth/login');
    toast.success('Déconnexion réussie');
  }, [logoutStore, router]);

  return {
    login,
    register,
    logout,
  };
};
