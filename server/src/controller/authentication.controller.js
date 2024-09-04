import { User } from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';

// ##  SIGNUP  ##

const signup = async (req, res) => {
   const { email, password, name } = req.body;
   try {
      if (!email || !password || !name) {
         throw new Error('ALL Fields Are Required');
      }

      const userExist = await User.findOne({ email });
    
      if (userExist) {
         return res
            .status(400)
            .json({ message: 'USER ALREADY EXISTS', success: false });
      }

      const hashedPassword = await bcryptjs.hash(password, 10);
      const verificationToken = Math.floor(
         100000 + Math.random() * 900000
      ).toString();
      
      const user = new User({  // Corrected this line
         email,
         password: hashedPassword,
         name,
         verificationToken,
         verificationTokenExpiresAt: Date.now() + 3600000 * 24, // 24 hours
      });

      await user.save();
      generateTokenAndSetCookie(res, user._id);

      res.status(201).json({
         message: 'USER REGISTERED SUCCESSFULLY',
         success: true,
         user: {
            ...user._doc,
            password: undefined,
         },
      });

   } catch (error) {
      return res.status(400).json({ message: error.message, success: false });
   }
};

// ##  LOGIN  ##

const login = async (req, res) => {
   res.send('Login');
};

// ##  LOGOUT  ##

const logout = async (req, res) => {
   res.send('Logout');
};

// ##  EXPORT  ##

export { signup, login, logout };
