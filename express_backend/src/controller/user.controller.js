import UserService from "../service/user.service.js";
import ApiResponse from "../utils/apiResponse.js";

class UserController {
    async create(req, res) {
        try {
            const user = await UserService.create(req.body);
            return ApiResponse.success(res, "User created successfully", user, 201);
        } catch (error) {
            return ApiResponse.error(res, error.message, error, 500);
        }
    }

    async findAll(req, res) {
        try {
            const users = await UserService.findAll();
            return ApiResponse.success(res, "Users retrieved successfully", users, 200);
        } catch (error) {
            return ApiResponse.error(res, error.message, error, 500);
        }
    }

    async findById(req, res) {
        try {
            const user = await UserService.findById(req.params.id);
            return ApiResponse.success(res, "User retrieved successfully", user, 200);
        } catch (error) {
            return ApiResponse.error(res, "User not found", error, 404);
        }
    }

    async update(req, res) {
        try {
            const user = await UserService.update(req.params.id, req.body);
            return ApiResponse.success(res, "User updated successfully", user, 200);
        } catch (error) {
            return ApiResponse.error(res, error.message, error, 500);
        }
    }

    async delete(req, res) {
        try {
            const user = await UserService.delete(req.params.id);
            return ApiResponse.success(res, "User deleted successfully", user, 200);
        } catch (error) {
            return ApiResponse.error(res, error.message, error, 500);
        }
    }

    async addToCart(req, res) {
        try {
            const userId = req.params.id;
            const { productId, quantity } = req.body;

            if (!productId) {
                return ApiResponse.error(res, "ProductId is required", null, 400);
            }

            // On ajoute au panier via le service
            const panier = await UserService.addToCart(userId, productId, quantity);
            return ApiResponse.success(res, "Product added to cart", panier, 200);
        } catch (error) {
            if (error.message === "User not found") {
                return ApiResponse.error(res, error.message, error, 404);
            }
            return ApiResponse.error(res, error.message, error, 500);
        }
    }

    async getCart(req, res) {
        try {
            const userId = req.params.id;
            const cart = await UserService.getCart(userId);
            return ApiResponse.success(res, "Cart retrieved successfully", cart, 200);
        } catch (error) {
            return ApiResponse.error(res, error.message, error, 500);
        }
    }

    async removeFromCart(req, res) {
        try {
            const userId = req.params.id;
            const productId = req.params.productId; // Attention: doit matcher le paramètre dans la route

            const updatedUser = await UserService.removeFromCart(userId, productId);
            return ApiResponse.success(res, "Product removed from cart", updatedUser.panier, 200);
        } catch (error) {
            return ApiResponse.error(res, error.message, error, 500);
        }
    }
}

export default new UserController();