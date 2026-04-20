import { Router } from 'express';
import { getAllCategories } from '../controllers/categories/category.controller';

const router = Router();

router.get('/', getAllCategories);

export default router;
