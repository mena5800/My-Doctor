const Doctor = require("../models/doctor");
const User = require("../models/user");
const sha256 = require("js-sha256");

class DocController {
  static async newDoc(req, res) {
    let user = await User.findOne({ email: req.body.email});
    if (user){
      return res.status(400).json({ error: "this email is registered as a user" });
    }

    const newDoc = new Doctor(req.body);
    await newDoc
      .save()
      .then((result) =>
        res.status(201).json({ id: result._id, email: result.email })
      )
      .catch((err) => {
        if (err.code === 11000) {
          // MongoDB code for duplicate
          return res.status(400).json({ error: "Email Already Exists" });
        } else if (err.errors) {
          // Array of Missing data. e.g err.error.specialization.properties.message
          const errorMessages = Object.values(err.errors).map(
            (error) => error.properties.message
          );
          return res.status(400).json({ error: errorMessages });
        }
        return res.status(500).json({ error: "Internal Error" });
      });
  }
  static async login(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Missing Email" });
    }
    if (!password) {
      return res.status(400).json({ error: "Missing Password" });
    }

    let doctor = await Doctor.findOne({ email, password: sha256(password) });

    if (!doctor) {
      // redirect to this login page
      return res.status(401).json({ error: "Email or Password Incorrect" });
    }
    const doctorId = doctor.id;
    req.session.user = { email, doctorId };
    return res.status(200).send("Successfully login. Token Generated");
  }

  static async currentDoc(req, res) {
    const user = await Doctor.findOne({ email: req.session.user.email });
    // if (!user) {
    //   return res.status(400).json({ error: 'Doctor does not exists' });
    // }
    return res.status(200).send(`Welcome back ${user.email}`);
  }

  static async addUser(req, res) {
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

  static async findAllDocs(req, res) {
    Doctor.aggregate([
      {
        $group: {
          _id: "$department", // Group by department
          doctors: {
            $push: {
              fullName: "$fullName",
              email: "$email",
              medicalLicenceNumber: "$medicalLicenceNumber",
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
  

  static async findDocsByDept(req, res) {
    const { department } = req.params;
    if (!department) {
      return res.status(400).json({ error: "Invalid Department" });
    }
    Doctor.aggregate([
      { $match: { department } },
      {
        $project: {
          _id: 0,
          fullName: 1,
          email: 1,
          medicalLicenceNumber: 1,
        },
      },
    ])
      .then((result) => res.status(200).send(result))
      .catch(() => res.status(400).json({ error: "Internal Error" }));
  }

  static async doctorsDepts(req, res) {
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

module.exports = DocController;
