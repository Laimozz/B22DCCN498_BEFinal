const jwt = require('jsonwebtoken');
const secretKey = "ltw_spring_2025";
const blacklistedTokens = require('./blacklistedTokens');

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        if (blacklistedTokens.has(token)) {
            return res.status(403).json({ message: 'Invalid Token' });
        }

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Invalid Token' });
            req.user_id = decoded.user_id;
            next();
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = verifyToken;