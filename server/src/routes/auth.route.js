import { Router } from "express";
import { login, logout, signup } from "../controller/authentication.controller.js";

const auth = Router()

auth.get('/signup',signup)
auth.get('/login',login)
auth.get('/logout',logout)

export default auth;