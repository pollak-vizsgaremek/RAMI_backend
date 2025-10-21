import e from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { PrismaClient } from "./generated/prisma/index.js";
import jwt from "jsonwebtoken";
import userController from "./controller/user.controller.js";
import authMiddleware from "./middleware/auth.middleware.js";

const app = e();
const prisma = new PrismaClient();

app.use(e.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/api/v1/users", authMiddleware, userController);

app.post("/api/v1/auth/register", async (req, res) => {
  const { username, password, password2, email, fullName } = req.body;

  if (!username || !password || !password2 || !email || !fullName)
    return res.status(400).send("Required!");

  if (password !== password2)
    return res.status(400).send("Passwords are not matching!");

  const hashedPwd = await bcrypt.hash(password, 12);

  await prisma.users.create({
    data: {
      username,
      email,
      fullName,
      password: hashedPwd,
    },
  });

  res.status(201).send("Success!");
});

app.post("/api/v1/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).send("Required!");

  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (await bcrypt.compare(password, user.password)) {

    const accessToken = jwt.sign(
      {
      email: user.email,
      name: user.fullName,
      }, 
      "secret", 
      {
        algorithm: "HS512",
        expiresIn: "15m",
        issuer: "http://localhost:3300",
        subject: user.id
      }
    );


    return res.status(200).json(
      {
        accessToken,
        userId: user.id,
      }
  );
  } else {
    return res.status(400).send("Invalid email or password!");
  }
});

app.listen(3300, () => {
  console.log("Elindult a http://localhost:3300");
});
