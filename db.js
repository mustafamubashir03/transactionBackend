const mongoose = require("mongoose");
require("dotenv").config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("DB has been connected"));

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: { type: String, unique: true },
  password: { type: String, unique: true, minLength: 3 },
});

const accountSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

const UserAccount = mongoose.model("UserAccount", accountSchema);

const User = mongoose.model("User", userSchema);
module.exports = {
  User,
  UserAccount,
};
