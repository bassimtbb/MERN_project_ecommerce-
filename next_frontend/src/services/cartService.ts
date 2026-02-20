import api from '@/lib/api';
import type { CartItem, ApiResponse } from '@/types';

/**
 * Service to handle cart operations.
 * endpoints: /api/users/{id}/cart
 *
 * Backend wraps success in: { success: true, message: "...", data: [...] }
 */

export const getCart = async (userId: string): Promise<CartItem[]> => {
    const { data } = await api.get<ApiResponse<CartItem[]>>(`/users/${userId}/cart`);
    return data.data;
};

export const addToCart = async (
    userId: string,
    productId: string,
    quantity: number
): Promise<CartItem[]> => {
    const { data } = await api.post<ApiResponse<CartItem[]>>(`/users/${userId}/cart`, {
        productId,
        quantity,
    });
    return data.data;
};

export const removeFromCart = async (
    userId: string,
    productId: string
): Promise<CartItem[]> => {
    const { data } = await api.delete<ApiResponse<CartItem[]>>(`/users/${userId}/cart/${productId}`);
    return data.data;
};
