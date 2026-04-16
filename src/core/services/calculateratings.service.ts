import { connectDatabase } from "./dbConnection.service";

export const calculateAverageRating = async (oktatoId: string) => {
    const db = await connectDatabase();
    const ratings = await db.collection("ertekeles").find({ oktato: oktatoId }).toArray();

    if (ratings.length === 0) return 0;

    const total = ratings.reduce((acc, rating) => acc + rating.ertekeles, 0);
    return total / ratings.length;
};
