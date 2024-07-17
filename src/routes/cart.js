const express = require('express');
const controller = require('../controllers/cart');

const router = express.Router();

router.post('/add-product', controller.addProductCart);
router.get('/get-products/:id_user', controller.getProducts);
router.delete('/remove-product', controller.deleteProducts);

module.exports = router;
