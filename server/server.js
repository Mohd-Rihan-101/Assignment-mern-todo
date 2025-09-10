// server/server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./db');
const tasksRoute = require('./routes/tasks');
const socketModule = require('./socket');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

// mount routes under /api
app.use('/api', tasksRoute);

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// init socket.io
const io = socketModule.init(server);

// ✅ Just call connectDB() (no need to pass URI manually)
connectDB()
  .then(() => {
    server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection failed', err);
  });
