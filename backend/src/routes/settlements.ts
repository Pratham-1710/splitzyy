import { Router } from "express";
import prisma from "../prisma";
import { authMiddleware } from "../middlewares/auth";

const router = Router();


router.post("/", authMiddleware, async (req, res) => {
  try {
    const { groupId, toId, amount } = req.body;

    // ✅ Step 1: Check sab fields diye gaye hai
    if (!groupId || !toId || !amount) {
      return res.status(400).json({ error: "groupId, toId and amount are required" });
    }

    // ✅ Step 2: Authenticated user ka ID lena
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // ✅ Step 3: Check dono users same group me hai
    const payer = await prisma.groupMember.findFirst({
      where: { groupId, userId: req.userId },
    });
    const receiver = await prisma.groupMember.findFirst({
      where: { groupId, userId: toId },
    });

    if (!payer || !receiver) {
      return res.status(400).json({ error: "Both users must be in the same group" });
    }

    // ✅ Step 4: Amount > 0 hona chahiye
    if (amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    // ✅ Step 5: Settlement save in DB
    const settlement = await prisma.settlement.create({
      data: {
        fromId: req.userId,
        toId,
        amount,
        groupId,
      },
    });

    res.status(201).json({
      message: "Settlement recorded successfully",
      settlement,
    });
  } catch (error: any) {
    console.error("Error creating settlement:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// gET settlement history for a group


router.get("/:groupId", authMiddleware, async (req, res) => {
  const { groupId } = req.params;

  try {
    // Validation
    if (!groupId) {
      return res.status(400).json({ error: "groupId is required" });
    }

    // Check if requesting user is part of the group
    const membership = await prisma.groupMember.findFirst({
      where: {
        groupId,
        userId: req.userId,
      },
    });

    if (!membership) {
      return res
        .status(403)
        .json({ error: "You must be a member of the group to view settlements" });
    }

    // Fetch settlements with payer & receiver info
    const settlements = await prisma.settlement.findMany({
      where: { groupId },
      include: {
        from: { select: { id: true, name: true } },
        to: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      message: "Settlement history fetched successfully",
      settlements,
    });
  } catch (error: any) {
    console.error("Error fetching settlement history:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});



export default router;
