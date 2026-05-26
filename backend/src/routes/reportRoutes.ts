import { Router } from 'express';
import { downloadPdfReport, exportData, exportCsvReport } from '../controllers/reportController';

const router = Router();

router.get('/report/pdf', downloadPdfReport);
router.get('/report/export', exportData);
router.get('/report/csv', exportCsvReport);

export default router;
