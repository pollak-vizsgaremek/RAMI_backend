import e from "express";
import cors from "cors";

const app = e();

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));




app.listen(3300, () => {
    console.log("App started at http://localhost:3300")
})
