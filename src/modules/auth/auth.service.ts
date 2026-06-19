import mongoose from "mongoose";
import { ChangePasswordInput, LoginInput, SignupInput } from "./auth.zod";
import { BcryptService } from "./bcrypt.service";
import { appError } from "../../core/utils/appError";
import { JwtService } from "./jwt.service";
import { TokenService } from "../token/token.service";
import { addMinutes } from "date-fns";
import { env } from "../../config/env";
import { Auth } from "../../model/auth.model";
export default class AuthService {
  static async signupUser({ password, email }: SignupInput) {
    const passwordHash = await BcryptService.hashPassword(password);
    // check if user exist in db or not
    //
    const conflicts = await Auth.find({ email });
    if (conflicts.length > 0)
      throw new appError(
        `${conflicts.join(" & ")} alredy Exist`,
        409,
        "CONFLICT_ERROR",
      );
    const data = await Auth.create({ email, passwordHash, role: "user" });

    return data.toJSON();
  }
  static async loginUser({ email, password }: LoginInput) {
    const userData = await Auth.findOne({ email });
    if (!userData) throw new appError("User not found ", 404, "NOT_FOUND");
    const verify = await BcryptService.verifyPassword(
      password,
      userData.passwordHash,
    );
    if (!verify)
      throw new appError(
        "Password or email is invalid",
        401,
        "INVALID_CREDENTIALS",
      );
    const accessToken = JwtService.sign(
      { userId: userData.id, email },
      "access",
    );
    const refreshToken = JwtService.sign(
      { userId: userData.id, email },
      "refresh",
    );
    return { accessToken, refreshToken, userData };
  }
  static async getRefreshToken(token: string) {
    const decoded = JwtService.verify(token, "refresh");

    if (!decoded)
      throw new appError("Invalid or Expire token", 401, "EXPIRED_TOKEN");
    const newAccessToken = JwtService.sign(
      { userId: decoded.userId, email: decoded.email },
      "access",
    );
    return newAccessToken;
  }
  static async changePassword(userId: string, input: ChangePasswordInput) {
    const userData = await Auth.findOne({ id: userId });
    if (!userData) throw new appError("User do not exist", 404, "NOT_FOUND");
    const verify = await BcryptService.verifyPassword(
      input.currentPassword,
      userData.passwordHash,
    );
    if (!verify)
      throw new appError(
        "Current password invalid, try again!",
        400,
        "INVALID_CREDENTIALS",
      );

    const hash = await BcryptService.hashPassword(input.password);
    const data = await mongoose
      .model("Auth")
      .updateOne({ id: userId }, { passwordHash: hash });

    return data;
  }
  static async getAuthDetails(userId: string) {
    const userData = await Auth.findOne({ _id: userId }, { passwordHash: 0 });
    
    return userData?.toJSON();
  }
  static async forgetPassword(email: string) {
    const user = await Auth.findOne({ email });
    if (!user) throw new appError("Email not Exist", 404, "NOT_FOUND");
    const { token } = await TokenService.createToken({
      input: {
        email,
        type: "PASSWORD_RESET",
        userId: user.id,
        createdBy: user.id,
      },
      expiresAt: addMinutes(new Date(), 10),
    });
    const forgetURl = `${env.coreUrl}/reset-password/${token}`;
    return { user, forgetURl };
  }
  //todo: add reset passowrd logic later
  static async resetPassword({
    passwordResetToken,
    password,
  }: {
    passwordResetToken: string;
    password: string;
  }) {
    const token = await TokenService.verifyToken(passwordResetToken);
    if (!token?.userId)
      throw new appError(
        "Password reset link Invalid or Expire",
        400,
        "INVALID_TOKEN",
      );
    const passwordHash = await BcryptService.hashPassword(password);
    await Auth.updateOne({ id: token.userId }, { passwordHash });
    const data = await Auth.findOne({ id: token.userId });
    await TokenService.updateTokenStatus(passwordResetToken, "USED");
  return data;
  }
}
