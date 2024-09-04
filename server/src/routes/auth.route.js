import { Router } from "express";
import { login, logout, signup } from "../controller/authentication.controller.js";

const auth = Router()

auth.post('/signup',signup)
auth.post('/login',login)
auth.post('/logout',logout)

export default auth;