import { Router } from 'express';
import { uploadMatches, uploadDeliveries, getMetadataList } from '../controllers/datasetController';
import { authMiddleware } from '../middleware/authMiddleware';
import { uploadMiddleware } from '../middleware/uploadMiddleware';

const router = Router();

// Secure these routes using authMiddleware
router.post('/upload/matches', authMiddleware, uploadMiddleware.single('matches'), uploadMatches);
router.post('/upload/deliveries', authMiddleware, uploadMiddleware.single('deliveries'), uploadDeliveries);
router.get('/metadata', authMiddleware, getMetadataList);

export default router;
