const jwt = require('jsonwebtoken');

const validationToken = (req, res, next) => {
    const token = req.cookies.access_token;
    try {
        if (!token) res.status(401).json('Token No exist');

        const user = jwt.verify(token, process.env.JWT_KEY);
        req.user = user;
        console.log({ user: user, message: 'user logued successful' });
        next();
    } catch (error) {
        res.status(403).json({ message: error });
    }
};

module.exports = validationToken;
