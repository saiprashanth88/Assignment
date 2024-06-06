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
  origin: ['https://assignment-gic2.vercel.app/login'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin','x-auth-token'],
  credentials: true,
  crossOriginIsolated: true,


  optionsSuccessStatus: 200 // For legacy browser support
};

// Use CORS middleware with defined options
app.use(cors(corsOptions));
// app.use(cors());
// Middleware to set additional headers and handle preflight requests
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');


//   res.header('X-Custom-Header', '<!doctype html>');

//   if (req.method === 'OPTIONS') {
//     return res.sendStatus(200);
//   }

//   next();
// });

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
