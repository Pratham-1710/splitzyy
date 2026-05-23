"use strict";
// import app from "./app";
// import serverless from "serverless-http";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// export default serverless(app);
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 5000;
// for it to be worked on vercel
app_1.default.listen(PORT, () => {
    console.log(` Server is running at port no ${PORT}`);
});
