const express = require("express");
const { join } = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const mainRouter = require("./routes/index.js");


const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();


const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://transaction-frontend-4rez.vercel.app' // Deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());
app.use("/api/v1", mainRouter);


app.listen(PORT, "0.0.0.0", () => {
  console.log("Server has been started");
});
