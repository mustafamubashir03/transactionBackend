const express = require("express");
const { join } = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const mainRouter = require("./routes/index.js");


const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(cors({ origin: "https://transaction-frontend-xfdj.vercel.app" }));
app.use(express.json());
app.use("/api/v1", mainRouter);


app.listen(PORT, "0.0.0.0", () => {
  console.log("Server has been started");
});
