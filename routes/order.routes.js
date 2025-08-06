import {Router} from 'express';
import {protectRoute} from "../middleware/auth.middleware.js";
import {creatOrderHandler, verifyPaymentHandler} from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.post('/create-order', protectRoute, creatOrderHandler);
orderRouter.post('/verify-payment', protectRoute, verifyPaymentHandler)

export default orderRouter;