import { Router } from 'express';
import {
  createPrescription,
  updatePrescription,
  getPrescriptionsByPatient,
  getPrescriptionsByDoctor,
  getPrescriptionPDF,
} from '../controllers/prescriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect(['doctor']), createPrescription);
router.put('/:id', protect(['doctor']), updatePrescription);
router.get('/my', protect(['patient']), getPrescriptionsByPatient);
router.get('/doctor', protect(['doctor']), getPrescriptionsByDoctor);
router.get('/:id/pdf', getPrescriptionPDF);

export default router;
