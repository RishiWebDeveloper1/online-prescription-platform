import Prescription from '../models/Prescription.js';
import Consultation from '../models/Consultation.js';
import { generatePrescriptionPDF } from '../utils/generatePDF.js';

export const createPrescription = async (req, res, next) => {
  try {
    const { consultationId, careToBeTaken, medicines, notes } = req.body;
    if (!careToBeTaken) {
      return res.status(400).json({ message: 'careToBeTaken is required' });
    }

    const consultation = await Consultation.findById(consultationId);
    if (!consultation)
      return res.status(404).json({ message: 'Consultation not found' });

    const existing = await Prescription.findOne({ consultation: consultationId, doctor: req.user.id });
    if (existing) {
      return res.status(409).json({ message: 'Prescription already exists for this consultation' });
    }

    const prescription = await Prescription.create({
      consultation: consultationId,
      doctor: req.user.id,
      patient: consultation.patient,
      careToBeTaken,
      medicines,
      notes,
    });

    // Mark consultation completed
    await Consultation.findByIdAndUpdate(consultationId, { status: 'completed' });

    // Generate PDF asynchronously and persist the Buffer to MongoDB
    Prescription.findById(prescription._id)
      .populate('doctor', 'name specialty')
      .populate('patient', 'name')
      .then(async (populated) => {
        const pdfBuffer = await generatePrescriptionPDF(populated);
        await Prescription.findByIdAndUpdate(prescription._id, {
          pdf: { data: pdfBuffer, contentType: 'application/pdf' },
        });
      })
      .catch(console.error);

    res.status(201).json(prescription);
  } catch (err) { next(err); }
};

export const updatePrescription = async (req, res, next) => {
  try {
    const { careToBeTaken, medicines, notes } = req.body;
    if (!careToBeTaken) {
      return res.status(400).json({ message: 'careToBeTaken is required' });
    }

    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    if (prescription.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    prescription.careToBeTaken = careToBeTaken;
    prescription.medicines = medicines;
    prescription.notes = notes;
    prescription.pdf = undefined;
    await prescription.save();

    Prescription.findById(prescription._id)
      .populate('doctor', 'name specialty')
      .populate('patient', 'name')
      .then(async (populated) => {
        const pdfBuffer = await generatePrescriptionPDF(populated);
        await Prescription.findByIdAndUpdate(prescription._id, {
          pdf: { data: pdfBuffer, contentType: 'application/pdf' },
        });
      })
      .catch(console.error);

    res.json({ message: 'Prescription updated and PDF regenerated', id: prescription._id });
  } catch (err) { next(err); }
};

export const getPrescriptionsByPatient = async (req, res, next) => {
  try {
    const prescriptions = await Prescription
      .find({ patient: req.user.id })
      .populate('doctor', 'name specialty')
      .populate('consultation', 'symptoms createdAt')
      .select('-pdf.data');
    res.json(prescriptions);
  } catch (err) { next(err); }
};

export const getPrescriptionsByDoctor = async (req, res, next) => {
  try {
    const prescriptions = await Prescription
      .find({ doctor: req.user.id })
      .populate('patient', 'name email')
      .select('-pdf.data')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (err) { next(err); }
};

// Streams PDF buffer from MongoDB — no disk I/O
export const getPrescriptionPDF = async (req, res, next) => {
  try {
    const prescription = await Prescription
      .findById(req.params.id)
      .select('pdf patient doctor');

    if (!prescription?.pdf?.data)
      return res.status(404).json({ message: 'PDF not available yet — try again shortly' });

    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', `attachment; filename="prescription-${req.params.id}.pdf"`);
    res.send(prescription.pdf.data);
  } catch (err) { next(err); }
};
