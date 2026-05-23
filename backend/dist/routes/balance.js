"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../prisma"));
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.default)();
router.post("/:groupId/balances", auth_1.authMiddleware, async (req, res) => {
    const { groupId } = req.params;
    try {
        // all the expense in grroup
        const expenses = await prisma_1.default.expense.findMany({
            where: { groupId },
            include: { splits: true }
        });
        //   console.log(expenses);
        // record thing is used to make balances aaray proof keys will be string values will be numbers
        const balances = {};
        expenses.forEach((expense) => {
            // the one who pay get the amount
            balances[expense.paidById] = (balances[expense.paidById] || 0) + expense.amount;
            // they will pay to the one who payed for earlier so ther amount reduced
            expense.splits.forEach((split) => {
                balances[split.userId] = (balances[split.userId] || 0) - split.share;
            });
        });
        // find every member of group 
        const members = await prisma_1.default.groupMember.findMany({
            where: { groupId },
            include: { user: true },
        });
        // showing detail of every member
        const result = members.map((m) => ({
            userId: m.userId,
            name: m.user.name,
            balance: balances[m.userId] || 0,
        }));
        res.json(result);
    }
    catch (error) {
        console.error("Error fetching balances:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = router;
