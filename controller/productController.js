const productService = require('../service/productService');

class ProductController {

    async addProduct(req, res) {
        try {
            const productData = req.body; 
            const newProduct = await productService.addProduct(productData);
            res.status(201).json({ success: true, message: 'Product added successfully', data: newProduct });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error adding product', error: error.message });
        }
    }

    async editProduct(req, res) {
        const { productId } = req.params; 
        const updatedData = req.body;  

        try {
            const updatedProduct = await productService.editProduct(productId, updatedData); 
            if (!updatedProduct) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }
            res.status(200).json({ success: true, message: 'Product updated successfully', data: updatedProduct });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error updating product', error: error.message });
        }
    }

    async getAllProducts(req, res) {
        try {
            const products = await productService.getAllProducts(); 
            res.status(200).json({ success: true, data: products });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching products', error: error.message });
        }
    }

    async getProductById(req, res) {
        const { productId } = req.params; 

        try {
            const product = await productService.getProductById(productId); 
            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }
            res.status(200).json({ success: true, data: product });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching product', error: error.message });
        }
    }
}

module.exports = new ProductController();
