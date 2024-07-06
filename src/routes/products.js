const express = require('express');
const controller = require('../controllers/products');

const router = express.Router();

router.get('/', controller.getProducts);

module.exports = router;
