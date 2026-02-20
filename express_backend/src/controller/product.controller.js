import ProductService from "../service/product.service.js";
import ApiResponse from "../utils/apiResponse.js";

class ProductController {
    async create(req, res) {
        try {
            const product = await ProductService.create(req.body);
            return ApiResponse.success(res, "Product created successfully", product, 201);
        } catch (error) {
            return ApiResponse.error(res, error.message, error, 500);
        }
    }

    async findAll(req, res) {
        try {
            const { category, name, minPrice, maxPrice, available } = req.query;
            const criteria = { category, name, minPrice, maxPrice, available };
            const products = await ProductService.findAll(criteria);
            return ApiResponse.success(res, "Products retrieved", products, 200);
        } catch (error) {
            return ApiResponse.error(res, error.message, error, 500);
        }
    }

    async findById(req, res) {
        try {
            const product = await ProductService.findById(req.params.id);
            return ApiResponse.success(res, "Product retrieved successfully", product, 200);
        } catch (error) {
            return ApiResponse.error(res, error.message, error, 404);
        }
    }

    async update(req, res) {
        try {
            const product = await ProductService.update(req.params.id, req.body);
            return ApiResponse.success(res, "Product updated successfully", product, 200);
        } catch (error) {
            return ApiResponse.error(res, error.message, error, 500);
        }
    }

    async delete(req, res) {
        try {
            const product = await ProductService.delete(req.params.id);
            return ApiResponse.success(res, "Product deleted successfully", product, 200);
        } catch (error) {
            return ApiResponse.error(res, error.message, error, 500);
        }
    }

    async decrementStock(req, res) {
        try {
            const { quantity } = req.body;
            if (!quantity || quantity <= 0) {
                return ApiResponse.error(res, "Quantity must be greater than 0", null, 400);
            }
            const product = await ProductService.decrementStock(req.params.id, quantity);
            return ApiResponse.success(res, "Stock decremented successfully", product, 200);
        } catch (error) {
            const statusCode = error.message === "Stock insuffisant" ? 400 : 500;
            return ApiResponse.error(res, error.message, error, statusCode);
        }
    }
}

export default new ProductController();
