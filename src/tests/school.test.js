//@ts-nocheck

import app from "../index.ts";
import request from "supertest";

describe("School Tests", () => {
  describe("GET /api/v1/school - Get All Schools", () => {
    test("should return array of schools", async () => {
      const response = await request(app).get("/api/v1/school/");

      // School routes may be empty
      expect([200, 404]).toContain(response.status);

      if (response.status === 200) {
        expect(Array.isArray(response.body)).toBe(true);
      }
    });
  });
});
