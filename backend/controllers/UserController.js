const User = require("../models/user");
const sha256 = require("js-sha256");
const Doctor = require("../models/doctor");
class UserController {
  static async newUser(req, res) {
    try {
      let email = req.body.email
      // Check if the email is already registered as a doctor
      let doctor = await Doctor.findOne({ email });
      if (doctor) {
        return res.status(400).json({ error: "This email is registered as a doctor" });
      }
  
      // Create and save the new user
      const newUser = new User(req.body);
      const result = await newUser.save();

      // Return a successful response
      let userId = result._id
      req.session.user = { email, userId, type:"User"};
      // return res.status(201).json({ id: result._id, email: req.body.email });
      return res.status(201).json("Successfully sign up. Token Generated");

    } catch (err) {
      // Handle specific errors
      if (err.code === 11000) {
        // MongoDB code for duplicate key error
        return res.status(400).json({ error: "Email Already Exists" });
      } else if (err.errors) {
        // Validation errors
        const errorMessages = Object.values(err.errors).map(
          (error) => error.properties.message
        );
        return res.status(400).json({ error: errorMessages });
      }
      console.log(err)
      // Catch-all for any other errors
      return res.status(500).json({ error: "Internal Error" });
    }
  }
  static async login(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Missing Email" });
    }
    if (!password) {
      return res.status(400).json({ error: "Missing Password" });
    }
    let user = await User.findOne({ email, password: sha256(password) });

    if (!user) {
      // redirect to this login page
      return res.status(401).json({ error: "Email or Password Incorrect" });
    }
    let userId = user.id
    req.session.user = { email, userId, type:"User"};

    return res.status(200).json("Successfully login. Token Generated");
  }

  static async currentUser(req, res) {
    // const email = req.session.user.email;
    // if (!email) {
    //   return res.status(400).json({ error: 'Missing Email' });
    // }
    // const user = await User.findOne({ email });
    // if (!user) {
    //   return res.status(400).json({ error: 'User does not exists' });
    // }
    return res.status(200).send(`Welcome back ${req.session.user.email}`);
  }

  static async addDoctor(req, res) {
    // Issue. It accepts same doctor multiple times
    const { medicalLicenceNumber, fullName, email } = req.body;
    if (!medicalLicenceNumber || !fullName || !email) {
      return res.status(401).json({ error: "No Doctor is Selected" });
    }
    await User.updateOne(
      { email: req.session.user.email },
      { $push: { doctors: { fullName, email, medicalLicenceNumber } } }
    )
      .then(() => res.status(200).send("Successfully Uploaded Doctor"))
      .catch(() => {
        return res.status(400).json({ error: "Unable to add Doctor" });
      });
  }

  static async getMyDoctors(req, res) {
    const email = req.session.user.email;
    // if (!email) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }
    await User.findOne({ email })
      .then((user) => {
        if (user) {
          return res.status(200).send(user.doctors);
        }
        return res.status(200).json({ error: "No Doctors Found" });
      })
      .catch(() => res.status(400).json({ error: "Internal Error" }));
  }

  // For Administrators only
  static async getAllUsers(req, res) {
    if (!(req.session.user.email === process.env.EMAIL)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    await User.find()
      .then((allUsers) => res.status(200).send(allUsers))
      .catch(() => res.status(500).json({ error: "Internal Error" }));
  }
  static async getPatientProfile(req, res) {
    try {
        console.log(4)
        const email = req.session.user.email; // Assume email is passed as query parameter
        const profile = await User.findOne({ email });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        return res.status(200).json(profile);
    } catch (err) {
        console.error('Error fetching profile:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
static async checkSession(req, res) {
  if (req.session && req.session.user) {
    // Session exists, return user data
    return res.status(200).json(req.session.user);
  } else {
    // No valid session
    return res.status(401).json({ error: "No valid session" });
  }
}
}

module.exports = UserController;
