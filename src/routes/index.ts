import { Router } from 'express';
import { healthCheck } from '../controllers/healthController';
import { getCategories } from '../controllers/categoriesController';
import { getStikeriPricing } from '../controllers/stikeriController';
import { getPvcNalepnicePrices } from '../controllers/pvcNalepniceController';
import { getZastitneNalepnicePricing } from '../controllers/zastitneNalepniceController';

const router = Router();

router.get('/health', healthCheck);
router.get('/categories', getCategories);
router.get('/stikeri', getStikeriPricing);
router.get('/pvc-nalepnice-prices', getPvcNalepnicePrices);
router.get('/zastitne-nalepnice-pricing', getZastitneNalepnicePricing);

export default router;
