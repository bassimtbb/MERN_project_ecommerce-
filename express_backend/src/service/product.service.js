import ProductRepository from "../repository/product.repository.js";

class ProductService {
    async create(productData) {
        return await ProductRepository.create(productData);
    }

    // src/service/product.service.js

    async findAll(criteria) {
        const products = await ProductRepository.findAll(criteria);
        return products.map(product => {
            const p = product.toObject();
            p.lowStockAlert = p.countInStock < 5;
            return p;
        });
    }

    async findById(id) {
        const product = await ProductRepository.findById(id);
        if (!product) {
            throw new Error("Product not found");
        }
        const p = product.toObject();
        p.lowStockAlert = p.countInStock < 5;
        return p;
    }

    async update(id, productData) {
        const product = await ProductRepository.findById(id);
        if (!product) {
            throw new Error("Product not found");
        }
        return await ProductRepository.update(id, productData);
    }

    async delete(id) {
        const product = await ProductRepository.findById(id);
        if (!product) {
            throw new Error("Product not found");
        }
        return await ProductRepository.delete(id);
    }

    async decrementStock(id, quantity) {
        const updatedProduct = await ProductRepository.decrementStock(id, quantity);
        if (!updatedProduct) {
            // Determine if it was not found or insufficient stock
            const product = await ProductRepository.findById(id);
            if (!product) throw new Error("Product not found");
            throw new Error("Stock insuffisant");
        }
        return updatedProduct;
    }
}

export default new ProductService();
