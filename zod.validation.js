const z = require("zod");
const userSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string().email(),
  password: z.string(),
});

const logInSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});

const userUpdateSchema = z.object({
  firstName: z.string().max(15).optional(),
  lastName: z.string().max(15).optional(),
  password: z.string().max(15).optional(),
});

const transferSchema = z.object({
  to: z.string(),
  amount: z.number(),
});
module.exports = { userSchema, userUpdateSchema, logInSchema, transferSchema };
