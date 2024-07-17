const controler = {};
const pool = require('../db/conectionDb');

controler.addProductCart = async (req, res) => {
    const { user_id, cart_items } = req.body;

    if (
        !user_id ||
        !cart_items ||
        !Array.isArray(cart_items) ||
        cart_items.length === 0
    ) {
        return res.status(400).send({ error: 'Invalid input data' });
    }

    const product = cart_items[0];

    try {
        // Verifica si el carrito ya tiene el producto
        const [existingCartItems] = await pool.query(
            'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
            [user_id, product.product_id],
        );

        if (existingCartItems.length > 0) {
            const currentQuantity = existingCartItems[0].quantity;
            const newQuantity =
                parseInt(currentQuantity) + parseInt(product.quantity);

            if (isNaN(newQuantity)) {
                throw new Error('Invalid quantity value');
            }

            // Si existe, actualiza la cantidad
            await pool.query(
                'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
                [newQuantity, user_id, product.product_id],
            );
        } else {
            // Si no existe, agrega el nuevo producto
            const values = cart_items.map((item) => [
                user_id,
                item.product_id,
                parseInt(item.quantity),
                item.price,
                item.img_url,
                item.name_product,
            ]);

            await pool.query(
                'INSERT INTO cart_items (user_id, product_id, quantity, price, img_url , name_product) VALUES ?',
                [values],
            );
        }

        res.status(200).send({ message: 'Cart updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

controler.getProducts = async (req, res) => {
    const params = req.params;
    const id_user = params.id_user;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM cart_items WHERE user_id = ?',
            [id_user],
        );
        res.send(rows);
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

controler.deleteProducts = async (req, res) => {
    const { user_id, id_cart_item } = req.body;
    console.log('Received parameters:', req.body); // Para depuración

    try {
        // Verificar la existencia del producto en el carrito antes de eliminar
        const [check] = await pool.query(
            'SELECT * FROM cart_items WHERE user_id = ? AND id_cart_item = ?',
            [user_id, id_cart_item],
        );

        if (check.length === 0) {
            return res
                .status(404)
                .json({ message: 'Product not found in cart' });
        }

        // Eliminar el producto del carrito
        const [result] = await pool.query(
            'DELETE FROM cart_items WHERE user_id = ? AND id_cart_item = ?',
            [user_id, id_cart_item],
        );

        console.log('SQL Result:', result); // Para depuración

        if (result.affectedRows > 0) {
            res.json({ message: 'Product removed successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error in query execution:', error);
        res.status(500).json({ message: error.message });
    }
};
module.exports = controler;
