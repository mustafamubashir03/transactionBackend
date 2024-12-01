const { authMiddleware } = require("../middleware.js");
const JWT_SECRET = process.env.JWT_SECRET;
const express = require("express");
const userRouter = express.Router();
const { User, UserAccount } = require("../db.js");
const { userSchema, logInSchema } = require("../zod.validation");
const { userUpdateSchema } = require("../zod.validation.js");
const jwt = require("jsonwebtoken");


userRouter.get("/verify",authMiddleware, async(req,res)=>{
    if (req.userId) {
      const user = await User.findOne({_id:req.userId})
      if(user){
        return res.json({status:true})
      }
    }
})


userRouter.post("/signup", async (req, res) => {
  try {
    const userInfo = req.body;
    console.log(userInfo);
    const { success } = userSchema.safeParse(userInfo);
    if (!success) {
      return res
        .status(500)
        .json({ message: "Couldn't authenticate...Invalid format" });
    } else {
      const newUser = await User.create(userInfo);
      await UserAccount.create({
        _id: newUser._id,
        balance: balanceGenerator(),
      });
      res.json({ msg: "user has been created" });
    }
  } catch (error) {
    res.status(403).json({ message: "Account already exists" });
  }
});

userRouter.post("/signin", async (req, res) => {
  const userInfo = req.body;
  const { success } = logInSchema.safeParse(userInfo);
  if (!success) {
    return res
      .status(500)
      .json({ message: "Couldn't authenticate...Invalid format" });
  }
  const userFound = await User.findOne({ username: userInfo.username });
  if (!userFound) {
    return res.status(500).json({ message: "User not found" });
  }
  const token = await jwt.sign({ userId: userFound._id }, JWT_SECRET);
  res.json({ msg: "Successfully authenticated", token: token });
});

userRouter.put("/", authMiddleware, async (req, res) => {
  const id = req.userId;
  const userBody = req.body;
  const updatedDoc = {};
  if (id !== userBody._id) {
    return res
      .status(403)
      .json({ message: "You are not authorized to update this user" }); // Update only for the authenticated user's data.
  }
  const { success } = userUpdateSchema.safeParse(userBody);
  if (!success) {
    return res.status(403).json({ message: "Invalid input" });
  }
  if (userBody.firstName) {
    updatedDoc.firstName = userBody.firstName;
  }
  if (userBody.lastName) {
    updatedDoc.lastName = userBody.lastName;
  }
  if (userBody.password) {
    updatedDoc.password = userBody.password;
  }

  const newDoc = await User.findByIdAndUpdate(
    id,
    { $set: updatedDoc },
    { new: true, runValidators: true }
  );
  if (!newDoc) {
    return res.status(403).json({ message: "User not found" });
  }
  res.json({ message: "Updated successfully", newDoc });
});

function balanceGenerator() {
  return Math.round(Math.random() * 10000) + 1;
}
userRouter.get("/bulk",authMiddleware, async (req, res) => {
  const filter = req.query.filter || "";
  const id = req.userId;
  const regex = new RegExp(filter, "i");
  const query = {
    $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    _id: { $ne: id },
  };
  const usersFound = await User.find(query);
  res.json({
    user: usersFound.map((user) => ({
      id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    })),
  });
});

userRouter.get("/me",authMiddleware, async (req, res) => {
  const userId = req.userId;
  const userFound = await User.findOne({ _id: userId });
  if (!userFound) {
    return res.status(403).json({ message: "User not found" });
  }
  const { password, ...otherInfo } = userFound._doc;
  res.json(otherInfo);
});

module.exports = userRouter;
