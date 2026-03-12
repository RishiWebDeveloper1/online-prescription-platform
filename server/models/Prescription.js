import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema(
  {
    consultation: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    careToBeTaken: { type: String, required: true },
    medicines: { type: String },
    notes: { type: String },
    pdf: {
      data: Buffer,
      contentType: { type: String, default: 'application/pdf' },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Prescription', prescriptionSchema);
