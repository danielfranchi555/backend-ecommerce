const controler = {};
const conection = require('../db/conectionDb');
const jwt = require('jsonwebtoken');

controler.getProducts = (req, res) => {
    try {
        conection.query('SELECT * FROM products', (error, result) => {
            if (error) throw error;
            const token = req.cookies.access_token;
            const user = jwt.verify(token, process.env.JWT_KEY);
            console.log(user);
            res.send(result);
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

module.exports = controler;
