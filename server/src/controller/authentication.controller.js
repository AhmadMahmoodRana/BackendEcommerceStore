import { User } from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
// ##  SIGNUP  ##

const signup = async (req, res) => {
   const { email, password, name } = req.body;
   try {
      if (!email || !password || !name) {
         throw new Error('ALL Fields Are Required');
      }

      const userExist = User.findOne({ email });
      if (userExist) {
         return res
            .status(400)
            .json({ message: 'USER ALREDY EXIST', sucess: false });
      }

      const hashedPassword = await bcryptjs.hash(password, 10);
      const verificationToken = Math.floor(
         100000 + Math.random() * 900000
      ).toString();
      const user = new user({
         email,
         password: hashedPassword,
         name,
         verificationToken,
         verificationTokenExpiresAt: Date.now() + 3600000 * 24, // 24 hours
      });
      await user.save();
      generateTokenAndSetCookie(res,user._id)
   } catch (error) {
      return res.status(400).json({ message: error.message, sucess: false });
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
