const crypto = require('crypto');
const dbClient = require('../utils/db');

function hashedPassword(password) {
  const hashed = crypto.createHash('sha256').update(password)
  return hashed.digest('hex');
}


class DocController {
  static async newDoc(req, res) {
    const {
      password,
      ...otherFields
    } = req.body;

    if (!otherFields.fullName) {
      return res.status(400).json({ error: 'Missing Name'})
    }
    if (!otherFields.gender) {
      return res.status(400).json({ error: 'Missing gender'})
    }
    if (!otherFields.email) {
      return res.status(400).json({ error: 'Missing email'})
    }
    if (!password) {
      return res.status(400).json({ error: 'No password provided'})
    }
    if (!otherFields.contactInfo) {
      return res.status(400).json({ error: 'Provide your Contact Number'})
    }
    if (!otherFields.medicalLicenceNumber) {
      return res.status(400).json({ error: 'No Medical Licence Number provided'})
    }
    if (!otherFields.yearsOfExp) {
      return res.status(400).json({ error: 'Provide Number of Years of Experience'})
    }
    if (!otherFields.department) {
      return res.status(400).json({ error: 'Select a Department'})
    }

    const existingEmail = await dbClient.db.collection('doctors').findOne({ email: otherFields.email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already Exists' });
    }
    const hashedpwd = hashedPassword(password);
    try {
      const doc = await dbClient.db.collection('doctors').insertOne({
        password: hashedpwd,
        ...otherFields,
      })
      console.log('Successfully Created')
      return res.status(200).json({ id: doc.insertedId, LicenseNumber: otherFields.medicalLicenceNumber })
      // return res.redirect('/login');
    } catch(err) {
      console.error('Error occurred:', err);
      return res.status(500).json({ error: 'Unable to Create new User' })
    }
  }

  static async currentDoc(req, res) {
    const email = req.session.email;
    if (!email) {
      return res.status(400).json({ error: 'Missing Email' });
    }
    const user = await dbClient.db.collection('doctors').findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User does not exists' });
    }
    return res.status(200).send(`Welcome ${user.email}`);
  }

  static async addUser(req, res) {
    const { user } = req.body;
    if (!user) {
      return res.status(401).json({ error: 'No User is Selected' });
    }
    const { email } = req.session.email;
    if (!email) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    try {
      await dbClient.db.collection('users').updateOne({
        email,
        $push: { users: user }
      })
      return res.status(200).send('Succesfully Uploaded Doctors');
      // return res.redirect('/index');
    } catch (err) {
      console.error('Error occurred:', err);
      return res.status(500).json({ error: 'Server Error'})
    }
  }

  static async findAllDocs(req, res) {
    const allDocs = await dbClient.db.collection('doctors').aggregate([
      {
        $project: {
          _id: 0,
          fullName: 1,
          email: 1,
          medicalLicenceNumber: 1,
        }
      }
    ]).toArray();
    const result = [];
    for (const doc of allDocs) {
      const doctor = []
      for (const [, value] of Object.entries(doc)) {
        doctor.push(value)
      }
      result.push(doctor);
    }
    return res.status(200).send(result);
  }

  static async findDocsByDept(req, res) {
    const { department } = req.params;
    if (!department) {
      return res.status(400).json({ error: 'Invalid Department' });
    }
    // const allDocs = await dbClient.db.collection('doctors').find({ department }).toArray();
    const allDocs = await dbClient.db.collection('doctors').aggregate([
      { $match: { department } },
      {
        $project: {
          _id: 0,
          email: 1,
          fullName: 1,
          medicalLicenceNumber: 1,
        }
      }
    ]).toArray();
    const result = [];
    for (const doc of allDocs) {
      const doctor = []
      for (const [, value] of Object.entries(doc)) {
        doctor.push(value)
      }
      result.push(doctor);
    }
    return res.status(200).send(result);
  }

}

module.exports = DocController;
