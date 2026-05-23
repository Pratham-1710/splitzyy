"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await prisma_1.default.user.create({
            data: { name, email, password }
        });
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post("/login", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { email }
        });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ error: "JWT secret not configured" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, secret);
        res.json({ message: "Login successful", user, token });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
