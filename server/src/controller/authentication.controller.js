import { User } from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail, sendWelcomeEmail } from '../../mailtrap/emails.js';

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

      const user = new User({
         // Corrected this line
         email,
         password: hashedPassword,
         name,
         verificationToken,
         verificationTokenExpiresAt: Date.now() + 3600000 * 24, // 24 hours
      });

      await user.save();
      generateTokenAndSetCookie(res, user._id);
      await sendVerificationEmail(user.email, verificationToken);

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
   try {
      res.clearCookie('token');
      res.status(200).json({
         message: 'USER LOGGED OUT SUCCESSFULLY',
         success: true,
         user: null,
      })   
   } catch (error) {
      res.status(400).json({
         message: error.message,
         success: false,
      })
   }
   
};

// ## verifyEmail ##
const verifyEmail = async (req, res) => {
   const { code } = req.body;
   try {
      const user = await User.findOne({
         verificationToken: code,
         verificationTokenExpiresAt: { $gt: Date.now() },
      });
      if (!user) {
         return res
            .status(400)
            .json({ message: 'Invalid Verification Code', success: false });
      }
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined;

      await user.save();

      await sendWelcomeEmail(user.email, user.name);
      res.status(200).json({
         message: 'Email Verified Successfully',
         success: true,
         user: {
           ...user._doc,
            password:  undefined,
         },
      })
   } catch (error) {
      return res.status(400).json({ message: error.message, success: false });
   }
};

// ##  EXPORT  ##

export { signup, login, logout, verifyEmail };
