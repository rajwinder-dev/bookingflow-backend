import crypto from "crypto";
import { TokenDataInput } from "./token.types.js";
import { Token } from "../../model/token.model.js";

export class TokenService {
  static createToken = async ({
    input,
    expiresAt,
  }: {
    input: TokenDataInput;
    expiresAt: Date;
  }) => {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const token = crypto.createHash("sha256").update(resetToken).digest("hex");

    await Token.updateMany(
      {
        type: input.type,
        status: "PENDING",
        email: input.email,
      },
      {
        $set: { status: "REVOKED" },
      },
    );

    return await Token.create({
      ...input,
      token,
      expiresAt,
    });
  };

  static verifyToken = async (token: string) => {
    const currentDate = new Date();

    const tokenData = await Token.findOne({
      token,
      status: "PENDING",
      expiresAt: { $gt: currentDate },
    }).sort({ createdAt: -1 }); // -1 maps to DESC sorting

    return tokenData;
  };

  static updateTokenStatus = async (token: string, status: string) => {
    return await Token.findOneAndUpdate(
      { token },
      { $set: { status } },
      { new: true },
    );
  };
}
