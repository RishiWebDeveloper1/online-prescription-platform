import Patient from '../models/Patient.js';

export const getPatientProfile = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.user.id).select('-password -profileImage.data');
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) { next(err); }
};

export const updatePatientProfile = async (req, res, next) => {
  try {
    const { name, phone, age, surgeryHistory, illnessHistory } = req.body;
    const update = { name, phone };
    if (age !== undefined) {
      update.age = Number(age);
    }
    if (surgeryHistory !== undefined) {
      update.surgeryHistory = String(surgeryHistory)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
    if (illnessHistory !== undefined) {
      update.illnessHistory = String(illnessHistory)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
    if (req.file) {
      update.profileImage = { data: req.file.buffer, contentType: req.file.mimetype };
    }
    const patient = await Patient
      .findByIdAndUpdate(req.user.id, update, { new: true })
      .select('-password -profileImage.data');
    res.json(patient);
  } catch (err) { next(err); }
};

export const getPatientAvatar = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).select('profileImage');
    if (!patient?.profileImage?.data)
      return res.status(404).json({ message: 'No avatar found' });
    res.set('Content-Type', patient.profileImage.contentType);
    res.send(patient.profileImage.data);
  } catch (err) { next(err); }
};
