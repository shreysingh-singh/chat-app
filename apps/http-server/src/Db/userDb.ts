import mongoose, { model, Schema } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, unique: true, require: true },
  password: { type: String, require: true },
  firstName: { type: String },
  lastName: { type: String },
});

export const UserModel = model("User", UserSchema);
