import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Request to include userId , we add userId for our conviniance


// export interface AuthRequest extends Request {
//   userId?: string;
// }

// cleaner version of above code now all request will have userId

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}


export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ error: "JWT secret not configured" });
  }

  try {
    // jwt.verify returns string | object, so we assert its type
    const decoded = jwt.verify(token, secret) as { userId: string };

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.userId = decoded.userId; // attach userId to request
    next(); // ✅ call next to proceed
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
