import e from "express"
import { PrismaClient } from "../generated/prisma/index.js";

const router = e.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
    const users = await prisma.users.findMany();

    res.status(200).json(users);
});

export default router;