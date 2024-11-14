const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');
const { checkAuth, isCustomer } = require('../middleware/authMiddleware');
router.post('/cart', checkAuth, isCustomer, cartController.addProduct);
router.put('/cart/:cartItemId', checkAuth, isCustomer, cartController.updateProduct);
router.delete('/cart/:cartItemId', checkAuth, isCustomer, cartController.deleteProduct);
router.get('/cart', checkAuth, isCustomer, cartController.getAllProducts);
router.get('/cart/item/:cartItemId', checkAuth, isCustomer, cartController.getProductById);

module.exports = router;
