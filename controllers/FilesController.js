const uuid = require('uuid');
const sha256 = require('js-sha256');
const fs = require('fs');
const mime = require('mime-types')
const path = require('path');
const mongoose = require('mongoose')
const { File, User, Doctor } = require('./Schema')

class FilesController {

  static async getAllUserFiles(req, res) {
    await File.find({ email: req.session.user.email })
    .then ((files) => res.status(200).send(files))
    .catch(() => res.status(500).json({ error: 'Internal Error' }))
  }

  static async getFile(req, res) {
    const { fileName } = req.params
    const user = await User.findOne({ email: req.session.user.email });
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

  static async getUserFile(req, res) {
    if (!(req.session.user.email === process.env.EMAIL)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { userEmail } = req.params;
    await File.find({ email: userEmail })
    .then((result) => res.status(200).send(result))
    .catch((err) => res.status(400).json({ error: `Unable to fetch ${userEmail}'s files`}))
  }

  static async postFile(req, res) {
    // The issue here is that it appends same file to the folder
    if (req.file) {
      return res.status(200).json({
        message: 'Successfully Uploaded',
        file: req.file
      });
    }
    const { fileName, data } = req.body;
    if (!fileName || !data ) {
      return res.status(400).json({ error: 'fileName or data or both are missing' })
    }

    const fileExtension = fileName.split('.').pop();
    const mimeType = mime.lookup(fileExtension) || 'application/octet-stream';

    let folder = '';
    if (mimeType.startsWith('image/')) {
      folder = 'images';
    } else if (mimeType.startsWith('audio/')) {
      folder = 'audio';
    } else if (mimeType === 'application/pdf' || mimeType.startsWith('text/')) {
      folder = 'documents';
    } else {
      folder = 'others';
    }

    let userFile = await File.findOne({ userId: req.session.user.userId })
    if (!userFile) {
      userFile = new File({userId: new mongoose.Types.ObjectId(req.session.user.userId) })
      await userFile.save()
      .catch((err) => res.status(500).json({ error: `Error Creating a new user File:${err}` }));
    }
    const filePath = path.join('/tmp', userFile.path, folder);

    if(!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
    const writeStream = fs.createWriteStream(path.join(filePath, fileName));
    const base64Buffer = Buffer.from(data, 'base64')
    writeStream.write(base64Buffer);
    writeStream.end();
    writeStream.on('finish', () => {
      console.log('File Uploaded Successfully to the Path')
    });

    const updateInfo = {
      'fileName': fileName,
      'path': path.join('/tmp', userFile.path, folder, fileName),
      'mimeType': mimeType
    }

    await File.updateOne(
      { userId: new mongoose.Types.ObjectId(req.session.user.userId) },
      { $push: { [folder]: updateInfo } }
    )
    .then((result) => res.status(200).send('Successfully Uploaded file'))
    .catch(() => res.status(200).json({ error: 'Error Uploading File into DB' }));
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
