const crypto = require('crypto');
const dbClient = require('../utils/db');

function hashedPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

class UserController {
  // Create a new user
  static async newUser(req, res) {
    const { name, email, password, role } = req.body; // Destructure name and role from the body

    if (!email) {
      return res.status(400).json({ error: 'No email provided' });
    }

    if (!password) {
      return res.status(400).json({ error: 'No password provided' });
    }

    if (!name) {
      return res.status(400).json({ error: 'No name provided' });
    }

    if (!role) {
      return res.status(400).json({ error: 'No role provided' });
    }

    try {
      const checkEmail = await dbClient.db.collection('users').findOne({ email });

      if (checkEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const hashedpwd = hashedPassword(password);

      const user = await dbClient.db.collection('users').insertOne({
        name,   // Store name
        email,
        password: hashedpwd,
        role    // Store role
      });

      console.log('Successfully Created');
      console.log(user.insertedId);

      res.status(200).json({ id: user.insertedId, email, name, role });
    } catch (err) {
      res.status(500).json({ error: 'Unable to create new user' });
    }
  }

  // Get the current user based on email
  static async currentUser(req, res) {
    const email = req.body.email;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    try {
      const user = await dbClient.db.collection('users').findOne({ email });

      if (!user) {
        return res.status(404).json({ error: 'User does not exist' });
      }

      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get user by email and password (for login)
  static async getUserByEmailAndPassword(req, res) {
    const { email, password } = req.query;

    console.log(`Attempting to find user with email: ${email}`);

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const hashedpwd = hashedPassword(password);
        console.log(`Searching for user with hashed password: ${hashedpwd}`);

        const user = await dbClient.db.collection('users').findOne({ email, password: hashedpwd });

        if (user) {
            console.log('User found:', user);
            res.status(200).json([user]);
        } else {
            console.log('User not found');
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = UserController;