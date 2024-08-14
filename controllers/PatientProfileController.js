const dbClient = require('../utils/db');

class PatientProfileController {
    static async getPatientProfile(req, res) {
        try {
            const email = req.query.email; // Assume email is passed as query parameter
            const profile = await dbClient.db.collection('patientprofile').findOne({ email });
            if (!profile) {
                return res.status(404).json({ error: 'Profile not found' });
            }
            return res.status(200).json(profile);
        } catch (err) {
            console.error('Error fetching profile:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async savePatientProfile(req, res) {
        try {
            const profileData = req.body;
            const result = await dbClient.db.collection('patientprofile').updateOne(
                { email: profileData.email },
                { $set: profileData },
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
