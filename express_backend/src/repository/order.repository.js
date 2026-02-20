import Order from "../model/order.model.js";

class OrderRepository {
    async create(orderData) {
        return await Order.create(orderData);
    }

    async findByUser(userId) {
        return await Order.find({ user: userId }).sort({ createdAt: -1 });
    }

    async findAll() {
        return await Order.find().populate('user', 'nom prenom email').sort({ createdAt: -1 });
    }

    async findById(id) {
        return await Order.findById(id).populate('user', 'nom prenom email');
    }
}

export default new OrderRepository();
