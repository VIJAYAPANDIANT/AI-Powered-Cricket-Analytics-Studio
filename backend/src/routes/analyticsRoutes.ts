import { Router } from 'express';
import { getOverviewMetrics, getChartsData, getHiddenInsights, getFilterOptions } from '../controllers/analyticsController';

const router = Router();

router.get('/metrics', getOverviewMetrics);
router.get('/charts', getChartsData);
router.get('/insights', getHiddenInsights);
router.get('/filters', getFilterOptions);

export default router;
