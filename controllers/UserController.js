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
      return res.status(204).json({ error: 'No email provided'})
    }
    if (!password) {
      return res.status(204).json({ error: 'No password provided'})
    }

    const checkEmail = await dbClient.db.collection('users').findOne({ email });

    if (checkEmail) {
      return res.status(400).json({ error: 'Eamil Already Exists' });
      return res.redirect('/user/register')
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
      res.status(200).json({ id: user.insertedId, email })
    } catch(err) {
      res.status(500).json({ error: 'Unable to Create new User' })
    }
  }

  static async currentUser(req, res) {
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({ error: 'Missing Email' });
    }
    const user = await dbClient.db.collection('users').findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User does not exists' });
    }
    return res.status(200).send(`Welcome ${user}`);
  }

  static async getAllUsers(req, res) {
    if (!(req.session.email === 'adejare77@gmail.com')) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const allUsers = await dbClient.db.collection('users').find().toArray();
    return res.status(200).send(allUsers);
  }
}

module.exports = UserController;
