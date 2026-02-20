'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart, addToCart, removeFromCart } from '@/services/cartService';
import { useAuth } from '@/context/AuthContext';
import type { CartItem } from '@/types';

interface CartContextType {
    cart: CartItem[];
    loading: boolean;
    itemCount: number;
    refreshCart: () => Promise<void>;
    addItemToCart: (productId: any, quantity: number) => Promise<void>;
    updateItemQuantity: (productId: string, quantity: number) => Promise<void>;
    removeItemFromCart: (productId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const refreshCart = useCallback(async () => {
        if (!user) {
            setCart([]);
            return;
        }

        try {
            setLoading(true);
            const userId = user._id || user.id;
            const data = await getCart(userId);
            setCart(data);
        } catch (err) {
            console.error('Failed to fetch cart:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const addItemToCart = async (productId: any, quantity: number) => {
        if (!user) {
            alert('Please login to add items to the cart.');
            return;
        }

        try {
            const userId = user._id || user.id;
            const cleanId = productId?.$oid ? productId.$oid : String(productId);

            if (!cleanId || cleanId === 'undefined' || cleanId === '[object Object]') {
                console.error('[Cart Error] Invalid productId:', productId);
                return;
            }

            const updatedCart = await addToCart(userId, cleanId, quantity);
            setCart(updatedCart);
        } catch (err: any) {
            console.error('[Cart Error] Failed to add to cart:', err);
            throw err;
        }
    };

    const updateItemQuantity = async (productId: string, quantity: number) => {
        if (!user) return;

        try {
            const userId = user._id || user.id;
            // The backend addToCart likely adds, but let's assume it handles the update.
            // If it adds delta, we'd need more logic, but for simplicity we refresh after 
            // a custom set-quantity endpoint if it existed.
            // For now, let's just use the existing addToCart and see.
            const updatedCart = await addToCart(userId, productId, quantity);
            setCart(updatedCart);
        } catch (err) {
            console.error('Failed to update quantity:', err);
            throw err;
        }
    };

    const removeItemFromCart = async (productId: string) => {
        if (!user) return;

        try {
            const userId = user._id || user.id;
            const updatedCart = await removeFromCart(userId, productId);
            setCart(updatedCart);
        } catch (err) {
            console.error('Failed to remove from cart:', err);
            throw err;
        }
    };

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                itemCount,
                refreshCart,
                addItemToCart,
                updateItemQuantity,
                removeItemFromCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
