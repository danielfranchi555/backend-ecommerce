const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = 4000;
//routes
const productsRoutes = require('./src/routes/products');
const auth = require('./src/routes/auth');
const orders = require('./src/routes/orders');
const cart = require('./src/routes/cart');

const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use('/api/products', productsRoutes);
app.use('/api/auth', auth);
app.use('/api/order', orders);
app.use('/api/cart', cart);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
