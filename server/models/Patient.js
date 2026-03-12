import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    age: { type: Number, required: true, min: 0 },
    phone: { type: String, required: true, unique: true, trim: true },
    surgeryHistory: [{ type: String, trim: true }],
    illnessHistory: [{ type: String, trim: true }],
    profileImage: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

patientSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

patientSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('Patient', patientSchema);
