import UserRepository from "../repository/user.repository.js";

class UserService {
    async create(userData) {
        const user = await UserRepository.create(userData);
        return user;
    }
    async findAll() {
        const users = await UserRepository.findAll();
        return users;
    }
    async findById(id) {
        const user = await UserRepository.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    async update(id, userData) {
        const user = await UserRepository.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return await UserRepository.update(id, userData);
    }
    async delete(id) {
        const user = await UserRepository.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return await UserRepository.delete(id);
    }

    async addToCart(userId, productId, quantity) {
        // On force la quantité à être un nombre
        const qty = parseInt(quantity) || 1;
        return await UserRepository.addToCart(userId, productId, qty);
    }

    async getCart(userId) {
        return await UserRepository.getCart(userId);
    }

    async removeFromCart(userId, productId) {
        return await UserRepository.removeFromCart(userId, productId);
    }
}

export default new UserService();