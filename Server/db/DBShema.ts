import { Schema, model } from "mongoose";

//Collections => User, Group, Chat

const UserSchmea = new Schema({
  username: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
});
const User = model("user", UserSchmea);

export { User };
