const controller = {};
const pool = require('../db/conectionDb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

controller.register = async (req, res) => {
    const data = req.body;

    if (data.password.length < 6) {
        return res.json('Password must be at least 6 characters long');
    }

    try {
        const [existingUsers] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [data.email],
        );

        if (existingUsers.length > 0) {
            return res.status(401).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(data.password, 8);

        const userSavedDb = {
            name: data.name,
            surname: data.surname,
            email: data.email,
            password: hashedPassword,
        };

        const [insertResult] = await pool.query(
            'INSERT INTO users SET ?',
            userSavedDb,
        );

        const [userResult] = await pool.query(
            'SELECT id_users FROM users WHERE email = ?',
            [data.email],
        );

        if (userResult.length > 0) {
            const userSaveCookie = {
                id_user: userResult[0].id_users,
                name: data.name,
                surname: data.surname,
                email: data.email,
            };

            const token = jwt.sign(userSaveCookie, process.env.JWT_KEY, {
                expiresIn: '5d',
            });

            res.cookie('access_token', token);
            res.json({ token: token });
        } else {
            res.status(500).json({ message: 'Failed to retrieve user ID' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

controller.login = async (req, res) => {
    const user = req.body;

    if (!user.email || !user.password) {
        return res.status(400).json('Email and password are required');
    }

    try {
        const [existingUsers] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [user.email],
        );

        if (existingUsers.length > 0) {
            const validPassword = await bcrypt.compare(
                user.password,
                existingUsers[0].password,
            );

            if (validPassword) {
                const userObject = {
                    id_user: existingUsers[0].id_users,
                    name: existingUsers[0].name,
                    surname: existingUsers[0].surname,
                };

                const token = jwt.sign(userObject, process.env.JWT_KEY, {
                    expiresIn: '5d',
                });

                res.cookie('access_token', token);
                res.status(200).json('Login successful');
            } else {
                res.status(401).json('Invalid email or password');
            }
        } else {
            res.status(401).json('Invalid email or password');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

controller.logout = async (req, res) => {
    res.cookie('access_token', '', { maxAge: 1 });
    res.status(200).json('Logout successful');
};
module.exports = controller;
