class AuthController {
  static async isAuthenticated(req, res, next) {
    if (!req.session.email) {
      return res.status(401).send('Unauthorized');
    }
    console.log('SUCCESFULLY AUTHENTICATED');
    return next();
  }
}

module.exports = AuthController