// Server imports
import e from "express";
import dotenv from "dotenv";

// Controller imports
//import licencePlateController from "./controller/licencePlateData.controller";

//import entryController from "./controller/licencePlateEntry.controller";
import { connectDatabase } from "./service/dbConnection.service";

// Middleware imports
//import { apiKeyMiddleware } from "./middleware/apiKey.middleware";

dotenv.config();
const PORT = process.env.PORT;

const app = e();

app.use(e.json());

//app.use("/api/v1/licencePlate", apiKeyMiddleware, licencePlateController);

const expressServer = app.listen(PORT, () => {
  connectDatabase()
    .then(() => console.log("Sikeres adatbázis kapcsolat!"))
    .catch((error) => console.error("Sikertelen adatbázis kapcsolat!", error));
  console.log(`App started at http://localhost:${PORT}`);
});



