import express from "express";
import cors from "cors";
import { createServer } from "http";
import { config } from "dotenv";
import { sign } from "jsonwebtoken";
import z from "zod";
import { Server } from "socket.io";
import { connect } from "mongoose";
import { User } from "./db/DBShema";

const app = express();
config();
const port = process.env.PORT;
const JWTSecurityKey = "KEY";

app.use(cors());
app.use(express.json());
const httpServer = createServer(app);
const io = new Server(httpServer);

const LoginSchema = z.object({
  username: z.string().max(15),
  password: z.string().min(6),
});
const SignupSchema = z.object({
  username: z.string().max(15),
  email: z.string().email(),
  password: z.string().min(6),
});
type Login = z.infer<typeof LoginSchema>;
type Signup = z.infer<typeof SignupSchema>;

app.post("/login", async (req: { body: Login }, res: any) => {
  const userLogin = {
    username: req.body.username,
    password: req.body.password,
  };
  const result = LoginSchema.safeParse(userLogin);
  if (!result.success) {
    res.json({ success: false, message: "User credientials are wrong" });
    return;
  }
  // check in DB if user already exists
  const user: Signup | null = await User.findOne({
    username: userLogin.username,
  });
  if (user) {
    // if exists...
    if (!(user.password === userLogin.password)) {
      res.json({ success: false, message: "Password is incorrect" });
      return;
    }
    const token = sign(userLogin, JWTSecurityKey);
    res.json({ success: true, token: token });
    return;
  }
  // if not exists...
  res.json({ success: false, message: "User not found" });
});
app.post("/signup", async (req: { body: Signup }, res) => {
  const userSignup = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };
  const result = SignupSchema.safeParse(userSignup);
  if (!result.success) {
    res.json({ success: false, messages: "User credientials are wrong" });
    return;
  }
  // check in DB is user already exists
  const user = await User.findOne({ username: userSignup.username });
  if (user) {
    // if exists...
    res.json({ success: false, message: "User already exists" });
    return;
  }
  // if not exists...
  const newUser = new User(userSignup);
  await newUser.save();
  const JWTSignup = {
    username: userSignup.username,
    password: userSignup.password,
  };
  const token = sign(JWTSignup, JWTSecurityKey);
  res.json({ success: true, token: token });
});

httpServer.listen(port, () => {
  console.log("Server running on PORT: " + port);
});

if (process.env.MONGODB_URL) {
  connect(process.env.MONGODB_URL);
  console.log("DB connected");
} else {
  console.log("DB URL is undefined");
}
