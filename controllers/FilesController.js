const uuid = require('uuid');
const sha256 = require('js-sha256');
const fs = require('fs');
const mime = require('mime-types');
const path = require('path');
const { ObjectId } = require('express');
const dbClient = require('../utils/db');

class FilesController {
  static async login(req, res) {
    if (req.session.email) {
      return res.status(200).send('Successfully Login')
      return res.redirect('/index');
    }
    const { email, password } = req.body;
    console.log('email and password are:', email, password);
    if (!email) {
      return res.status(400).json({ error: 'Missing email' })
    }
    if (!password) {
      console.log('Point 3')
      return res.status(204).json({ error: 'No password provided'})
    }
    console.log('Point 4')
    const user = await dbClient.db.collection('users').findOne({
      email, password: sha256(password)
    })
    if (!user) {
      console.log('RETURN TO LOGIN PAGE')
      return res.status(401).json({ error: 'Unauthorized' });
      return res.redirect('/login');
    }
    req.session.email = email
    return res.status(200).send('Token Generated');
    return res.redirect('/index');
  }

  static async getAllFiles(req, res) {
    const files = await dbClient.db.collection('files').find().toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'No file found' });
    }
    return res.status(200).json(files);
  }

  static async getFile(req, res) {
    const { name } = req.params
    const file = await dbClient.db.collection('files').findOne({ name })
    if (!file) {
      return res.status(404).json({ error: 'File not Found' });
    }
    return res.status(200).json(file);
  }

  static async getMyDoctors(req, res) {
    const { email } = req.session;
    if (!email) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const user = await dbClient.db.collection('files').findOne({ email })
    const userDoctors = user.doctors.toArray();
    return res.status(400).send(userDoctors);
  }

  static async addDoctor(req, res) {
    const { doctors } = req.body;
    if (!doctor) {
      return res.status(401).json({ error: 'No Doctor is Selected' });
    }
    const { email } = req.session;
    if (!email) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    try {
      await dbClient.db.collection('files').updateMany({
        email,
        $push: { doctors }
      })
      return res.status(200).send('Succesfully Uploaded Doctors');
      return res.redirect('/index');
    } catch (err) {
      return res.status(500).json({ error: 'Server Error'})
    }
  }


  static async getUserFile(req, res) {
    if (!(req.session.email === 'adejare77@gmail.com')) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { userEmail } = req.params;
    const userFiles = await dbClient.db.collection('files').find({ email: userEmail }).toArray();
    return res.status(200).send(userFiles);
  }


  static async postFile(req, res) {
    if (!req.session.email) {
      return res.status(401).json({ error: 'Unauthorized'});
    }
    const user = await dbClient.db.collection('users').findOne({ email: req.session.email });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const file = req.file || req.params.data;
    if (!file) {
      return res.status(400).json({ error: 'No file/data Provided'})
    }

    const fileExtention = req.file ? file.originalname.split('.').pop() : file.split('.').pop();
    const mimeType = mime.lookup(fileExtention) || 'application/octet-stream';

    let folder = '';
    if (mimeType.startsWith('image/')) {
      folder = 'images';
    } else if (mimeType.startsWith('audio/')) {
      folder = 'audio';
    } else if (mimeType === 'application/pdf' || mimeType.startsWith('text/')) {
      folder = 'documents';
    } else {
      return res.status(400).json({ error: 'Unsupported file format' })
    }

    let userFile = await dbClient.db.collection('files').findOne({ userId: ObjectId(user._id) })
    // Checks if the user already has files or not
    if (!userFile) {
      const result = await dbClient.db.collection('files').insertOne({
        userId: ObjectId(user._id),
        path: uuid.v4()
      });
      // userFile = await dbClient.db.collection('files').findOne({ userId: ObjectId(result.insertedId) })
      userFile = { _id: result.insertedId, path: result.ops[0].path };
    }

    try {
      const fileName = req.file ? file.originalname : file;
      const filePath = path.join('/tmp', userFile.path, folder);
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(`${filePath}/${fileName}`, req.file ? req.file.buffer : Buffer.from(file, 'base64'));

      const updatedInfo = {
        'filename': fileName,
        'path': `/tmp/${userFile.path}/${folder}/${fileName}`,
        'mime-Type': mimeType
      }
      await dbClient.db.collection('files').updateOne(
        { _id: ObjectId(userFile._id) },
        { $push: { [folder]: updatedInfo } }
      );

      return res.status(200).send('File Successfully Uploaded');
    } catch(err) {
      return res.status(400).json({ error: 'Error Uploading File' })
    }
  }

}

module.exports = FilesController;