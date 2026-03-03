import generateApiKey from "generate-api-key";
import { get_User } from "./User_Data.service";
import { save_User_apiKey } from "./User_Data.service";


export const loginUser = async (nev: string, login_password: string) => {
    const user = await get_User(nev);
    if (!user) {
        throw new Error("Hibás felhasználónév vagy jelszó!");
    }
    // Itt hasonlítsd össze a jelszót (pl. bcrypt.compare, ha hash-elt)
    if (user.password !== login_password) {
        throw new Error("Hibás felhasználónév vagy jelszó!");
    }
    const apiKey = generateApiKey();
    // Itt mentsd el az apiKey-t a userhez, ha szükséges
    await save_User_apiKey(nev, apiKey);

    return apiKey;
}
