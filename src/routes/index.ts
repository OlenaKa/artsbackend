import { Router } from 'express';
import { healthCheck } from '../controllers/healthController';
import { getCategories } from '../controllers/categoriesController';
import { getStikeriPricing } from '../controllers/stikeriController';
import { getPvcNalepnicePrices } from '../controllers/pvcNalepniceController';
import { getZastitneNalepnicePricing } from '../controllers/zastitneNalepniceController';
import { getPapirneNalepnicePricing } from '../controllers/papirneNalepniceController';
import { getDigitalnaStampaPricing } from '../controllers/digitalnaStampaController';
import { getMagneti2dPricing } from '../controllers/magneti2dController';
import { getMagneti3dPricing } from '../controllers/magneti3dController';

const router = Router();

router.get('/health', healthCheck);
router.get('/categories', getCategories);
router.get('/stikeri', getStikeriPricing);
router.get('/pvc-nalepnice-prices', getPvcNalepnicePrices);
router.get('/zastitne-nalepnice-pricing', getZastitneNalepnicePricing);
router.get('/papirne-nalepnice-pricing', getPapirneNalepnicePricing);
router.get('/digitalna-stampa-pricing', getDigitalnaStampaPricing);
router.get('/magneti-2d-pricing', getMagneti2dPricing);
router.get('/magneti-3d-pricing', getMagneti3dPricing);

export default router;
