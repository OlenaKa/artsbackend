import { Router } from 'express';
import { healthCheck } from '../controllers/healthController';
import { getCategories } from '../controllers/categoriesController';

const router = Router();

router.get('/health', healthCheck);
router.get('/categories', getCategories);

export default router;
