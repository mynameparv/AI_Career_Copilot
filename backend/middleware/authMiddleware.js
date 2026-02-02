import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log('[AUTH] Token received');

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('[AUTH] Token decoded, user ID:', decoded.id);

            const user = User.findById(decoded.id);
            console.log('[AUTH] User lookup result:', user ? 'Found' : 'Not found');

            if (user) {
                // Exclude password from req.user
                const { password, ...userWithoutPassword } = user;
                req.user = userWithoutPassword;
                console.log('[AUTH] User authenticated:', user._id);
                next();
            } else {
                console.log('[AUTH] User not found in database');
                res.status(401).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('[AUTH] Error:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        console.log('[AUTH] No token provided');
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export { protect };
