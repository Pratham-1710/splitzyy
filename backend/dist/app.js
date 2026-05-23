"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const group_1 = __importDefault(require("./routes/group"));
const expense_1 = __importDefault(require("./routes/expense"));
const settlements_1 = __importDefault(require("./routes/settlements"));
const balance_1 = __importDefault(require("./routes/balance"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "server is runnig" });
});
app.get("/", (req, res) => {
    res.send("Hello from Express + TypeScript on Vercel!");
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
app.use("/api/auth", auth_1.default);
app.use("/api/auth", user_1.default);
// app.use("/api/auth", authRoutes)
// app.use("/api/users", userRoutes)
app.use("/api/groups", group_1.default);
app.use("/api/expense", expense_1.default);
app.use("/api/settlements", settlements_1.default);
app.use("/api/groups", balance_1.default);
exports.default = app;
