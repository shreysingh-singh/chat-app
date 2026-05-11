import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

interface TokenPayload {
  id: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const rawAuth = req.headers.authorization;
  const userToken = Array.isArray(rawAuth) ? rawAuth[0] : rawAuth;

  if (
    !userToken ||
    typeof userToken !== "string" ||
    !userToken.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      msg: `Authorization required`,
    });
  }

  const checkToken = userToken.split(" ")[1];

  if (!JWT_SECRET) {
    return res.status(500).json({ msg: `Server configuration error` });
  }

  try {
    const decodedRaw = jwt.verify(
      checkToken as string,
      JWT_SECRET as string,
    ) as unknown;

    if (
      !decodedRaw ||
      typeof decodedRaw !== "object" ||
      !("id" in decodedRaw)
    ) {
      return res.status(401).json({ msg: `Invalid Token` });
    }

    const payload = decodedRaw as TokenPayload;
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ msg: `Invalid or expired token` });
  }
};
