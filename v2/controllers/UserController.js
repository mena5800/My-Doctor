const { User } = require('./Schema');

class UserController {
  static async newUser(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing Email' });
    }
    else if (!password) {
      return res.status(400).json({ error: 'No password is provided' });
    }
    const newUser = new User({ email, password});
    await newUser.save()
    .then ((result) => res.status(201).json({ id: result._id, email }))
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Email Already Exists' });
      }
      return res.status(500).json({ error: 'Unable to create a new User' });
    })
  }

  static async currentUser(req, res) {
    const email = req.session.email;
    if (!email) {
      return res.status(400).json({ error: 'Missing Email' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User does not exists' });
    }
    return res.status(200).send(`Welcome back ${user.email}`);
  }

  static async addDoctor(req, res) {
    const { medicalLicenceNumber, name, docEmail} = req.params;
    if (!medicalLicenceNumber || !name || !docEmail) {
      return res.status(401).json({ error: 'No Doctor is Selected' });
    }
    await User.updateOne(
      { email: req.session.email },
      { $push: { doctors: { name, docEmail, medicalLicenceNumber } } }
    )
    .then(() => res.status(200).send('Successfully Uploaded Doctor'))
    .catch (() => {
      return res.status(400).json({ error: 'Unable to add Doctor' })
    })
  }

  static async getMyDoctors(req, res) {
    const email = req.session.email;
    if (!email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    await User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(200).send(user.doctors);
      }
      return res.status(200).json({ error: 'No Doctors Fouund' })
    }).catch(() => res.status(400).json({ error: 'Internal Error' }));
  }

  // For Administrators only
  static async getAllUsers(req, res) {
    if (!(req.session.email === process.env.EMAIL)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await User.find()
    .then((allUsers) => res.status(200).send(allUsers))
    .catch(() => res.status(500).json({ error: 'Internal Error' }))
  }
}

module.exports = UserController;
