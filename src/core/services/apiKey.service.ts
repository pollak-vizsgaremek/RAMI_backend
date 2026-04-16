import { Double, ObjectId } from "mongodb";
import { connectDatabase } from "./dbConnection.service";
import { generateApiKey } from "generate-api-key";
import { createHash } from "crypto";
import { apiKey } from "../../utils/types.d";

const db = await connectDatabase();

export const getApiKey = async (Key: string) => {
  const hash = createHash("sha256").update(Key).digest("hex");

  const data = await db.collection<apiKey>("ApiKey").findOne({ Key: hash });

  if (!data) throw new Error("Api Key not found");

  return data;
};

export const validate = async (Key: string): Promise<boolean> => {
  return (await getApiKey(Key)) ? true : false;
};

export const createApiKey = async (): Promise<string> => {
  const Key = generateApiKey({
    batch: 1,
  })[0];

  const prefixKey = "LP_" + Key;

  const hash = createHash("sha256").update(prefixKey).digest("hex");

  const data = await db.collection<apiKey>("ApiKey").insertOne({
    Key: hash,
    name: "TEST",
  });

  if (!data.insertedId) throw new Error("Api Key generation failed!");

  return prefixKey;
};
