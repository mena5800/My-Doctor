const { Profile } = require('./Schema');

class PatientProfileController {
  static async getPatientProfile(req, res) {
    try {
      const email = req.query.email; // Assume email is passed as query parameter
      const profile = await Profile.findOne({ email });
      if (!profile) return res.status(404).json({ error: 'Profile not found' });
      return res.status(200).json(profile);
    } catch (err) {
      console.error('Error fetching profile:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async savePatientProfile(req, res) {
    try {
      const profileData = req.body;

      // Remove _id from profileData if it exists
      const { _id, ...profileWithoutId } = profileData;

      const result = await Profile.updateOne(
        { email: profileData.email },
        { $set: profileWithoutId }, // Update without the _id field
        { upsert: true }
      );

      return res.status(200).json({ success: true, result });
    } catch (err) {
      console.error('Error saving profile:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = PatientProfileController;
