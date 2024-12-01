const express = require("express");

const accountRouter = require("./account.js");
const userRouter = require("./user.js");
const mainRouter = express.Router();

mainRouter.use("/user", userRouter);
mainRouter.use("/account", accountRouter);

module.exports = mainRouter;
