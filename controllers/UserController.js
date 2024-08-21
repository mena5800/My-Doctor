const mongoose = require('mongoose');
const fs = require('fs');
const { User, Doctor } = require('./Schema');

class UserController {
  // Create a new user
  static async newUser(req, res) {
    if ( await User.findOne({ email: req.body.email }) || await Doctor.findOne({ email: req.body.email })) {
      return res.status(400).json({ error: 'Email Already Exists' });
    }
    const newUser = new User(req.body);
    await newUser.save()
    .then ((result) => res.status(201).json({ id: result._id, email: result.email }))
    .catch((err) => {
      if (err.errors) {
        // Array of Missing data. e.g err.error.specialization.properties.message
        const errorMessages = Object.values(err.errors).map(error => error.properties.message);
        return res.status(400).json({ error: errorMessages});
      }
      return res.status(500).json({ error: 'Unable to create a new User' });
    })
  }

  // Get the current user based on email
  static async currentUser(req, res) {
    return res.status(200).send(`Welcome back ${req.session.user.email}`);
  }

  static async addDoctor(req, res) {
    // Issue. It accepts same doctor multiple times
    const { medicalLicenceNumber, fullName, email } = req.body;
    if (!medicalLicenceNumber || !fullName || !email) {
      return res.status(401).json({ error: 'No Doctor is Selected' });
    }
    await User.updateOne(
      { email: req.session.user.email },
      { $push: { doctors: { fullName, email, medicalLicenceNumber } } }
    )
    .then(() => res.status(200).send('Successfully Added Doctor'))
    .catch (() => {
      return res.status(400).json({ error: 'Unable to Add Doctor' })
    })
  }

  static async getMyDoctors(req, res) {
    const email = req.session.user.email;
    await User.findOne({ email })
    .then((user) => {
      if (user.doctors.length > 0) {
        return res.status(200).send(user.doctors);
      }
      return res.status(200).json({ error: 'No Doctor Added Yet' })
    }).catch(() => res.status(400).json({ error: 'Internal Error' }));
  }

  // For Administrators only
  static async getAllUsers(req, res) {
    if (!(req.session.user.email === process.env.EMAIL)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await User.find()
    .then((allUsers) => res.status(200).send(allUsers))
    .catch(() => res.status(500).json({ error: 'Internal Error' }))
  }

  static async getUserProfile(req, res) {
      let email = req.query.email; // Assume email is passed as query parameter
      if (!email) email = req.session.user.email
      const user = await User.findOne({ email, _id: new mongoose.Types.ObjectId(req.session.user.userId) });
      if (!user) return res.status(401).json({ error: 'Unauthorized' });
      if (!user.profile[0]) return res.status(200).send('Please Update Your Profile')
      return res.status(200).json(user.profile[0]);
    }

  static async updateUserProfile(req, res) {
    User.findOne({ email: req.session.user.email })
    .then((user) => {
      if (user.profile[0]) {
        for (const field in user.profile[0]._doc) {
          user.profile[0][field] = req.body[field] || user.profile[0][field];
        }
      } else {
        user.profile = req.body;
      }
      user.profile[0].email = req.session.user.email
      user.save()
      return res.status(200).send('Profile Updated Successfully')
    })
    .catch((err) => {
      let msg = err
      if (err.errors) {
        msg = Object.values(err.errors).map(cause => cause.properties.message);
      }
      return res.status(400).json({
      error: 'Could not Update Profile',
      message: msg
    })
  })
  }

  static async userMedicalRecordUploads(req, res) {
    await User.findOne({ email: req.session.user.email })
    .then((user) => {
      if (!user.medicalRecordUploads) return res.status(404).json({ error: 'No Medical Record Uploads'})
      const list = fs.readdirSync(user.medicalRecordUploads)
      return res.status(200).send(list);
    })
    .catch((err) => res.status(400).json({ error: 'Error fetching path', message: err }))
  }
}

module.exports = UserController;
