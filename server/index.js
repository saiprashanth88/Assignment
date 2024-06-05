require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

const app = express();

// Database connection
connection();

// CORS options
const corsOptions = {
  origin: 'https://assignment-gic2.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Middleware to set additional headers and handle preflight requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://assignment-gic2.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');

  // Add any custom headers if necessary
  res.header('X-Custom-Header', 'your-value-here');

  // Handle preflight (OPTIONS) requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
