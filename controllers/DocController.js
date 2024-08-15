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

    static async currentDoc(req, res) {
        try {
            // Use session or JWT token to get the email
            const email = req.session?.email || req.user?.email;

            if (!email) {
                return res.status(400).json({ error: 'Missing Email' });
            }

            const doctor = await dbClient.db.collection('doctors').findOne({ email });
            if (!doctor) {
                return res.status(404).json({ error: 'Doctor not found' });
            }

            // Return the doctor object as JSON
            return res.status(200).json(doctor);
        } catch (err) {
            console.error('Error fetching doctor profile:', err);
            return res.status(500).json({ error: 'Failed to fetch doctor profile' });
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
                    email: 1,
                    medicalLicenceNumber: 1,
                }
            }
        ]).toArray();
        const result = [];
        for (const doc of allDocs) {
            const doctor = [];
            for (const [, value] of Object.entries(doc)) {
                doctor.push(value);
            }
            result.push(doctor);
        }
        return res.status(200).send(result);
    }

    static async findDocsByDept(req, res) {
        const { department } = req.params;
        if (!department) {
            return res.status(400).json({ error: 'Invalid Department' });
        }
        const allDocs = await dbClient.db.collection('doctors').aggregate([
            { $match: { department } },
            {
                $project: {
                    _id: 0,
                    email: 1,
                    fullName: 1,
                    medicalLicenceNumber: 1,
                }
            }
        ]).toArray();
        const result = [];
        for (const doc of allDocs) {
            const doctor = [];
            for (const [, value] of Object.entries(doc)) {
                doctor.push(value);
            }
            result.push(doctor);
        }
        return res.status(200).send(result);
    }
}

module.exports = DocController;
