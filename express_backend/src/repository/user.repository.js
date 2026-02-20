import User from "../model/user.model.js";

class UserRepository {
    async create(userData) {
        return await User.create(userData);
    }
    async findAll() {
        return await User.find().select("-__v");
    }
    async findById(id) {
        return await User.findById(id).select("-__v");
    }
    async update(id, userData) {
        return await User.findByIdAndUpdate(id, userData, { new: true, runValidators: true }).select("-__v");
    }
    async delete(id) {
        return await User.findByIdAndDelete(id);
    }

    async addToCart(userId, productId, quantity) {
        console.log(`[Repo] addToCart - userId: ${userId}, productId: ${productId}, quantity: ${quantity}`);

        const user = await User.findById(userId);
        if (!user) {
            console.error(`[Repo] User not found: ${userId}`);
            throw new Error("User not found");
        }

        // Assurer que le panier est un tableau
        if (!user.panier) user.panier = [];
        console.log(`[Repo] Current cart size: ${user.panier.length}`);

        // Recherche de l'item existant
        // On normalise les IDs en string pour la comparaison
        const targetPid = (productId && productId.$oid) ? productId.$oid : (productId ? productId.toString() : null);
        console.log(`[Repo] Normalized targetPid: ${targetPid}`);

        if (!targetPid) throw new Error("Invalid Product ID");

        const itemIndex = user.panier.findIndex(p => {
            if (!p.product) {
                console.warn(`[Repo] Found cart item with null product:`, p);
                return false;
            }
            // product peut être un ID (string/ObjectId) ou un objet (si peuplé, bien que rare ici)
            const pId = p.product._id ? p.product._id.toString() : p.product.toString();
            return pId === targetPid;
        });

        console.log(`[Repo] Found item at index: ${itemIndex}`);

        if (itemIndex > -1) {
            // Mise à jour de la quantité
            user.panier[itemIndex].quantity += parseInt(quantity);
            console.log(`[Repo] Updated quantity to: ${user.panier[itemIndex].quantity}`);
        } else {
            // Ajout d'un nouvel item
            user.panier.push({ product: targetPid, quantity: parseInt(quantity) });
            console.log(`[Repo] Added new item to cart`);
        }

        // On marque le champ comme modifié car c'est un tableau d'objets (Mixed/Deep)
        user.markModified('panier');

        console.log(`[Repo] Saving user...`);
        try {
            await user.save();
            console.log(`[Repo] User saved successfully`);
        } catch (saveError) {
            console.error(`[Repo] Error during user.save():`, saveError.message);
            throw saveError;
        }

        // On recharge l'utilisateur AVEC population pour renvoyer des données complètes au front
        const updatedUser = await User.findById(userId).populate('panier.product');
        return updatedUser.panier;
    }

    async getCart(userId) {
        const user = await User.findById(userId).populate('panier.product');
        return user ? user.panier : [];
    }

    async removeFromCart(userId, productId) {
        return await User.findByIdAndUpdate(
            userId,
            { $pull: { panier: { product: productId } } },
            { new: true }
        ).populate('panier.product');
    }
    async clearCart(userId) {
        return await User.findByIdAndUpdate(
            userId,
            { $set: { panier: [] } },
            { new: true }
        );
    }
}

export default new UserRepository();