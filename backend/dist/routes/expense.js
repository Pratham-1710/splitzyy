"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../prisma"));
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post("/", auth_1.authMiddleware, async (req, res) => {
    try {
        const { groupId, description, amount, splits } = req.body;
        if (!groupId || !description || !amount) {
            return res.status(400).json({
                error: "groupId,description, amount and splits are required",
            });
        }
        if (!req.userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        //check if user is part of group or not
        const membership = await prisma_1.default.groupMember.findFirst({
            where: {
                groupId,
                userId: req.userId
            }
        });
        if (!membership)
            return res.status(400).json({ error: "You are not a member of this group" });
        //expense bna liya ki is  bande ne kitna pay kiya 
        const expense = await prisma_1.default.expense.create({
            data: {
                description,
                amount,
                paidById: req.userId,
                groupId
            },
        });
        // this if handel custom split tell to split between which members
        if (splits && splits.length > 0) {
            // we use creatmany cause har bande ke liye banana padega jo bhi group m ki vo kitna pay karega
            await prisma_1.default.split.createMany({
                data: splits.map((s) => ({
                    expenseId: expense.id,
                    userId: s.userId,
                    share: s.share
                }))
            });
        }
        // for share equally between every one
        else {
            const members = await prisma_1.default.groupMember.findMany({
                where: { groupId },
            });
            console.log(typeof (amount));
            // share equally
            const share = amount / members.length;
            await prisma_1.default.split.createMany({
                data: members.map((m) => ({
                    expenseId: expense.id,
                    userId: m.userId,
                    share,
                })),
            });
        }
        // 5. Respond with success
        res.status(201).json({
            message: "Expense created successfully",
            expense,
        });
    }
    catch (error) {
        console.error("Error creating expense:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = router;
