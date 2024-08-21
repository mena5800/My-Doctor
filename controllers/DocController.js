const mongoose = require('mongoose');
const fs = require('fs');
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
    return res.status(200).send(`Welcome back ${req.session.user.email}`);
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
    .then((result) => {
      if (result.length === 0) return res.status(200).send('No Available Doctor Yet. Come back later')
      res.status(200).send(result)
  })
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

  static async getDocProfile(req, res) {
    let email = req.query.email; // Assume email is passed as query parameter
    if (!email) email = req.session.user.email
    const doc = await Doctor.findOne({ email, _id: new mongoose.Types.ObjectId(req.session.user.userId) });
    if (!doc) return res.status(401).json({ error: 'Unauthorized' });
    if (!doc.profile[0]) return res.status(200).send('Please Update Your Profile')
    return res.status(200).send(doc.profile[0]);
  }

  static async updateDocProfile(req, res) {
    Doctor.findOne({ email: req.session.user.email })
    .then((doc) => {
      if (doc.profile[0]) {
        for (const field in doc.profile[0]._doc) {
          doc.profile[0][field] = req.body[field] || doc.profile[0][field];
        }
      } else {
        doc.profile = req.body;
      }
      doc.profile[0].fullName = doc.fullName || req.body.name
      doc.profile[0].email = req.session.user.email
      doc.profile[0].medicalLicenceNumber = doc.medicalLicenceNumber
      doc.profile[0].specialization = req.body.specialization || doc.specialization
      doc.profile[0].department = req.body.department || doc.department
      doc.save()
      .then(() => res.status(200).send('Profile Updated Successfully'))
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
    .catch((err) => res.status(400).json({ error: 'Internal Error' }))
  })
  }

  static async docMedicalRecordUploads(req, res) {
    await Doctor.findOne({ email: req.session.user.email })
    .then((user) => {
      if (!user.medicalRecordUploads) return res.status(404).json({ error: 'No Medical Record Uploads'})
      const list = fs.readdirSync(user.medicalRecordUploads)
      return res.status(200).send(list);
    })
    .catch((err) => res.status(400).json({ error: 'Error fetching path', message: err }))
  }

}


module.exports = DocController;
