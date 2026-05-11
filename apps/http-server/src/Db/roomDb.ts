import mongoose, { model, Schema } from "mongoose";

const RoomSchema = new Schema({
  slug: {
    type: String,
    unique: true,
  },
  adminId: String,
});

export const RoomModel = model("Room", RoomSchema);
