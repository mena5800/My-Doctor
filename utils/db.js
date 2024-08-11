const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const HOST = process.env.HOST || 'localhost';
    const PORT = process.env.PORT || 27017;
    // const DATABASE = process.env.DATABASE || 'myDoctor';
    const DATABASE = 'myDoctor';
    const url = `mongodb://${HOST}:${PORT}`

    this.client = new MongoClient(url);

      this.client.connect()
      .then(() => {
        this.db = this.client.db(DATABASE);
        // console.log('Connected to DB');
      })
      .catch(() => console.log('Failed to Connect to DB'));
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
