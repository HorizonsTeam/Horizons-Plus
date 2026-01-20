import {useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredAuth?: boolean; 
}

export default function ProtectedRoute({ children, requiredAuth = true }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [,setIsAuthenticated] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/me`, {
          credentials: 'include',
        });

        const isAuth = response.status === 200;
        setIsAuthenticated(isAuth);

        // Si requiredAuth=true et pas authentifié -> login
        if (requiredAuth && !isAuth) {
          navigate('/login', { replace: true });
          return;
        }

        if (!requiredAuth && isAuth) {
          navigate('/', { replace: true });
          return;
        }

      } catch (error) {
        console.error('Auth check error:', error);
        if (requiredAuth) {
          navigate('/login', { replace: true });
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [navigate, requiredAuth, API_BASE]);

  if (isChecking) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  return <>{children}</>;
}