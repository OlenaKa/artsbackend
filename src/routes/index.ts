import { Router } from 'express';
import { healthCheck } from '../controllers/healthController';
import { getCategories } from '../controllers/categoriesController';
import { getStikeriPricing } from '../controllers/stikeriController';
import { getPvcNalepnicePrices } from '../controllers/pvcNalepniceController';
import { getZastitneNalepnicePricing } from '../controllers/zastitneNalepniceController';
import { getPapirneNalepnicePricing } from '../controllers/papirneNalepniceController';
import { getDigitalnaStampaPricing } from '../controllers/digitalnaStampaController';

const router = Router();

router.get('/health', healthCheck);
router.get('/categories', getCategories);
router.get('/stikeri', getStikeriPricing);
router.get('/pvc-nalepnice-prices', getPvcNalepnicePrices);
router.get('/zastitne-nalepnice-pricing', getZastitneNalepnicePricing);
router.get('/papirne-nalepnice-pricing', getPapirneNalepnicePricing);
router.get('/digitalna-stampa-pricing', getDigitalnaStampaPricing);

export default router;
