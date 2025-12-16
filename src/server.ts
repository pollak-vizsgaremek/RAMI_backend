import express, { type Request, type Response } from "express";
import { Collection } from "mongodb";
import * as dotenv from "dotenv";
import cors from "cors";
import { connectToDatabase, getDb } from "./db.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- INTERFACE DEFINITION (Matches your instructor data structure) ---
interface Instructor {
  name: string;
  area: string;
  desc: string;
  color: string; // The color style string from your component
}

// --- Middleware ---
app.use(express.json());
// Configure CORS to allow your React frontend (default is 3000) to connect
app.use(cors({ origin: "http://localhost:3000" }));

// --- API Route ---
// Fetches all instructors from the 'instructors' collection
app.get("/api/instructors", async (req: Request, res: Response) => {
  try {
    const db = getDb();

    // Get the 'instructors' collection and specify its type
    const instructorsCollection: Collection<Instructor> =
      db.collection("instructors");

    // Find all instructors and convert the result to an array
    const instructors = await instructorsCollection.find({}).toArray();

    res.json(instructors);
  } catch (error) {
    console.error("Error fetching instructors:", error);
    res.status(500).send("Internal Server Error");
  }
});

// --- Server Initialization ---
async function startServer(): Promise<void> {
  try {
    // 1. Establish database connection
    await connectToDatabase();

    // 2. Start listening for requests
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log("API endpoint: /api/instructors");
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
}

startServer();
