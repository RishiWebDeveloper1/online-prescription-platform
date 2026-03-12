import jwt from 'jsonwebtoken';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const splitCommaValues = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap((item) => splitCommaValues(item));
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const buildUserResponse = (entity, role) => ({
  id: entity._id,
  name: entity.name,
  email: entity.email,
  role,
});

// ── Doctor ───────────────────────────────────────────────────────────────
export const doctorSignup = async (req, res, next) => {
  try {
    const body = req.body || {};
    const { name, email, password, specialty, phone, yearsOfExperience } = body;

    if (!name || !email || !password || !specialty || !phone || yearsOfExperience === undefined) {
      return res.status(400).json({
        message: 'Missing required doctor fields: name, specialty, email, phone, yearsOfExperience, password',
      });
    }

    if (await Doctor.findOne({ email }))
      return res.status(409).json({ message: 'Email already registered' });
    if (await Doctor.findOne({ phone }))
      return res.status(409).json({ message: 'Phone number already registered' });

    const doctor = await Doctor.create({
      name,
      email,
      password,
      specialty,
      phone,
      yearsOfExperience: Number(yearsOfExperience),
      ...(req.file && {
        profileImage: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        },
      }),
    });
    const token = signToken(doctor._id, 'doctor');
    res.status(201).json({ token, user: buildUserResponse(doctor, 'doctor') });
  } catch (err) { next(err); }
};

export const doctorLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    if (!doctor || !(await doctor.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(doctor._id, 'doctor');
    res.json({ token, user: buildUserResponse(doctor, 'doctor') });
  } catch (err) { next(err); }
};

// ── Patient ──────────────────────────────────────────────────────────────
export const patientSignup = async (req, res, next) => {
  try {
    const body = req.body || {};
    const { name, email, password, age, phone, surgeryHistory, illnessHistory } = body;

    if (!name || !email || !password || !phone || age === undefined) {
      return res.status(400).json({
        message: 'Missing required patient fields: name, age, email, phone, password',
      });
    }

    if (await Patient.findOne({ email }))
      return res.status(409).json({ message: 'Email already registered' });
    if (await Patient.findOne({ phone }))
      return res.status(409).json({ message: 'Phone number already registered' });

    const patient = await Patient.create({
      name,
      email,
      password,
      age: Number(age),
      phone,
      surgeryHistory: splitCommaValues(surgeryHistory),
      illnessHistory: splitCommaValues(illnessHistory),
      ...(req.file && {
        profileImage: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        },
      }),
    });
    const token = signToken(patient._id, 'patient');
    res.status(201).json({ token, user: buildUserResponse(patient, 'patient') });
  } catch (err) { next(err); }
};

export const patientLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });
    if (!patient || !(await patient.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(patient._id, 'patient');
    res.json({ token, user: buildUserResponse(patient, 'patient') });
  } catch (err) { next(err); }
};
