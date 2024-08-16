const uuid = require('uuid');
const sha256 = require('js-sha256');
const fs = require('fs');
const mime = require('mime-types');
const path = require('path');
const { ObjectId } = require('mongodb');
const dbClient = require('../utils/db');

class FilesController {
  static async getLoginForm(req, res) {
    return res.render('../loginForm')
  }

  static async login(req, res) {
    if (req.session.email) {
      return res.status(200).send('Successfully Login')
      // return res.redirect('/index');
    }
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing email' })
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password'})
    }
    let user = await dbClient.db.collection('users').findOne({
      email, password: sha256(password)
    })
    if (!user) {
      user = await dbClient.db.collection('doctors').findOne({
        email, password: sha256(password)
      })
    }
    if (!user) {
      console.log('RETURN TO LOGIN PAGE')
      return res.status(401).json({ error: 'Unauthorized' });
      // return res.redirect('/login');
    }
    req.session.email = email
    return res.status(200).send('Token Generated');
    // return res.redirect('/index');
  }

  static async getAllUserFiles(req, res) {
    const files = await dbClient.db.collection('files').find({ email: req.session.email }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'No file found' });
    }
    return res.status(200).json(files);
  }

  static async getFile(req, res) {
    const { name } = req.params
    // find the file document in the collection
    const file = await dbClient.db.collection('files').findOne({ 'documents.filename': name })
    if (!file) {
      return res.status(404).json({ error: 'File not Found' });
    }

    const readStream = fs.createReadStream(file.documents[0].path);
    let data = ''; // Initialize data variable

    // Handle file reading events
    readStream.on('data', (chunk) => {
      data += chunk
    });

    readStream.on('end', () => {
      res.status(200).send(data);
    });

    readStream.on('error', (err) => {
      console.error('Error occurred:', err);
      return res.status(400).json({ error: 'Error reading file ${file.documents.filename'})
    })

    // return res.status(200).json(file);
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

    const file = req.file || (Object.keys(req.body).length > 0 ? req.body : null);
    if (!file) {
      return res.status(400).json({ error: 'No file/data Provided'})
    }
    if (!req.file) {
      if (!req.body.name) {
        return res.status(400).json({ error: 'Please Provide data "name"' });
      } else if (!req.body.data) {
        return res.status(400).json({ error: 'Please Provide the data "data"' });
      }
    }
    const fileExtention = req.file ? file.originalname.split('.').pop() : file.name.split('.').pop();
    const mimeType = mime.lookup(fileExtention) || 'application/octet-stream';

    let folder = '';
    if (mimeType.startsWith('image/')) {
      folder = 'images';
    } else if (mimeType.startsWith('audio/')) {
      folder = 'audio';
    } else if (mimeType === 'application/pdf' || mimeType.startsWith('text/')) {
      folder = 'documents';
    } else if (file.body.name && file.body.data) {
      folder = "others";
    } else {
      return res.status(400).json({ error: 'Unsupported file format' })
    }
    let userFile = await dbClient.db.collection('files').findOne({ userId: new ObjectId(user._id) })

    // Checks if the user already has files or not
    if (!userFile) {
      const uniquePath = uuid.v4();
      const result = await dbClient.db.collection('files').insertOne({
        userId: new ObjectId(user._id),
        path: uniquePath
      });
      userFile = { _id: result.insertedId, path: uniquePath };
    }

    try {
      const fileName = req.file ? file.originalname : file.name;
      const filePath = path.join('/tmp', userFile.path, folder);
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      const writeStream = fs.createWriteStream(path.join(filePath, fileName));
      // if req.file exists, create a readable stream from the buffer
      if (!req.file) {
        const base64Buffer = Buffer.from(file.data, 'base64');
        writeStream.write(base64Buffer);
      }
      writeStream.end();

      writeStream.on('finish', () => {
        console.log('File Uploaded Successfully to the Path');
      });

      writeStream.on('error', (err) => {
        console.log('Error Uploading File in Path:', err);
        throw new Error('Error uploading file in Path')
      })
      // fs.writeFileSync(`${filePath}/${fileName}`, req.file ? req.file.buffer : Buffer.from(file.data, 'base64'));

      const updatedInfo = {
        'filename': fileName,
        'path': `/tmp/${userFile.path}/${folder}/${fileName}`,
        'mimeType': mimeType
      }

      await dbClient.db.collection('files').updateOne(
        { _id: new ObjectId(userFile._id) },
        { $push: { [folder]: updatedInfo } }
      );

      return res.status(200).send('File Successfully Uploaded');
    } catch(err) {
      // return res.status(400).json({ error: 'Error Uploading File' })
      return res.status(400).json({ error: err })
    }
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
