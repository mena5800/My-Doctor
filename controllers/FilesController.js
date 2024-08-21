const sha256 = require('js-sha256');
const fs = require('fs');
const path = require('path');
const { File, User, Doctor } = require('./Schema')

class FilesController {
  static async login(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing Email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing Password' });
    }
    let user = await User.findOne({ email, password: sha256(password) })
    // console.log('*******************************')
    // console.log(email)
    // console.log(sha256(password))
    // console.log('*******************************')
    if (!user) {
      user = await Doctor.findOne({ email, password: sha256(password) })
    }
    if (!user) {
      // redirect to this login page
      return res.status(401).json({ error: 'Email or Password Incorrect' });
    }
    const userId = user.id
    req.session.user = { email, userId };
    return res.status(200).send('Successfully login. Token Generated')
  }

  static async getAllUserFiles(req, res) {
    const userFiles = await File.findOne({ userId: req.session.user.userId })
    if (!userFiles) return res.status(400).json({ message: 'No File Found' })
    const filePath = userFiles.path;
    const allDirs = fs.readdirSync(filePath)
    const allContents = [];
    for (const dir of allDirs) {
      const files = fs.readdirSync(path.join(filePath, dir))
      files.map(file => allContents.push(path.join(filePath, dir, file)));
    }
    return res.status(200).send(allContents);
  }

  static async getFile(req, res) {
    const userFiles = await File.findOne({ userId: req.session.user.userId })
    if (!userFiles) return res.status(400).json({ message: 'No File Found' })
    const filePath = userFiles.path;
    const allDirs = fs.readdirSync(filePath)
    const allContents = [];
    for (const dir of allDirs) {
      const files = fs.readdirSync(path.join(filePath, dir))
      const filteredFiles = files.filter(file => file.toLowerCase().includes(req.params.fileName.toLowerCase()));
      filteredFiles.map(file => allContents.push(path.join(filePath, dir, file)));
    }
    if (allContents.length === 0) return res.status(400).json({ message: 'No File Found' })
    return res.status(200).json({ files: allContents });
  }

  static async getUserFile(req, res) {
    if (!(req.session.user.email === process.env.EMAIL)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { userEmail } = req.params;
    await File.find({ email: userEmail })
    .then((result) => res.status(200).send(result))
    .catch(() => res.status(400).json({ error: `Unable to fetch ${userEmail}'s files`}))
  }

  static async postFile(req, res) {
    // The issue here is that it appends same file to the folder
      return res.status(200).json({
        message: 'Successfully Uploaded',
        // file: req.file
      });
  }

  static async doctorsDepts(req, res) {
    const departments = [
      'Emergency Department (ED)',
      'Cardiology',
      'Oncology',
      'Pediatrics',
      'Orthopedics',
      'Radiology',
      'Neurology',
      'Gynecology and Obstetrics',
      'Gastroenterology',
      'Dentistry'
    ]
    return res.status(200).send(departments);
  }

}

module.exports = FilesController;
