import mongoose from "mongoose";
import { schemaCleanOptions } from "../core/helper/mongooseCleaner";
interface AuthType extends Document {
  _id: string;
  email: string;
  passwordHash: string;
  passwordChangeAt: Date;
  role: "user" | "admin";
}
const authSchema = new mongoose.Schema<AuthType>(
  {
    email: {
      type: String,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    passwordChangeAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
    },
  },
  schemaCleanOptions,
);

export const Auth = mongoose.model<AuthType>("Auth", authSchema);
