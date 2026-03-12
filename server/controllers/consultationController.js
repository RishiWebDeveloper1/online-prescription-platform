import Consultation from '../models/Consultation.js';
import { generatePaymentQR } from '../utils/generateQR.js';

export const createConsultation = async (req, res, next) => {
  try {
    const {
      doctorId,
      symptoms,
      fee,
      currentIllnessHistory,
      recentSurgery,
      familyDiabeticStatus,
      allergies,
      otherFamilyHistory,
      transactionId,
    } = req.body;

    if (!doctorId) {
      return res.status(400).json({ message: 'doctorId is required' });
    }

    if (!symptoms && !currentIllnessHistory) {
      return res.status(400).json({ message: 'Current illness history is required' });
    }

    const qrCodeData = await generatePaymentQR({
      consultationRef: 'pending',
      doctorId,
      patientId: req.user.id,
      fee,
    });

    const consultation = await Consultation.create({
      patient: req.user.id,
      doctor: doctorId,
      symptoms: symptoms || currentIllnessHistory,
      currentIllnessHistory,
      recentSurgery,
      familyDiabeticStatus,
      allergies,
      otherFamilyHistory,
      fee,
      qrCodeData,
      transactionId,
      paymentStatus: transactionId ? 'paid' : 'unpaid',
    });
    res.status(201).json(consultation);
  } catch (err) { next(err); }
};

export const getConsultationById = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('doctor', 'name specialty email')
      .populate('patient', 'name email');
    if (!consultation)
      return res.status(404).json({ message: 'Consultation not found' });
    res.json(consultation);
  } catch (err) { next(err); }
};

export const getDoctorConsultations = async (req, res, next) => {
  try {
    const consultations = await Consultation
      .find({ doctor: req.user.id })
      .populate('patient', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(consultations);
  } catch (err) { next(err); }
};

export const getPatientConsultations = async (req, res, next) => {
  try {
    const consultations = await Consultation
      .find({ patient: req.user.id })
      .populate('doctor', 'name specialty')
      .sort({ createdAt: -1 });
    res.json(consultations);
  } catch (err) { next(err); }
};

export const updateConsultationStatus = async (req, res, next) => {
  try {
    const {
      status,
      diagnosis,
      notes,
      paymentStatus,
      transactionId,
      currentIllnessHistory,
      recentSurgery,
      familyDiabeticStatus,
      allergies,
      otherFamilyHistory,
    } = req.body;
    const consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      {
        status,
        diagnosis,
        notes,
        paymentStatus,
        transactionId,
        currentIllnessHistory,
        recentSurgery,
        familyDiabeticStatus,
        allergies,
        otherFamilyHistory,
      },
      { new: true }
    );
    if (!consultation)
      return res.status(404).json({ message: 'Consultation not found' });
    res.json(consultation);
  } catch (err) { next(err); }
};
