import User from "../models/user.model";
import { connectDatabase } from "./dbConnection.service";

const db = await connectDatabase();

export const create_User = async (userData) => {
    
    //const new_User = await db.collection("users").insertOne(userData);
    const new_User = new User(userData);
    await new_User.save();
    return new_User;
}

export const getall_User = async () => {

    const data = await db.collection("users").find().toArray();
    return data;
}

export const get_User = async (nev) => {
    const data = await db.collection("users").findOne({nev});
    return data;
}

export const save_User_apiKey = async (nev, apiKey) => {
    const user = await get_User(nev);
    if (!user) {
        throw new Error("User not found!");
    }
    user.apiKey = apiKey;
    try {
    await user.save();
    } catch (error) {
        console.error("Error saving API key to user:", error);
        throw new Error("Failed to save API key to user.");
    }

}
export const edit_User = async (nev, userData) => {
    const user = await get_User(nev);
    if (!user) {
        throw new Error("User not found!");
    }
    Object.assign(user, userData);
    try {

        await user.save();
        return user;
    } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update user.");
    }
}