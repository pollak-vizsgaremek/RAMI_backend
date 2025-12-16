// Server imports
import e from "express";

// Controller imports
//import licencePlateController from "./controller/licencePlateData.controller";

//import entryController from "./controller/licencePlateEntry.controller";


// Middleware imports
//import { apiKeyMiddleware } from "./middleware/apiKey.middleware";

const PORT = process.env.PORT;

const app = e();

app.use(e.json());

//app.use("/api/v1/licencePlate", apiKeyMiddleware, licencePlateController);

const expressServer = app.listen(PORT, () => {
  console.log("App started at http://localhost:3300");
});

