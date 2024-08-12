const express = require('express');
const http = require('http');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const userRoutes = require("./routes/user");
const messageRoutes = require('./routes/message'); // Import message routes

const setupSockets = require('./server/socket');
const connectDB = require('./config/db');
require('dotenv').config();
const app = express();
const server = http.createServer(app);

// Connect to MongoDB

connectDB()
app.use(express.json());
app.use(express.static('public'));

// Use routes
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/users', userRoutes);
app.use('/messages', messageRoutes); // Use message routes


// Setup Socket.io
setupSockets(server);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
