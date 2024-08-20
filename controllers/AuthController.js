class AuthController {
  static async isAuthenticated(req, res, next) {
    if (!req.session.user && req.originalUrl !== '/logout') {
      console.log('users is:', req.session.user)
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return next();
  }

  static async deleteToken(req, res) {
    console.log("DELETE TOKEN CALLED")
    req.session.destroy(err => {
      if (err) {

        return res.status(500).json({ error: 'Could not destroy session' });
      }
      console.log('Session Destroyed Successfully')
      res.status(200).json({ message: 'Session destroyed successfully' });
    });

  }
}

module.exports = AuthController
