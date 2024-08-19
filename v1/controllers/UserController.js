const crypto = require('crypto');
const dbClient = require('../utils/db');

function hashedPassword(password) {
  const hashed = crypto.createHash('sha256').update(password)
  return hashed.digest('hex');
}

class UserController {
  static async newUser(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(204).json({ error: 'Missing email'})
    }
    if (!password) {
      return res.status(204).json({ error: 'No password provided'})
    }

    const checkEmail = await dbClient.db.collection('users').findOne({ email });

    if (checkEmail) {
      return res.status(400).json({ error: 'Email Already Exists' });
      // return res.redirect('/user/register')
    }
    const hashedpwd = hashedPassword(password);
    try {
      const user = await dbClient.db.collection('users').insertOne({
        email,
        password: hashedpwd,
      })
      console.log('Successfully Created')
      console.log(user.insertedId)
      // res.status(200).redirect('/login');
      return res.status(200).json({ id: user.insertedId, email })
      // return res.redirect('/login');
    } catch(err) {
      console.log("Error:", err);
      return res.status(500).json({ error: 'Unable to Create new User' });
    }
  }

  static async currentUser(req, res) {
    const email = req.session.email;
    if (!email) {
      return res.status(400).json({ error: 'Missing Email' });
    }
    const user = await dbClient.db.collection('users').findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User does not exists' });
    }
    return res.status(200).send(`Welcome ${user.email}`);
  }

  static async addDoctor(req, res) {
    const { medicalLicenceNumber, name, docemail } = req.params;
    if (!medicalLicenceNumber || !name || !docemail) {
      return res.status(401).json({ error: 'No Doctor is Selected' });
    }
    const email = req.session.email;
    if (!email) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    try {
      const docInfo = {
        fullName: name,
        email: docemail,
        medicalLicenceNumber
      }
      const doc = await dbClient.db.collection('users').findOne({ doctors: docInfo })
      if (doc) {
        return res.status(400).json({ error: 'Doctor already added' })
      }
      await dbClient.db.collection('users').updateOne(
        { email },
        { $push: { doctors: docInfo } }
      )
      return res.status(200).send('Succesfully Uploaded Doctor');
      // return res.redirect('/index');
    } catch (err) {
      return res.status(500).json({ error: 'Server Error'})
    }
  }

  static async getMyDoctors(req, res) {
    const { email } = req.session;
    if (!email) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const user = await dbClient.db.collection('users').findOne({ email })
    const userDoctors = user.doctors;
    return res.status(400).send(userDoctors);
  }


  // For Administrative use only
  static async getAllUsers(req, res) {
    if (!(req.session.email === 'adejare77@gmail.com')) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const allUsers = await dbClient.db.collection('users').find().toArray();
    return res.status(200).send(allUsers);
  }
}

module.exports = UserController;
