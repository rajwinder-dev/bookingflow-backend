import mongoose, { Schema, Document, Types } from "mongoose";

export type TokenType = "PASSWORD_RESET" | "VERIFICATION";
export type TokenStatus = "PENDING" | "ACCEPTED" | "EXPIRED";

export interface IToken {
  email: string;
  token: string;
  type: TokenType;
  status: TokenStatus;
  expiresAt: Date;
  acceptedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  userId: Types.ObjectId;
}

export interface ITokenDocument extends IToken, Document {}

const TokenSchema = new Schema<ITokenDocument>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["PASSWORD_RESET", "VERIFICATION"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "EXPIRED"],
      default: "PENDING",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    }
  },
  {
    timestamps: true,
  },
);

// ==========================================
// 3. MODEL EXPORT
// ==========================================
export const Token = mongoose.model<ITokenDocument>("Token", TokenSchema);
