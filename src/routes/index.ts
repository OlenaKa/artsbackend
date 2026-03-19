import { Router } from 'express';
import { healthCheck } from '../controllers/healthController';
import { getCategories, syncPromoCategories } from '../controllers/categoriesController';
import { getStikeriPricing } from '../controllers/stikeriController';
import { getPvcNalepnicePrices } from '../controllers/pvcNalepniceController';
import { getZastitneNalepnicePricing } from '../controllers/zastitneNalepniceController';
import { getPapirneNalepnicePricing } from '../controllers/papirneNalepniceController';
import { getDigitalnaStampaPricing } from '../controllers/digitalnaStampaController';
import { getMagneti2dPricing } from '../controllers/magneti2dController';
import { getMagneti3dPricing } from '../controllers/magneti3dController';
import { getRollupPricing } from '../controllers/rollupController';
import { getCdDvdPricing } from '../controllers/cdDvdController';
import {
  getPromoSolutionProducts,
  getPromoSolutionProductById,
} from '../controllers/productsController';

const router = Router();

router.get('/health', healthCheck);
router.get('/categories', getCategories);
router.post('/categories/sync-promo', syncPromoCategories);
router.get('/stikeri', getStikeriPricing);
router.get('/pvc-nalepnice-prices', getPvcNalepnicePrices);
router.get('/zastitne-nalepnice-pricing', getZastitneNalepnicePricing);
router.get('/papirne-nalepnice-pricing', getPapirneNalepnicePricing);
router.get('/digitalna-stampa-pricing', getDigitalnaStampaPricing);
router.get('/magneti-2d-pricing', getMagneti2dPricing);
router.get('/magneti-3d-pricing', getMagneti3dPricing);
router.get('/rollup-pricing', getRollupPricing);
router.get('/cd-dvd-pricing', getCdDvdPricing);
router.get('/promo-products', getPromoSolutionProducts);
router.get('/promo-products/:id', getPromoSolutionProductById);

export default router;
