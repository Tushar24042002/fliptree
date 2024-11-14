const { executeQuery, withConnection } = require("../config/db");

class CartService {

    // Add product to the cart (If the cart doesn't exist, create it)
    async addProduct(userId, productId, quantity) {
        // First, we check if the cart exists for the user
        const productIdInt = parseInt(productId, 10);
        const checkCartQuery = 'SELECT * FROM carts WHERE user_id = ?';
        const cart = await withConnection(async (connection) => {
            const result = await executeQuery(connection, checkCartQuery, [userId]);
            console.log(result);
            return Array.isArray(result) && result.length > 0 ? result[0] : null; // Ensure it's an array
        });
console.log(cart);
        let cartId;

        if (!cart) {
            // If no cart exists for the user, create a new cart
            const createCartQuery = 'INSERT INTO carts (user_id) VALUES (?)';
            const result = await withConnection(async (connection) => {
                const [cartResult] = await executeQuery(connection, createCartQuery, [userId]);
                return cartResult.insertId;
            });
            cartId = result;
        } else {
            cartId = cart.id;
        }
 console.log(cart);
        // Add the product to the cart_items table
        const productQuery = 'SELECT price FROM products WHERE id = ?';
        const product = await withConnection(async (connection) => {
            const result = await executeQuery(connection, productQuery, [productIdInt]);
            return Array.isArray(result) && result.length > 0 ? result[0] : null; 
        });

        if (!product) {
            throw new Error('Product not found');
        }

        const price = product.price;
        const insertItemQuery = 'INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)';
        await withConnection(async (connection) => {
            await executeQuery(connection, insertItemQuery, [cartId, productIdInt, quantity, price]);
        });

        // Update the total amount in the cart
        await this.updateCartTotal(cartId);

        return { message: 'Product added to cart' };
    }

    // Update quantity of product in the cart
    async updateProduct(cartItemId, quantity) {
        const query = 'UPDATE cart_items SET quantity = ? WHERE id = ?';

        // Fetch the product price
        const priceQuery = 'SELECT price FROM cart_items WHERE id = ?';
        const cartItem = await withConnection(async (connection) => {
            const [result] = await executeQuery(connection, priceQuery, [cartItemId]);
            return Array.isArray(result) && result.length > 0 ? result[0] : null; // Ensure it's an array
        });

        if (!cartItem) {
            throw new Error('Cart item not found');
        }

        const price = cartItem.price;

        // Update the quantity of the product
        await withConnection(async (connection) => {
            await executeQuery(connection, query, [quantity, cartItemId]);
        });

        // Update the total amount in the cart
        await this.updateCartTotal(cartItem.cart_id);

        return { message: 'Cart item updated successfully' };
    }

    // Delete product from the cart
    async deleteProduct(cartItemId) {
        const query = 'DELETE FROM cart_items WHERE id = ?';
        
        // Fetch the cart ID before deleting
        const cartItemQuery = 'SELECT cart_id FROM cart_items WHERE id = ?';
        const cartItem = await withConnection(async (connection) => {
            const [result] = await executeQuery(connection, cartItemQuery, [cartItemId]);
            return Array.isArray(result) && result.length > 0 ? result[0] : null; // Ensure it's an array
        });

        if (!cartItem) {
            throw new Error('Cart item not found');
        }

        // Delete the cart item
        await withConnection(async (connection) => {
            await executeQuery(connection, query, [cartItemId]);
        });

        // Update the total amount in the cart
        await this.updateCartTotal(cartItem.cart_id);

        return { message: 'Cart item deleted successfully' };
    }

    async getAllProducts(userId) {

        const query = 'SELECT CI.*, P.* FROM cart_items AS CI INNER JOIN products AS P  ON CI.product_id = P.id WHERE cart_id IN (SELECT C.id FROM carts AS C WHERE C.user_id = ?)';
        console.log(query);
        const cartItems = await withConnection(async (connection) => {
            const result = await executeQuery(connection, query, [userId]);
            return Array.isArray(result) ? result : []; // Ensure it's always an array
        });

        return cartItems;
    }

    // Get a specific cart item by its ID
    async getProductById(cartItemId) {
        const query = 'SELECT * FROM cart_items WHERE id = ?';

        const cartItem = await withConnection(async (connection) => {
            const [result] = await executeQuery(connection, query, [cartItemId]);
            return Array.isArray(result) && result.length ? result[0] : null; // Ensure it's an array
        });

        return cartItem;
    }

    // Update the total amount in the cart based on the cart items
    async updateCartTotal(cartId) {
        const query = 'SELECT SUM(quantity * price) AS total_amount FROM cart_items WHERE cart_id = ?';

        const totalAmount = await withConnection(async (connection) => {
            const [result] = await executeQuery(connection, query, [cartId]);
            return result && result[0] ? result[0].total_amount : 0.00; // Return 0 if no result
        });

        const updateCartQuery = 'UPDATE carts SET total_amount = ? WHERE id = ?';
        await withConnection(async (connection) => {
            await executeQuery(connection, updateCartQuery, [totalAmount, cartId]);
        });
    }
}

module.exports = new CartService();
