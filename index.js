const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;


// middleware
app.use(cors({
    origin: [
      "http://localhost:5173",
      "https://tech-hive-d9f7e.web.app",
      "https://tech-hive-d9f7e.firebaseapp.com",
    ]
  }));
  app.use(express.json());

  