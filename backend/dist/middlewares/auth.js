"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
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
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ error: "Invalid token" });
        }
        req.userId = decoded.userId; // attach userId to request
        next(); // ✅ call next to proceed
    }
    catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
}
