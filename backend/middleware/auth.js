const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
    return (req, res, next) => {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            console.log(`🔐 Auth Check: [${req.method}] ${req.originalUrl} | User ID: ${req.user.id} | User Role: ${req.user.role} | Required Roles: [${roles}]`);

            if (roles.length && !roles.includes(req.user.role)) {
                console.warn(`🚫 Access Denied: User role ${req.user.role} is not in ${roles}`);
                return res.status(403).json({ message: 'Access denied: Unauthorized role' });
            }

            next();
        } catch (err) {
            res.status(401).json({ message: 'Token is not valid' });
        }
    };
};

module.exports = auth;
