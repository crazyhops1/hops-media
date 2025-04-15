import jwt from 'jsonwebtoken';


// Token Verification middleware
export const tokenVerify = async (req, res, next) => {
    const  {user}  = req.cookies;


    // Check if token is present
    if (!user) {
        return res.status(401).json({ success: false, message: 'Access denied, no token provided' });
    }

    try {
      

        // Verify token using the correct field (user instead of id)
        const decoded = jwt.verify(user, process.env.SECRET);

     

        req.id = decoded.id; // Set decoded user ID from the token
        return next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Invalid token', error: error.message });
    }
};