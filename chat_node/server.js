const express = require('express');
const http = require('http');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const userRoutes = require("./routes/user");
const messageRoutes = require('./routes/message'); // Import message routes
const cors = require('cors'); // Import cors

const {initializeSocket} = require('./server/socket');
const connectDB = require('./config/db');
const path = require('path');
const {Server} = require("socket.io")
require('dotenv').config();


const app = express();

// Connect to MongoDB
connectDB()

// app.use(cors());
app.use(express.json());


// Use routes
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/users', userRoutes);
app.use('/messages', messageRoutes); // Use message routes


const server = http.createServer(app);
// Setup Socket.io
// Initialize Socket.io with CORS options
// const io = new Server(server, {
// 	cors: {
// 		origin: ["http://localhost:3000"],
// 		methods: ["GET", "POST"],
// 	},
// });
initializeSocket(server);
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// app.get("", (req, res) => {
// 	console.log(1)
// 	res.sendFile(path.join(__dirname, "public", "index.html"));
// });

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
