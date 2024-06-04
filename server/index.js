require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

// database connection
connection();

// middlewares
app.use(express.json());
// app.use(cors(
//     {
//         origin: ["https://assignment-gic2.vercel.app/"],
//         methods: ["POST","GET"],
//         credentials: true

//     }
// ));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://assignment-gic2.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

const port = process.env.PORT || 4000;
app.listen(port, console.log(`Listening on port ${port}...`));
