import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    symptoms: { type: String, required: true },
    currentIllnessHistory: { type: String },
    recentSurgery: { type: String },
    familyDiabeticStatus: {
      type: String,
      enum: ['diabetic', 'non-diabetic', ''],
      default: '',
    },
    allergies: { type: String },
    otherFamilyHistory: { type: String },
    diagnosis: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
    fee: { type: Number },
    qrCodeData: { type: String },
    transactionId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Consultation', consultationSchema);
