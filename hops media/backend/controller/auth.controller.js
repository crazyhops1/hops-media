import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../model/user.model.js';
import jwt from 'jsonwebtoken';

// Create account
export const createAccount = async (req, res) => {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Please provide a valid email' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Password should be at least 8 characters' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userNameCheck= await userModel.findOne({userName,email})
        if(userNameCheck){
            return res.status(400).json({message:'userName or email already exist '})
        }

        const newUser = new userModel({
            userName,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        if (savedUser) {
            return res.status(201).json({ message: 'User created successfully' });
        }

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Login account
export const loginAccount = async (req, res) => {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: 'Please provide a valid email' });
    }

    if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password should be at least 8 characters' });
    }

    try {
        const checkEmail = await userModel.findOne({ email });
        if (!checkEmail) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        const checkPassword = await bcrypt.compare(password, checkEmail.password);
        if (!checkPassword) {
            return res.status(400).json({ success: false, message: 'Password does not match' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: checkEmail._id }, process.env.SECRET, { expiresIn: '15d' });

        // Debugging: Log token to check if it's created correctly
       

        // Set token in a cookie
        res.cookie('user',token , {
            maxAge: 15 * 24 * 60 * 60 * 1000, // Cookie expiration time (15 days)
            httpOnly: true,  // Makes it inaccessible to JavaScript
            secure:  process.env.NODE_ENV === 'production', // true in production for HTTPS
            sameSite: 'none', // Helps prevent CSRF attacks
        });

        return res.status(200).json({
            success: true,
            message: 'User logged in',
            data: { id: checkEmail._id }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

// log out 
 const logOut=async(req,res)=>{
    const  {user}  = req.cookies;
    try {
        
        
    } catch (error) {
        
    }
 }


