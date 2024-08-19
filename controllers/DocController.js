const { Doctor, User } = require('./Schema');

class DocController {
  static async newDoc(req, res) {
    if (await Doctor.findOne({ email: req.body.email }) || await User.findOne({ email: req.body.email })) {
      return res.status(400).json({ error: 'Email Already Exists' });
    }
    const newDoc = new Doctor(req.body);
    await newDoc.save()
    .then((result) => res.status(201).json({ id: result._id, email: result.email }))
    .catch((err) => {
      if (err.errors) {
        // Array of Missing data. e.g err.error.specialization.properties.message
        const errorMessages = Object.values(err.errors).map(error => error.properties.message);
        return res.status(400).json({ error: errorMessages});
      }
      return res.status(500).json({ error: 'Internal Error' })
    })
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
      return res.status(401).json({ error: 'No User is Selected' });
    }
    await Doctor.updateOne(
      { email: req.session.user.email },
      { $push: { users: { user, email } } }
    )
    .then(() => res.status(200).send('User Added Successfully'))
    .catch(() => res.status(400).send('Unable to Add User'))
  }

  static async findAllDocs(req, res) {
    Doctor.aggregate([
      {
        $project: {
          _id: 0,
          fullName: 1,
          email: 1,
          medicalLicenceNumber: 1,
        }
      }
    ])
    .then((result) => res.status(200).send(result))
    .catch(() => res.status(400).json({ error: 'Internal Error' }));
  }

  static async findDocsByDept(req, res) {
    const { department } = req.params;
    if (!department) {
      return res.status(400).json({ error: 'Invalid Department' });
    }
    Doctor.aggregate([
      { $match: { department } },
      {
        $project: {
          _id: 0,
          fullName: 1,
          email: 1,
          medicalLicenceNumber: 1,
        }
      }
    ])
    .then((result) => res.status(200).send(result))
    .catch(() => res.status(400).json({ error: 'Internal Error' }))
  }
}


module.exports = DocController;
