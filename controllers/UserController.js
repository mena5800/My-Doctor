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
    .then(() => res.status(200).send('Successfully Uploaded Doctor'))
    .catch (() => {
      return res.status(400).json({ error: 'Unable to add Doctor' })
    })
  }

  static async getMyDoctors(req, res) {
    const email = req.session.user.email;
    await User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(200).send(user.doctors);
      }
      return res.status(200).json({ error: 'No Doctors Found' })
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
}

module.exports = UserController;
