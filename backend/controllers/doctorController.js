const Doctor = require("../models/doctor");
const User = require("../models/user");
const sha256 = require("js-sha256");
const Patient = require("../models/patient");

class DoctorController {
  static async addPatient(req, res) {
    const { user, email } = req.body;
    if (!user || !email) {
      return res.status(401).json({ error: "No User is Selected" });
    }
    await Doctor.updateOne(
      { email: req.session.user.email },
      { $push: { users: { user, email } } }
    )
      .then(() => res.status(200).send("User Added Successfully"))
      .catch(() => res.status(400).send("Unable to Add User"));
  }

  static async findAllDoctors(req, res) {
    Doctor.aggregate([
      {
        $group: {
          _id: "$department", // Group by department
          doctors: {
            $push: {
              name: "$name",
              email: "$email",
              medicalLicenceNumber: "$medicalLicenceNumber",
              yearsOfExperience: "$yearsOfExperience",
              gender: "$gender",
              id: "$_id",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          department: "$_id",
          doctors: 1,
        },
      },
    ])
      .then((result) => {
        const departments = {};
        result.forEach((item) => {
          departments[item.department] = item.doctors;
        });
        res.status(200).send(departments);
      })
      .catch(() => res.status(400).json({ error: "Internal Error" }));
  }

  static async findDoctorsByDepartment(req, res) {
    const { department } = req.params.department;
    if (!department) {
      return res.status(400).json({ error: "Invalid Department" });
    }
    Doctor.aggregate([
      { $match: { department } },
      {
        $project: {
          _id: 0,
          name: 1,
          email: 1,
          medicalLicenceNumber: 1,
        },
      },
    ])
      .then((result) => res.status(200).send(result))
      .catch(() => res.status(400).json({ error: "Internal Error" }));
  }

  static async GetDoctorsDepartments(req, res) {
    const departments = [
      "Emergency Department (ED)",
      "Cardiology",
      "Oncology",
      "Pediatrics",
      "Orthopedics",
      "Radiology",
      "Neurology",
      "Gynecology and Obstetrics",
      "Gastroenterology",
      "Dentistry",
    ];
    return res.status(200).send(departments);
  }

  static async addDoctorToPatient(req, res) {
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
  
  

}


module.exports = DoctorController;
