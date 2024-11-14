const cartService = require('../service/cartService');

class CartController {
    async addProduct(req, res) {
        try {
            const { productId, quantity } = req.body; 
            const {userId} = req.user;
            const addedProduct = await cartService.addProduct(userId, productId, quantity);
            res.status(201).json({ product_id: addedProduct.product_id, message: 'Product added to cart successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error adding product to cart', error: error.message });
        }
    }

    async updateProduct(req, res) {
        const { cartItemId } = req.params; 
        const { quantity } = req.body;  
        
        try {
            const affectedRows = await cartService.updateProduct(cartItemId, quantity);
            if (affectedRows > 0) {
                res.json({ message: 'Product quantity updated successfully' });
            } else {
                res.status(404).json({ message: 'Product not found in cart' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating product in cart', error: error.message });
        }
    }

    async deleteProduct(req, res) {
        const { cartItemId } = req.params; 
        try {
            const affectedRows = await cartService.deleteProduct(cartItemId);
            if (affectedRows > 0) {
                res.json({ message: 'Product removed from cart successfully' });
            } else {
                res.status(404).json({ message: 'Product not found in cart' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting product from cart', error: error.message });
        }
    }

    async getAllProducts(req, res) {
        const { userId } = req.user; 
        
        try {
            const cartItems = await cartService.getAllProducts(userId);
            res.json({ products: cartItems });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching cart products', error: error.message });
        }
    }

    async getProductById(req, res) {
        const { cartItemId } = req.params; 
        try {
            const product = await cartService.getProductById(cartItemId);
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ message: 'Product not found in cart' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching product in cart', error: error.message });
        }
    }
}

module.exports = new CartController();
