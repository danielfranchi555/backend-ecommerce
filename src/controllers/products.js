const controler = {};
const pool = require('../db/conectionDb'); // Usando la versión que soporta promesas

controler.getProducts = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM products JOIN category ON products.category_id = category.id_category;',
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

controler.getProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM products WHERE products.id_product = ?',
            [id],
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = controler;
