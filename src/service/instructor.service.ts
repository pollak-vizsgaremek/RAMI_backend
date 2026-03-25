import Oktato from "../models/oktato.model";
import { connectDatabase } from "./dbConnection.service";

const db = await connectDatabase();

export const getAllInstructors = async () => {
    return await db.collection("oktatok").find().toArray();
}