const controler = {};
const conection = require('../db/conectionDb');
const jwt = require('jsonwebtoken');

controler.getProducts = (req, res) => {
    try {
        conection.query('SELECT * FROM products', (error, result) => {
            if (error) throw error;
            res.json(result);
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

module.exports = controler;
