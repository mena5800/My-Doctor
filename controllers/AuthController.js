class AuthController {
  static async isAuthenticated(req, res, next) {
    if (!req.session.email) {
      return res.status(401).send('Unauthorized');
    }
    return next();
  }

  // static async generateToken(req, res) {
  //   req.session.email = req.email
  // }

  static async deleteToken(req, res) {
    delete req.session.email
    return res.status(200).send('Successfully LOGOUT');
  }
}

module.exports = AuthController
