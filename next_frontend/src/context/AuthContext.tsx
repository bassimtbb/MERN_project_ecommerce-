'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import type { User, ApiResponse } from '@/types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginAs: (role: 'Admin' | 'client') => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Persist login state in local storage for a better testing experience
    useEffect(() => {
        const savedUser = localStorage.getItem('mock_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const loginAs = async (role: 'Admin' | 'client') => {
        try {
            setLoading(true);
            // Fetch all users
            const { data } = await api.get<ApiResponse<User[]>>('/users');

            // Find the first user matching the role
            const foundUser = data.data.find(u => u.role === role);

            if (foundUser) {
                setUser(foundUser);
                localStorage.setItem('mock_user', JSON.stringify(foundUser));
                console.log(`[Auth] Logged in as ${role}: ${foundUser.prenom} ${foundUser.nom}`);
            } else {
                console.error(`[Auth] No user found with role: ${role}`);
                alert(`Error: No user found with role ${role} in the database.`);
            }
        } catch (err) {
            console.error('[Auth] Login failed:', err);
            alert('Failed to fetch users for mock login.');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('mock_user');
        console.log('[Auth] Logged out');
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginAs, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
