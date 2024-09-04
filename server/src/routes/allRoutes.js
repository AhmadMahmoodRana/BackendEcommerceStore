import { Router } from "express";
import routes from "./products.route.js";
import auth from "./auth.route.js";

const route = Router()

route.use("/product",routes)
route.use("/auth",auth)

export default route;