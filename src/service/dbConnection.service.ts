import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

let client: MongoClient | undefined | null;
let db: Db | undefined | null;

const connectDatabase = async () => {
  const uri = process.env.DATABASE_URL;

  if (!uri) {
    console.error("Nem létezik az adatbázis string!");
    throw new Error("Nem létezik az adatbázis string!");
  }
  if (db) return db;

  try {
    if (!client) {
      client = new MongoClient(uri, {
        minPoolSize: 5,
        maxPoolSize: 15,
      });
      await client.connect();
    }

    db = client.db("rami");
    return db;
  } catch (error) {
    console.error("Sikertelen az adatbázis kapcsolat!");
    throw new Error("Sikertelen az adatbázis kapcsolat!");
  }
};

export { connectDatabase };
