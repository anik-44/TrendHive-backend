import { Router } from 'express';
import {
  loginHandler,
  logoutHandler,
  registerHandler,
  refreshToken,
} from '../controllers/auth.controller.js';
const authRouter = Router();

authRouter.post('/register', registerHandler);
authRouter.post('/login', loginHandler);
authRouter.post('/logout', logoutHandler);
authRouter.post('/refreshtoken', refreshToken);

export default authRouter;
