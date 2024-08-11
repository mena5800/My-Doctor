const { uuid: v4 } = require('uuid');
const dbClient = require('../utils/db');

class AuthController {
  static async isAuthenticated(req, res, next) {
    if (!req.session.email) {
      return res.status(401).send('Not Authorized');
    }
    console.log('SUCCESFULLY AUTHENTICATED');
    return next();
  }

  // This is a temporary function that'll be deleted later
  static async getTokenForUser(req, res) {
    const token = `auth_${v4()}`;
    if (!req.session.token) {
      req.session.token = token;
    }
    return res.status(200).json({ token: req.session.token });
  }
}

module.exports = AuthController
