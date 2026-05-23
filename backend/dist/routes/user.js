"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../prisma"));
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// import AuthRequest for using req.userId cause we made it in AuthRequest
router.get("/me", auth_1.authMiddleware, async (req, res) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: req.userId },
            //so we dont send passwor dof user too
            select: { id: true, name: true, email: true }
        });
        if (!user) {
            // If user is not found
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        // Catch any unexpected errors
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// finding all the users
router.get("/", auth_1.authMiddleware, async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            // using select for not taking password too from db
            select: { id: true, name: true, email: true }
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// update your details
router.put("/me", auth_1.authMiddleware, async (req, res) => {
    const { name, email } = req.body;
    // now these lines give ability to change what you want whether email or name
    const data = {};
    if (name) {
        data.name = name;
    }
    if (email) {
        data.email = email;
    }
    if (Object.keys(data).length === 0) {
        // If no fields are provided
        return res.status(400).json({ error: "Please provide name or email to update" });
    }
    try {
        const updatedUser = await prisma_1.default.user.update({
            where: { id: req.userId },
            // its forcing to change both names and email what if you want to change one only
            ////// data:{name,email},
            // this is data variable created by us
            data,
            select: { id: true, name: true, email: true }
        });
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = router;
