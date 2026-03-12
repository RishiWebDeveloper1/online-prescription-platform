import { Router } from 'express';
import { getPatientProfile, updatePatientProfile, getPatientAvatar } from '../controllers/patientController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadImage } from '../middleware/uploadMiddleware.js';

const router = Router();

router.get('/me', protect(['patient']), getPatientProfile);
router.put('/me', protect(['patient']), uploadImage, updatePatientProfile);
router.get('/:id/avatar', getPatientAvatar);

export default router;
