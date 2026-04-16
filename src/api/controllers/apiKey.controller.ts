import e, { Request, Response } from "express";
import { getApiKey, createApiKey } from "../../core/services/apiKey.service";
import { apiKey } from "../../utils/types.d";

const router = e.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const apiKey = (req.headers["x-api-key"] as string) ?? "";

    if (!apiKey) {
      res.status(400).json({
        message: "APIKEY is missing or wrong type!",
      });
      return;
    }

    const data = await getApiKey(apiKey);

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const data = await createApiKey();

    res.status(200).json({
      apiKey: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

export default router;
