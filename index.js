const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = 4000;
const productsRoutes = require('./src/routes/products');
const productsAuth = require('./src/routes/auth');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use('/api/products', productsRoutes);
app.use('/api/auth', productsAuth);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
