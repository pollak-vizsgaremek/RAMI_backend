import nodeCron from "node-cron";
import { calculateAverageRating } from "../service/calculateratings.service";

nodeCron.schedule("0 0 * * *", async () => {
    const oktatoId = "some-oktató-id"; // Replace with actual oktató ID
    const averageRating = await calculateAverageRating(oktatoId);
    console.log(`Average rating for oktató ${oktatoId}: ${averageRating}`);
});
