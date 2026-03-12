import { Router } from 'express';
import {
  createConsultation,
  getConsultationById,
  getDoctorConsultations,
  getPatientConsultations,
  updateConsultationStatus,
} from '../controllers/consultationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect(['patient']), createConsultation);
router.get('/doctor', protect(['doctor']), getDoctorConsultations);
router.get('/patient', protect(['patient']), getPatientConsultations);
router.get('/:id', protect(['doctor', 'patient']), getConsultationById);
router.put('/:id', protect(['doctor']), updateConsultationStatus);

export default router;
