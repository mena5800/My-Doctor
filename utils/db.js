const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    //const uri = 'mongodb+srv://bass3fas:2581994@mydoctor.xwqpvzp.mongodb.net/?retryWrites=true&w=majority&appName=MyDoctor';
    const uri = 'mongodb://localhost'
    const DATABASE = 'MyDoctor'; // database name

    this.client = new MongoClient(uri);

    this.client.connect()
      .then(() => {
        this.db = this.client.db(DATABASE);
        console.log('Connected to MongoDB Atlas');
      })
      .catch((err) => console.log('Failed to Connect to DB', err));
  }

  isAlive() {
    return this.client.topology.isConnected();
  }

  async nbUsers() {
    const getAllUsers = await this.db.collection('users').countDocuments();
    return getAllUsers;
  }

  async nbFiles() {
    const getAllFiles = await this.db.collection('files').countDocuments();
    return getAllFiles;
  }
}

const dbClient = new DBClient();

module.exports = dbClient;
