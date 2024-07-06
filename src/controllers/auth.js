const controller = {};
const conection = require('../db/conectionDb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

controller.register = (req, res) => {
    const data = req.body;
    if (data.password.length < 6) {
        res.json('password longitude incorrect');
    }
    conection.query(
        'SELECT * FROM users WHERE email =?',
        [data.email],
        async (error, result) => {
            if (error) throw error;
            if (result.length > 0) {
                res.status(401).json({ message: 'email already exist' });
            } else {
                const hashedPassword = await bcrypt.hash(data.password, 8);
                const user = {
                    name: data.name,
                    surname: data.surname,
                    email: data.email,
                    password: hashedPassword,
                };
                conection.query(
                    'INSERT INTO users set ?',
                    user,
                    (error, result) => {
                        if (error) throw error;

                        res.json(result);
                    },
                );
            }
        },
    );
};

controller.login = (req, res) => {
    const user = req.body;
    if (!user.email || !user.password) {
        res.status(400).json('campos requeridos');
    }
    conection.query(
        'SELECT * FROM users WHERE email =?',
        [user.email],
        async (err, result) => {
            if (err) throw err;
            if (
                result.length > 0 &&
                (await bcrypt.compare(user.password, result[0].password))
            ) {
                const userObject = {
                    name: result[0].name,
                    surname: result[0].surname,
                };
                const token = jwt.sign(userObject, process.env.JWT_KEY, {
                    expiresIn: 5,
                });
                res.cookie('access_token', token, {
                    httpOnly: true,
                    maxAge: 5000,
                });
                res.status(200).json('session correct');
            } else {
                res.status(401).json('email o contraseña incorrectos');
            }
        },
    );
};

module.exports = controller;
