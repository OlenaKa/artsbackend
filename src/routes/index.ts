import { Router } from 'express';
import { healthCheck } from '../controllers/healthController';
import { getCategories } from '../controllers/categoriesController';
import { getStikeriPricing } from '../controllers/stikeriController';

const router = Router();

router.get('/health', healthCheck);
router.get('/categories', getCategories);
router.get('/stikeri', getStikeriPricing);

export default router;
