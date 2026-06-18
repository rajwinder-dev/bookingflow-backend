import { NextFunction, Request, Response } from "express";
import { devMode } from "../../config/appConfig";
export function globalHandler(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (devMode) console.log(error);
 
  res.status(error.statusCode || 500).json({
    status: error.status || "error",
    message: error.message,
    code: error.code,
    ...(error.data && { error: error.data }),
  });
}
