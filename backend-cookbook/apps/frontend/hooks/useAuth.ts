'use client';

import { useState, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import { User, ApiResponse } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>(() => {
    if (typeof window === 'undefined') return { user: null, token: null };
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    return {
      token,
      user: userStr ? (JSON.parse(userStr) as User) : null,
    };
  });

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiFetch<ApiResponse<{ token: string; user: User }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const { token, user } = res.data!;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ token, user });
    return { token, user };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await apiFetch<ApiResponse<{ token: string; user: User }>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    const { token, user } = res.data!;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ token, user });
    return { token, user };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ token: null, user: null });
  }, []);

  return { ...auth, login, register, logout };
}
