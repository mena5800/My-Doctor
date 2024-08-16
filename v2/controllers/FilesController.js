const uuid = require('uuid');
const sha256 = require('js-sha256');
const fs = require('fs');
const mime = require('mime-types')
const path = require('path');
const { ObjectId } = require('mongodb')
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
    let user = await User.find({ email, password: sha256(password) })
    if (!user) {
      user = await Doctor.find({ email, password: sha256(password) })
    }
    if (!user) {
      // redirect to this login page
      return res.status(401).json({ error: 'Email or Password Incorrect' });
    }
    req.session.email = email
    return res.status(200).send('Successfully login. Token Generated')
  }

  static async getAllUserFiles(req, res) {
    await File.find({ email: req.session.email })
    .then ((files) => res.status(200).send(files))
    .catch(() => res.status(500).json({ error: 'Internal Error' }))
  }

  static async getFile(req, res) {
    const { fileName } = req.params
    const user = await User.findOne({ email: req.session.email });
    const userId = user.id

    let filePath = '';
    const file = await File.findOne({ userId })
    if (file.documents.some(doc => doc.fileName === fileName)) {
      filePath = file.documents[0].path;
    } else if (file.images.some(image => image.fileName === fileName)) {
      filePath = file.images[0].path
    } else if (file.audios.some(audio => audio.fileName === fileName)) {
      filePath = file.audios[0].path
    } else if (file.others.some(other => other.fileName === fileName)) {
      filePath = file.others[0].path
    }
    if (!filePath) {
      return res.status(404).json({ error: 'File not Found' });
    }

    // Read File
    const readStream = fs.createReadStream(filePath);
    let data = '';

    // Handle file reading events listener
    readStream.on('data', (chunk) => {
      data += chunk
    });

    readStream.on('end', () => {
      return res.status(200).send(data);
    });

    readStream.on('error', () => {
      return res.status(400).json({ error: 'Error reading file' })
    })
  }
}

module.exports = FilesController;
