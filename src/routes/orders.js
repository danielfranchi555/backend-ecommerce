const express = require('express');
const controller = require('../controllers/orders');

const router = express.Router();

router.post('/', controller.newOrder);

module.exports = router;
