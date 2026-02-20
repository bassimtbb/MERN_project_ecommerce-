import api from '@/lib/api';
import type { User, ApiResponse } from '@/types';

/**
 * Service to handle user operations.
 */

export const getUsers = async (): Promise<User[]> => {
    const { data } = await api.get<ApiResponse<User[]>>('/users');
    return data.data;
};

const UserService = {
    getUsers
};

export default UserService;
