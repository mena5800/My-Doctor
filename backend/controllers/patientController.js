const sha256 = require("js-sha256");
const Patient = require("../models/patient");
const User = require("../models/user");
const Doctor = require("../models/doctor");

class PatientController {
  
 
  static async addDoctor(req, res) {
    // Issue. It accepts same doctor multiple times
    const doctorId = req.body.doctorId;
    const patientId = req.session.user.userId; // Assuming userId is stored in session

    try {
      // Check if the doctor exists
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }
  
      // Find the patient and update their doctors list if the doctor is not already in the list
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
  
      if (patient.doctors.includes(doctorId)) {
        return res.status(400).json({ error: "Doctor already added" });
      }
  
      // Add doctor to the patient's doctors list
      patient.doctors.push(doctorId);
      await patient.save();
  
      return res.status(200).json({ message: "Successfully added doctor" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Unable to add doctor" });
    }
  }

}
module.exports = PatientController;