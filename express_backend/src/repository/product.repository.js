import Product from "../model/product.model.js";

class ProductRepository {
    async create(productData) {
        return await Product.create(productData);
    }

    async findAll(criteria = {}) {
        const query = {};

        if (criteria.category) {
            query.category = criteria.category;
        }

        if (criteria.name) {
            query.name = { $regex: criteria.name, $options: "i" };
        }

        if (criteria.minPrice || criteria.maxPrice) {
            query.price = {};
            if (criteria.minPrice) query.price.$gte = Number(criteria.minPrice);
            if (criteria.maxPrice) query.price.$lte = Number(criteria.maxPrice);
        }

        if (criteria.available !== undefined) {
            const isAvailable = criteria.available === 'true' || criteria.available === true;
            if (isAvailable) {
                query.stock = { $gt: 0 };
            } else {
                query.stock = 0;
            }
        }

        return await Product.find(query);
    }

    async findById(id) {
        return await Product.findById(id);
    }

    async update(id, productData) {
        return await Product.findByIdAndUpdate(id, productData, { returnDocument: 'after' });
    }

    async delete(id) {
        return await Product.findByIdAndDelete(id);
    }

    async decrementStock(id, quantity) {
        return await Product.findOneAndUpdate(
            { _id: id, stock: { $gte: quantity } },
            { $inc: { stock: -quantity } },
            { returnDocument: 'after' }
        );
    }
}

export default new ProductRepository();
