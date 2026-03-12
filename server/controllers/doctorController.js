import Doctor from '../models/Doctor.js';

export const getAllDoctors = async (_req, res, next) => {
  try {
    const doctors = await Doctor.find().select('-password -profileImage.data');
    res.json(doctors);
  } catch (err) { next(err); }
};

export const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-password -profileImage.data');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) { next(err); }
};

export const updateDoctorProfile = async (req, res, next) => {
  try {
    const { name, specialty, phone, yearsOfExperience } = req.body;
    const update = { name, specialty, phone };
    if (yearsOfExperience !== undefined) {
      update.yearsOfExperience = Number(yearsOfExperience);
    }
    if (req.file) {
      update.profileImage = { data: req.file.buffer, contentType: req.file.mimetype };
    }
    const doctor = await Doctor
      .findByIdAndUpdate(req.user.id, update, { new: true })
      .select('-password -profileImage.data');
    res.json(doctor);
  } catch (err) { next(err); }
};

// Serves profile image binary directly (stored as Buffer in MongoDB)
export const getDoctorAvatar = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('profileImage');
    if (!doctor?.profileImage?.data)
      return res.status(404).json({ message: 'No avatar found' });
    res.set('Content-Type', doctor.profileImage.contentType);
    res.send(doctor.profileImage.data);
  } catch (err) { next(err); }
};
