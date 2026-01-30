import { model, Schema } from "mongoose";

export interface IUser {
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

const User = model<IUser>("user", userSchema);

export default User;
