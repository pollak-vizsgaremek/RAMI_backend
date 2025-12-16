import { MongoClient, ServerApiVersion, Db } from "mongodb";

// Get URI from environment variables
const uri: string = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName: string = "RateMyInstructorDB"; // Your chosen database name

let client: MongoClient | undefined;
let db: Db | undefined;

/**
 * Connects to the MongoDB database.
 * @returns {Promise<void>}
 */
export async function connectToDatabase(): Promise<void> {
  if (db) {
    console.log("Using existing database connection.");
    return;
  }

  try {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await client.connect();

    // Ping to confirm successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");

    // Set the database instance
    db = client.db(dbName);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

/**
 * Returns the connected database instance.
 * @returns {Db} The database instance.
 * @throws {Error} if the database is not connected.
 */
export function getDb(): Db {
  if (!db) {
    throw new Error("Database not connected. Call connectToDatabase() first.");
  }
  return db;
}

/**
 * Closes the MongoDB connection.
 * @returns {Promise<void>}
 */
export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed.");
  }
  client = undefined;
  db = undefined;
}
