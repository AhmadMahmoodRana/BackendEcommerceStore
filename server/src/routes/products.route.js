import { Router } from "express";
import getProduct from "../controller/products.controller.js";
const routes = Router()

routes.get('/' , getProduct)

export default routes;