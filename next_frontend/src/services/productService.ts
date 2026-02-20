/**
 * productService.ts
 * All API calls related to Products live here.
 * Uses the pre-configured Axios instance from src/lib/api.ts
 */

import api from '@/lib/api';
import type { Product, ApiResponse, PaginatedResponse } from '@/types';

/** Fetch all products (with optional pagination) */
export const getProducts = async (
    page = 1,
    limit = 12
): Promise<PaginatedResponse<Product>> => {
    const { data } = await api.get<PaginatedResponse<Product>>('/products', {
        params: { page, limit },
    });
    return data;
};

/** Alias used by UI pages */
export const getAllProducts = getProducts;

/** Fetch a single product by ID */
export const getProductById = async (id: string): Promise<Product> => {
    const { data } = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return data.data;
};

/** Create a new product (Admin) */
export const addProduct = async (product: Omit<Product, 'id' | '_id'>): Promise<Product> => {
    const { data } = await api.post<ApiResponse<Product>>('/products', product);
    return data.data;
};

/** Update an existing product (Admin) */
export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
    const { data } = await api.put<ApiResponse<Product>>(`/products/${id}`, product);
    return data.data;
};

/** Delete a product (Admin) */
export const deleteProduct = async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
};
