import express, {Application} from "express"
import cors from "cors";
import dotenv from "dotenv"
import prisma from "./prisma"
import authRoutes from "./routes/auth"
import userRoutes from "./routes/user" 
import groupRoutes from "./routes/group"
import expenseRoutes from "./routes/expense"
import settlementsRoutes from "./routes/settlements"
import balanceRoutes from "./routes/balance"
import notifyRoutes from "./routes/notifications"

dotenv.config()

const app: Application = express()

app.use(cors());
app.use(express.json())

app.get("/health", (req,res) =>{
     
      // res.json({status:"ok", message: "server is runnig"});
  res.send("Hello from Express + TypeScript in health!");
      
})

app.get("/", (req, res) => {
  res.send("Hello from Express + TypeScript on render!");
});


// app.post("/test-user", async (req, res) => {
//   try {
//     const user = await prisma.user.create({
//       data: {
//         name: "Test User",
//         email: "test@example.com",
//         password: "hashedpassword123",
//       },
//     });
//     res.json(user);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// });


app.use("/api/auth", authRoutes)
app.use("/api/auth", userRoutes)
// app.use("/api/auth", authRoutes)
// app.use("/api/users", userRoutes)
app.use("/api/groups", groupRoutes)
app.use("/api/expense", expenseRoutes)
app.use("/api/settlements",settlementsRoutes)
app.use("/api/groups",balanceRoutes)
app.use("/api/notification",notifyRoutes)

export default app;