import { NextFunction, Request, Response } from "express";
import { validate } from "../service/apiKey.service";

export const apiKeyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = (req.headers["x-api-key"] as string) ?? "";

  if (!apiKey) {
    res.status(401).json({
      message: "API KEY header is required!",
    });
    return;
  }

  if (!(await validate(apiKey))) {
    res.status(403).json({
      message: "API KEY is not valid!",
    });
    return;
  }

  next();
};
