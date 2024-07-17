const controller = {};
const connection = require('../db/conectionDb');

controller.newOrder = (req, res) => {
    const { user_id, total_amount, productsCart, infoOrder } = req.body;
    const {
        address,
        phone_number,
        first_name,
        last_name,
        email_address,
        postal_code,
    } = infoOrder;

    connection.query(
        'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
        [user_id, total_amount],
        (err, result) => {
            if (err) throw err;
            const orderId = result.insertId;
            const orderItemsData = productsCart.map((product) => [
                orderId,
                product.id_product,
                product.quantity,
                product.price,
            ]);
            connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?',
                [orderItemsData],
                (err, result) => {
                    if (err) throw err;

                    // res.send(result);
                },
            );
            connection.query(
                'INSERT INTO order_details (order_id, address, phone_number, first_name, email_address, postal_code, last_name) VALUES  (?, ?, ?, ?, ?, ?, ?) ',
                [
                    orderId,
                    address,
                    phone_number,
                    first_name,
                    email_address,
                    postal_code,
                    last_name,
                ],
                (err, result) => {
                    if (err) throw err;

                    res.send(result);
                },
            );
        },
    );
    try {
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

module.exports = controller;
