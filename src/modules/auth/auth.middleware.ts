import { appError } from "../../core/utils/appError.js";
import { catchAsync } from "../../core/utils/catchAsync.js";
import { clearCookie } from "../../core/utils/cookies.js";
import { Auth } from "../../model/auth.model.js";
import { JwtService } from "./jwt.service.js";

export class authMiddleware {
  static protectedRoute = catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token?.trim())
      return next(new appError("No token found, please Login to get access", 401, "INVALID_TOKEN"));
    const decoded = JwtService.verify(token, "access");
    if (!decoded) return next(new appError("Invalid or Expire token", 401, "INVALID_TOKEN"));

    const userdata = await Auth.findOne({ id: decoded.userId });
    if (!userdata) return next(new appError("User not found", 401, "NOT_FOUND"));

    if (userdata?.passwordChangeAt) {
      const passwordChange = Math.floor(new Date(userdata?.passwordChangeAt).getTime() / 1000);
      const issueDate = decoded.iat;

      if (passwordChange > issueDate) {
        clearCookie(res, "refreshToken");
        return next(new appError("Password Changed , login again", 403, "EXPIRED_TOKEN"));
      }
    }
    req.user = {
      ...req.user,
      id: userdata?.id,
    };

    next();
  });
}
