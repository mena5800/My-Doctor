const Doctor = require("../models/doctor");
const User = require("../models/user");
const sha256 = require("js-sha256");

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
}

module.exports = DoctorController;
