import OrderService from "../service/order.service.js";
import ApiResponse from "../utils/apiResponse.js";

class OrderController {
    async create(req, res) {
        try {
            // Expecting userId in body (simulating logged in user context for this exercise)
            // In a real app with auth middleware, this would be req.user.id
            const { userId, items } = req.body;
            if (!userId) {
                return ApiResponse.error(res, "UserId is required", null, 400);
            }

            const order = await OrderService.createOrderFromCart(userId, items);
            return ApiResponse.success(res, "Order created successfully", order, 201);
        } catch (error) {
            let status = 500;
            if (error.message === "Cart is empty" || error.message.includes("Stock insuffisant")) {
                status = 400;
            }
            return ApiResponse.error(res, error.message, error, status);
        }
    }

    async getHistory(req, res) {
        try {
            const { userId } = req.query; // Simulating auth
            if (!userId) {
                return ApiResponse.error(res, "UserId is required", null, 400);
            }
            const orders = await OrderService.getUserOrders(userId);
            return ApiResponse.success(res, "User history retrieved", orders, 200);
        } catch (error) {
            return ApiResponse.error(res, error.message, error, 500);
        }
    }

    async getAll(req, res) {
        try {
            const orders = await OrderService.getAllOrders();
            return ApiResponse.success(res, "All orders retrieved", orders, 200);
        } catch (error) {
            return ApiResponse.error(res, error.message, error, 500);
        }
    }
}

export default new OrderController();
