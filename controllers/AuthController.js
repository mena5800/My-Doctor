class AuthController {
  static async isAuthenticated(req, res, next) {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return next();
  }
  

  static async deleteToken(req, res) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ error: 'Could not destroy session' });
      }
      res.status(200).json({ message: 'Session destroyed successfully' });
    });

  }
}

module.exports = AuthController