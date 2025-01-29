import {Router} from 'express'
import {protectRoute} from "../middleware/auth.middleware.js";
import {addToCart, getCartItems, removeCartItem, updateCartItem} from "../controllers/cart.controller.js";

const cartRouter = Router()

cartRouter.get('/', protectRoute, getCartItems)
cartRouter.post('/', protectRoute, addToCart)
cartRouter.put('/', protectRoute, updateCartItem)
cartRouter.delete('/', protectRoute, removeCartItem)


export default cartRouter
