/**
 * authService.ts
 * All API calls related to Authentication live here.
 */

import api from '@/lib/api';
import type { User, AuthResponse, LoginCredentials, ApiResponse } from '@/types';

/** Login and return token + user */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
};

/** Register a new user */
export const register = async (
    payload: Omit<User, 'id' | 'role'> & { password: string }
): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data;
};

/** Get the currently logged-in user's profile */
export const getMe = async (): Promise<User> => {
    const { data } = await api.get<ApiResponse<User>>('/auth/me');
    return data.data;
};
