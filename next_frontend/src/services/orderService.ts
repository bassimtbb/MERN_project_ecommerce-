import api from '@/lib/api';
import type { Order, ApiResponse, CartItem } from '@/types';

/**
 * Service to handle order operations.
 * endpoint: /api/orders/my-orders?userId={id}
 */

export const getMyOrders = async (userId: string): Promise<Order[]> => {
    // According to requirements: GET /api/orders/my-orders?userId={userId}
    // and returns response.data.data
    const { data } = await api.get<ApiResponse<Order[]>>(`/orders/my-orders`, {
        params: { userId }
    });
    return data.data;
};

export const checkout = async (userId: string, items: CartItem[]): Promise<Order> => {
    // According to requirements: POST /api/orders sending { userId, items } in the body
    const { data } = await api.post<ApiResponse<Order>>(`/orders`, { userId, items });
    return data.data;
};

export const getAllOrders = async (): Promise<Order[]> => {
    // GET /api/orders (Admin)
    const { data } = await api.get<ApiResponse<Order[]>>('/orders');
    return data.data;
};

const OrderService = {
    getMyOrders,
    checkout,
    getAllOrders
};

export default OrderService;
