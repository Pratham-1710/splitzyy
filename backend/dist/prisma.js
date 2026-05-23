"use strict";
// import { PrismaClient } from "@prisma/client";
Object.defineProperty(exports, "__esModule", { value: true });
// declare global {
//   var prisma: PrismaClient | undefined;
// }
// const prisma = global.prisma || new PrismaClient();
// if (process.env.NODE_ENV !== "production") global.prisma = prisma;
// export default prisma;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.default = prisma;
