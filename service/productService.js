const { withConnection, executeQuery } = require("../config/db");
class ProductService {

    // Add a new product
    async addProduct(productData) {
        const { name, description, price, stock } = productData;
        const query = 'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)';
        return await withConnection(async (connection) => {
            const [result] = await executeQuery(connection , query, [name, description, price, stock]);
            return { id: result.insertId, ...productData };
        });
    }

    // Edit an existing product
    async editProduct(productId, updatedData) {
        const { name, description, price, stock } = updatedData;
        const query = 'UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?';
        return await pool.withConnection(async (connection) => {
            const [result] = await executeQuery(connection, query,   [name, description, price, stock, productId]);
            if (result.affectedRows === 0) {
                return null; // Return null if no rows were affected (i.e., no product found)
            }
            return { id: productId, ...updatedData };
        });
    }

    // Get all products
    async getAllProducts() {
        const query = 'SELECT * FROM products';
        return await withConnection(async (connection) => {
            const result = await executeQuery(connection, query, []);
            return result;
        });
    }

    // Get a product by its ID
    async getProductById(productId) {
        const query = 'SELECT * FROM products WHERE id = ?';
        return await withConnection(async (connection) => {
            const [product] = await executeQuery(connection, query,  [productId]);
            return product.length ? product[0] : null; // Return the first product or null if not found
        });
    }
}

module.exports = new ProductService();
