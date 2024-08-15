const crypto = require('crypto');
const dbClient = require('../utils/db');

function hashedPassword(password) {
    const hashed = crypto.createHash('sha256').update(password);
    return hashed.digest('hex');
}

class DocController {
    static async newDoc(req, res) {
        const { password, fullName, email, role = 'doctor', ...otherFields } = req.body;

        // Validate required fields
        if (!fullName) return res.status(400).json({ error: 'Missing Name' });
        if (!email) return res.status(400).json({ error: 'Missing email' });
        if (!password) return res.status(400).json({ error: 'No password provided' });
        if (!otherFields.contactInfo) return res.status(400).json({ error: 'Provide your Contact Number' });
        if (!otherFields.medicalLicenceNumber) return res.status(400).json({ error: 'No Medical Licence Number provided' });
        if (!otherFields.yearsOfExp) return res.status(400).json({ error: 'Provide Number of Years of Experience' });
        if (!otherFields.department) return res.status(400).json({ error: 'Select a Department' });

        const existingEmail = await dbClient.db.collection('doctors').findOne({ email });
        if (existingEmail) return res.status(400).json({ error: 'Email already Exists' });

        const hashedpwd = hashedPassword(password);

        try {
            // Insert into the doctors collection
            const doc = await dbClient.db.collection('doctors').insertOne({
                password: hashedpwd,
                fullName,
                email,
                role,
                ...otherFields,
            });

            // Insert into the users collection
            const user = await dbClient.db.collection('users').insertOne({
                password: hashedpwd,
                name: fullName,
                email,
                role,
            });

            console.log('Successfully Created Doctor and User');
            return res.status(200).json({ id: doc.insertedId, userId: user.insertedId, LicenseNumber: otherFields.medicalLicenceNumber });
        } catch (err) {
            console.error('Error occurred:', err);
            return res.status(500).json({ error: 'Unable to Create new Doctor' });
        }
    }

    static async addUser(req, res) {
        const { user } = req.body;
        if (!user) {
            return res.status(401).json({ error: 'No User is Selected' });
        }
        const { email } = req.session.email;
        if (!email) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            await dbClient.db.collection('users').updateOne(
                { email },
                { $push: { users: user } }
            );
            return res.status(200).send('Successfully Uploaded Doctors');
        } catch (err) {
            console.error('Error occurred:', err);
            return res.status(500).json({ error: 'Server Error' });
        }
    }

    static async findAllDocs(req, res) {
        const allDocs = await dbClient.db.collection('doctors').aggregate([
            {
                $project: {
                    _id: 0,
                    fullName: 1,
                    medicalLicenceNumber: 1,
                    yearsOfExp: 1, // Include yearsOfExp
                }
            }
        ]).toArray();
        return res.status(200).json(allDocs);
    }

    static async findDocsByDept(req, res) {
        const { department } = req.params;
        if (!department) {
            return res.status(400).json({ error: 'Invalid Department' });
        }
        try {
            const doctors = await dbClient.db.collection('doctors').find(
                { department },
                {
                    projection: {
                        _id: 0,
                        fullName: 1,
                        yearsOfExp: 1, // Include yearsOfExp in the projection
                    }
                }
            ).toArray();
            return res.status(200).json(doctors);
        } catch (err) {
            console.error('Error fetching doctors by department:', err);
            return res.status(500).json({ error: 'Failed to fetch doctors' });
        }
    }

    static async getDoctorProfile(req, res) {
        const email = req.query.email;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        try {
            const profile = await dbClient.db.collection('doctors').findOne({ email });
            if (!profile) {
                return res.status(404).json({ error: 'Profile not found' });
            }

            return res.status(200).json(profile);
        } catch (err) {
            console.error('Error fetching doctor profile:', err);
            return res.status(500).json({ error: 'Failed to fetch doctor profile' });
        }
    }

    static async saveDoctorProfile(req, res) {
        const { email, ...profileData } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        try {
            const result = await dbClient.db.collection('doctors').updateOne(
                { email },
                { $set: profileData },
                { upsert: true }
            );
            return res.status(200).json({ message: 'Profile updated successfully', result });
        } catch (err) {
            console.error('Error saving doctor profile:', err);
            return res.status(500).json({ error: 'Failed to save doctor profile' });
        }
    }

    static async getCurrentDoctor(req, res) {
        try {
            const email = req.query.email;

            if (!email) {
                return res.status(400).json({ error: 'Missing Email' });
            }

            const doctor = await dbClient.db.collection('doctors').findOne({ email });
            if (!doctor) {
                return res.status(404).json({ error: 'Doctor not found' });
            }

            return res.status(200).json(doctor);
        } catch (err) {
            console.error('Error fetching doctor profile:', err);
            return res.status(500).json({ error: 'Failed to fetch doctor profile' });
        }
    }

    static async updateDoctorProfile(req, res) {
        const { email, _id, ...profileData } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        try {
            const result = await dbClient.db.collection('doctors').updateOne(
                { email },
                { $set: profileData },
                { upsert: true }
            );
            return res.status(200).json({ message: 'Profile updated successfully', result });
        } catch (err) {
            console.error('Error saving doctor profile:', err);
            return res.status(500).json({ error: 'Failed to save doctor profile' });
        }
    }
}

module.exports = DocController;
