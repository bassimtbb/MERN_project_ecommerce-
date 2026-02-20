import OrderRepository from "../repository/order.repository.js";
import UserRepository from "../repository/user.repository.js";
import ProductRepository from "../repository/product.repository.js";

class OrderService {
    async createOrderFromCart(userId, clientItems = null) {
        const successfulDecrements = [];
        let orderItems = [];
        let totalAmount = 0;

        // 1. Prepare Order Items & Verify Stock
        if (clientItems && clientItems.length > 0) {
            // Client-Side Cart Mode: Expecting items as [{ productId, quantity }]
            for (const item of clientItems) {
                const pId = item.productId;
                const qty = parseInt(item.quantity) || 0;

                if (!pId) throw new Error("Invalid Product ID in payload");

                // Fetch product to get official name and price (prevent frontend tampering)
                const product = await ProductRepository.findById(pId);
                if (!product) {
                    console.error(`[OrderService] Product not found in DB: ${pId}`);
                    throw new Error(`Product not found: ${pId}`);
                }

                // Atomic Check & Decrement
                const updatedProduct = await ProductRepository.decrementStock(pId, qty);
                if (!updatedProduct) {
                    const pName = product.name || "Unknown Product";
                    console.warn(`[OrderService] Stock check failed for: ${pName} (ID: ${pId})`);
                    throw new Error(`Stock insuffisant pour ${pName}`);
                }

                orderItems.push({
                    product: pId,
                    productName: product.name,
                    priceAtPurchase: product.price,
                    quantity: qty
                });

                totalAmount += (product.price * qty);
                successfulDecrements.push({ pId, qty });
            }
        } else {
            throw new Error("Client items required for stock management refactor");
        }

        try {
            // 2. Create Order
            const orderData = {
                user: userId,
                items: orderItems,
                totalAmount: totalAmount,
                status: 'Completed'
            };

            const newOrder = await OrderRepository.create(orderData);

            // 3. Clear Cart (Atomic operation after success)
            await UserRepository.clearCart(userId);

            return newOrder;

        } catch (error) {
            // Rollback: Re-increment stock for successful items
            for (const item of successfulDecrements) {
                await ProductRepository.update(item.pId, { $inc: { stock: item.qty } });
            }
            throw error;
        }
    }

    async getUserOrders(userId) {
        return await OrderRepository.findByUser(userId);
    }

    async getAllOrders() {
        return await OrderRepository.findAll();
    }
}

export default new OrderService();
