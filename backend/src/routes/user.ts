import { Router } from "express";
import prisma from "../prisma";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// import AuthRequest for using req.userId cause we made it in AuthRequest
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      //so we dont send passwor dof user too
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      // If user is not found
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error: any) {
    // Catch any unexpected errors
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// finding all the users
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      // using select for not taking password too from db
      select: { id: true, name: true, email: true }
    });

    res.status(200).json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// update your details
router.put("/me", authMiddleware, async (req, res) => {
  const { name, email } = req.body;

  // now these lines give ability to change what you want whether email or name
  const data: any = {};

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
    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      // its forcing to change both names and email what if you want to change one only

      ////// data:{name,email},

      // this is data variable created by us
      data,
      select: { id: true, name: true, email: true }
    });

    res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
