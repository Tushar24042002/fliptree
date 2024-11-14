const jwt = require('jsonwebtoken');
const { decryptData } = require('../utils/cryptoAuth');
function checkAuth(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: `Unauthorized user - ${err.message}` });
        }
        if (decoded && decoded.data) {
            try {
                const decryptedData = decryptData(decoded.data);
                req.user = {
                    userId: decryptedData.userId,
                    roleId: decryptedData.roleId
                };

                next();
            } catch (error) {
                return res.status(500).json({ message: 'Error decrypting token data' });
            }
        } else {
            return res.status(401).json({ message: 'Token is missing required data' });
        }

    });
}
function checkRole(requiredRole) {
    return (req, res, next) => {
        if (!req.user || typeof req.user.roleId === 'undefined') {
            return res.status(401).json({ message: 'Unauthorized - No role information' });
        }
        if (req.user.roleId > requiredRole) {
            return res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
        }

        next();
    };
}
const isAdmin = checkRole(1);
const isCustomer = checkRole(2);

module.exports = { checkAuth, isAdmin, isCustomer };
