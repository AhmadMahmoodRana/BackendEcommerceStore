import { User } from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import {
   sendPasswordResetEmail,
   sendResetSucessfullEmail,
   sendVerificationEmail,
   sendWelcomeEmail,
} from '../../mailtrap/emails.js';
import crypto from 'crypto';
import 'dotenv/config';

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
   const { email, password } = req.body;
   try {
      const user = await User.findOne({ email });
      if (!user) {
         return res.status(400).json({
            message: 'INVALID CREDENTIAL',
            success: false,
         });
      }
      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
         return res.status(400).json({
            message: 'INVALID CREDENTIAL',
            success: false,
         });
      }
      generateTokenAndSetCookie(res, user._id);
      user.lastLogin = new Date();
      await user.save();
      res.status(200).json({
         message: 'USER LOGGED IN SUCCESSFULLY',
         success: true,
         user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            lastLogin: user.lastLogin,
         },
      });
   } catch (error) {
      console.log('ERROR IN LOGIN FUNCTION:', error);
      res.status(400).json({ message: error.message, success: false });
   }
};

// ##  LOGOUT  ##

const logout = async (req, res) => {
   try {
      res.clearCookie('token');
      res.status(200).json({
         message: 'USER LOGGED OUT SUCCESSFULLY',
         success: true,
         user: null,
      });
   } catch (error) {
      res.status(400).json({
         message: error.message,
         success: false,
      });
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
            password: undefined,
         },
      });
   } catch (error) {
      return res.status(400).json({ message: error.message, success: false });
   }
};

// ## FORGOT PASSWORD ##
export const forgotPassword = async (req, res) => {
   const { email } = req.body;
   try {
      const user = await User.findOne({ email });
      if (!user) {
         return res
            .status(400)
            .json({ message: 'User Not Found', success: false });
      }
      // GENERATE A RESET TOKEN
      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 Hour
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiresAt = resetTokenExpiresAt;
      await user.save();
      // SEND EMAIL
      await sendPasswordResetEmail(
         user.email,
         `${process.env.CLIENT_URL}reset-password/${resetToken}`
      );
      res.status(200).json({
         message: 'Reset Password Email Sent',
         success: true,
      });
   } catch (error) {
      console.log('ERROR IN FORGOT PASSWORD FUNCTION:', error);
      res.status(400).json({ message: error.message, success: false });
   }
};

// ## RESET PASSWORD ##
export const resetPassword = async (req, res) => {
   try {
      const { token } = req.params;
      const { password } = req.body;

      const user = await User.findOne({
         resetPasswordToken: token,
         resetPasswordExpiresAt: { $gt: Date.now() },
      });
      if (!user) {
         return res
            .status(400)
            .json({
               message: 'Invalid or Expired Reset Token',
               success: false,
            });
      }
      const hashedPassword = await bcryptjs.hash(password, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiresAt = undefined;
      await user.save();
      await sendResetSucessfullEmail(user.email);
   } catch (error) {
      console.log('ERROR IN RESET PASSWORD FUNCTION:', error);
      res.status(400).json({ message: error.message, success: false });
   }
};
export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};
// ##  EXPORT  ##

export { signup, login, logout, verifyEmail };
