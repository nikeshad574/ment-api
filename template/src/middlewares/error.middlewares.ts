import { Request, Response, NextFunction } from "express";
import {
  FileReq,
  removeUnusedMulterImageFilesOnError,
} from "../utils/commonUtils";

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  //   if (err.name === "LoginError") {
  //     return res.redirect(`${conf.frontEndUrl}/login?errMsg=${err.message}`);
  //   }

  removeUnusedMulterImageFilesOnError(req as FileReq);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};
