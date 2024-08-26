const sha256 = require("js-sha256");
const Patient = require("../models/patient");
const User = require("../models/user");
const Doctor = require("../models/doctor");

class PatientController {
  
  static async addDoctor(req, res) {
    const {doctorId} = req.params;
    const patientId = req.session.user.userId;

    try {
      // Find the patient and doctor by their IDs
      const patient = await Patient.findById(patientId);
      const doctor = await Doctor.findById(doctorId);

      // Ensure both patient and doctor exist
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }

      // Check if the doctor is already in the patient's list of doctors
      if (patient.doctors.includes(doctorId)) {
        return res.status(400).json({ message: "Doctor is already assigned to this patient" });
      }

      // Add the doctor to the patient's list of doctors
      patient.doctors.push(doctorId);

      // Add the patient to the doctor's list of patients
      doctor.patients.push(patientId);

      // Save both documents
      await patient.save();
      await doctor.save();

      return res.status(200).json({ message: "Doctor added to patient successfully" });
    } catch (error) {
      // Handle errors (e.g., invalid IDs, database errors)
      return res.status(500).json({ error: error.message });
    }
  }
  static async removeDoctor(req, res) {
    const { doctorId } = req.params;
    const patientId = req.session.user.userId;

    try {
        // Find the patient and doctor by their IDs
        const patient = await Patient.findById(patientId);
        const doctor = await Doctor.findById(doctorId);

        // Ensure both patient and doctor exist
        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }
        if (!doctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        // Check if the doctor is in the patient's list of doctors
        if (!patient.doctors.includes(doctorId)) {
            return res.status(400).json({ message: "Doctor is not assigned to this patient" });
        }

        // Remove the doctor from the patient's list of doctors
        patient.doctors.pull(doctorId);

        // Remove the patient from the doctor's list of patients
        doctor.patients.pull(patientId);

        // Save both documents
        await patient.save();
        await doctor.save();

        return res.status(200).json({ message: "Doctor removed from patient successfully" });
    } catch (error) {
        // Handle errors (e.g., invalid IDs, database errors)
        return res.status(500).json({ error: error.message });
    }
}

}
module.exports = PatientController;