// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header - check both Authorization and x-auth-token for compatibility
    let token = req.header('Authorization');
    
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7); // Remove 'Bearer ' prefix
    } else {
        token = req.header('x-auth-token'); // Fallback for backward compatibility
    }

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Attach user ID to the request object
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};