import {Router} from 'express';
import {getCategories, getProducts} from "../controllers/categories.controller.js";

const categoryRouter = Router();

categoryRouter.get('/', getCategories)
categoryRouter.get('/:category', getProducts)

export default categoryRouter;
