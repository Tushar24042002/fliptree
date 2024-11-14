
const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const { checkAuth, isAdmin } = require('../middleware/authMiddleware');
router.post('/products', checkAuth, isAdmin, productController.addProduct);
router.put('/products/:productId', checkAuth, isAdmin, productController.editProduct);
router.get('/products', productController.getAllProducts);
router.get('/products/:productId', productController.getProductById);

module.exports = router;
