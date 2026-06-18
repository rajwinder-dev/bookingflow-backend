import mongoose from "mongoose";
interface AuthType extends Document {
  _id: string;
  email: string;
  passwordHash: string;
  passwordChangeAt: Date;
  role: string;
}
const authSchema = new mongoose.Schema<AuthType>({
  _id: mongoose.Schema.Types.ObjectId,
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
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    required: true,
  },
});

export const Auth = mongoose.model<AuthType>("Auth", authSchema);
