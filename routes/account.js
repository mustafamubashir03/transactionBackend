const express = require("express");
const { authMiddleware } = require("../middleware");
const mongoose = require("mongoose");
const { UserAccount } = require("../db");
const accountRouter = express.Router();

accountRouter.get("/balance", authMiddleware, async (req, res) => {
  const id = req.userId;
  const accountFound = await UserAccount.findOne({ _id: id });
  if (!accountFound) {
    return res.status(503).json({ message: "You haven't signed up" });
  }
  res.json({ balance: accountFound.balance });
});

accountRouter.post("/transfer", authMiddleware, async (req, res) => {
  try {
    const session = await mongoose.startSession();
    await session.startTransaction();
    const to = req.query.to;
    const amount = Number(req.query.amount);
    const id = req.userId;
    const accountFound = await UserAccount.findOne({ _id: id }).session(
      session
    );
    const userBalance = accountFound.balance;
    if (userBalance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient balance" });
    }
    const recieverFound = await UserAccount.findOne({ _id: to }).session(
      session
    );
    if (!recieverFound) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Reciever not found" });
    }
    await UserAccount.updateOne(
      { _id: id },
      { $inc: { balance: -amount } }
    ).session(session);
    await UserAccount.updateOne(
      { _id: to },
      { $inc: { balance: +amount } }
    ).session(session);
    await session.commitTransaction();
    res.json({ message: "Transfer successful" });
  } catch (error) {
    console.log(error);
  }
});
module.exports = accountRouter;
