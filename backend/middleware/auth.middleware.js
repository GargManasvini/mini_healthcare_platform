import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';

export const protect = async (req, res, next) => {
    try {
        //console.log('protect middleware triggered');
        let token;

        // Check cookie
        if (req.cookies?.token) {
            token = req.cookies.token;
        }
        // Check Authorization header
        else if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'No authorization token found' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.userId).select('-password');

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};
