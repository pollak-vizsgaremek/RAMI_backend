// Server imports
import e from "express";
import dotenv from "dotenv";
import cors from "cors";

// Controller imports
//import licencePlateController from "./controller/licencePlateData.controller";

//service imports
import { getall_User } from "./service/User_Data.service";
import {create_User} from "./service/User_Data.service";
import { loginUser } from "./service/auth.service";

//import entryController from "./controller/licencePlateEntry.controller";
import { connectDatabase } from "./service/dbConnection.service";
import { register, login } from "./controller/auth.controller";

// Middleware imports
//import { apiKeyMiddleware } from "./middleware/apiKey.middleware";

dotenv.config();
const PORT = process.env.PORT;
const app = e();

app.use(cors({
  origin: 'http://localhost:5173', // vagy ahol a frontend fut
  credentials: true
}));
app.use(e.json());

//app.use("/api/v1/licencePlate", apiKeyMiddleware, licencePlateController);

connectDatabase().then(() => {
  const db = connectDatabase();
  console.log("Sikeresen csatlakoztunk az adatbázishoz!");
}).catch((error) => {
  console.error("Hiba az adatbázishoz való csatlakozáskor:", error);
  process.exit(1); // Kilépés hiba esetén
});

app.get("/api/users", async (req, res) => {
  try {

    const users = await getall_User();
    res.status(200).json(users);
  } catch (error) {
    console.error("Hiba a felhasználók lekérésekor:", error);
    res.status(500).json({ message: "Hiba történt a felhasználók lekérésekor." });
  }
  
});

app.post("/api/auth/register", async (req, res) => {
  try {
    console.log("Regisztrációs adatok:", req.body);
    await create_User(req.body);
    res.status(201).json({ message: "Felhasználó sikeresen létrehozva." });
  } catch (error) {
    console.error("Hiba a felhasználó létrehozásakor:", error);
    res.status(500).json({ message: "Hiba történt a felhasználó létrehozásakor." });
  }
});

app.get("/api/login", async (req, res) => {
  try {
    const { nev, jelszo } = req.body;
    await loginUser(nev, jelszo);
    res.status(200);
  } catch (error) {
    console.error("Hiba a bejelentkezéskor:", error);
    res.status(401).json({ message: "Hibás felhasználónév vagy jelszó." });
  }
});
app.post('/auth/register', register);
app.post('/auth/login', login);

const expressServer = app.listen(PORT, () => {
  console.log(`App started at http://localhost:${PORT}`);
});