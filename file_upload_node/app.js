const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const fileRoutes = require('./routes/fileRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const connectDB = require('./config/db');


// Middleware to parse JSON bodies
app.use(express.json());

// mongoose.connect(process.env.MONGODB_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });


connectDB();

app.use('/api', fileRoutes);
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
