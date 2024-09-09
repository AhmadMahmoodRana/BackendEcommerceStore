import { Router } from "express";
import { forgotPassword, login, logout, signup,verifyEmail,resetPassword, checkAuth } from "../controller/authentication.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const auth = Router()

auth.get('/check-auth',verifyToken,checkAuth)

auth.post('/signup',signup)
auth.post('/login',login)
auth.post('/logout',logout)
auth.post('/verify-email',verifyEmail)
auth.post('/forgot-password',forgotPassword)
auth.post('/reset-password/:token',resetPassword)
export default auth;