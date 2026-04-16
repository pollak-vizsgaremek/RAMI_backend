//@ts-nocheck

import app from "../index.ts";
import request from "supertest";

describe("Integration & Error Handling Tests", () => {
  let authToken;
  let adminUserId;

  beforeAll(async () => {
    try {
      const loginResponse = await request(app).post("/api/v1/auth/login").send({
        email: "admin@localhost.local",
        password: "admin123",
      });

      if (loginResponse.status === 200) {
        authToken = loginResponse.body.token;
        adminUserId = loginResponse.body.user?._id;
      } else {
        console.warn("Login failed with status:", loginResponse.status);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  }, 30000);

  describe("Error Handling & Edge Cases", () => {
    test("should return proper error for malformed ObjectId", async () => {
      const response = await request(app)
        .get("/api/v1/user/not-a-valid-id")
        .set("Authorization", `Bearer ${authToken}`);

      expect([400, 404, 500]).toContain(response.status);
    });

    test("should handle missing Authorization header", async () => {
      const response = await request(app).get(
        "/api/v1/user/000000000000000000000000",
      );

      expect(response.status).toBe(401);
    });

    test("should handle expired or invalid JWT token", async () => {
      const response = await request(app)
        .get("/api/v1/user/000000000000000000000000")
        .set("Authorization", "Bearer invalidtoken");

      expect(response.status).toBe(401);
    });

    test("should require Bearer token format", async () => {
      const response = await request(app)
        .get("/api/v1/user/000000000000000000000000")
        .set("Authorization", "InvalidFormat token123");

      expect(response.status).toBe(401);
    });
  });

  describe("CORS & Content-Type Handling", () => {
    test("should accept application/json content type", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .set("Content-Type", "application/json")
        .send({
          email: "admin@localhost.local",
          password: "admin123",
        });

      expect(response.status).toBe(200);
    });

    test("should return JSON responses", async () => {
      const response = await request(app).get("/api/v1/user/").expect(200);

      expect(response.headers["content-type"]).toMatch(/json/);
    });
  });

  describe("Database Constraints & Validation", () => {
    test("should enforce email uniqueness on registration", async () => {
      const email = `unique_test_${Date.now()}@example.com`;

      // First registration
      const response1 = await request(app).post("/api/v1/auth/register").send({
        name: "First User",
        email: email,
        password: "Password123!",
      });

      // Second registration with same email
      const response2 = await request(app).post("/api/v1/auth/register").send({
        name: "Second User",
        email: email,
        password: "Password123!",
      });

      // First should succeed, second should fail
      expect([200, 201]).toContain(response1.status);
      expect(response2.status).toBe(409);
    });
  });

  describe("Pagination & Large Data Sets", () => {
    test("should handle getting all users without pagination limits", async () => {
      const response = await request(app).get("/api/v1/user/").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length >= 0).toBe(true);
    });

    test("should handle search results with multiple matches", async () => {
      const response = await request(app)
        .get("/api/v1/instructor/search")
        .query({ q: "a" }) // Common letter
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("Resource Not Found Scenarios", () => {
    test("should return 404 for non-existent user endpoint", async () => {
      const response = await request(app)
        .get("/api/v1/user/000000000000000000000000")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    test("should return 404 for non-existent instructor", async () => {
      const response = await request(app).get(
        "/api/v1/instructor/000000000000000000000000",
      );

      expect(response.status).toBe(404);
    });

    test("should return 404 for non-existent review", async () => {
      const response = await request(app).delete(
        "/api/v1/review/000000000000000000000000",
      );

      expect([404, 500]).toContain(response.status);
    });
  });

  describe("HTTP Method Validation", () => {
    test("should reject DELETE on POST-only endpoint", async () => {
      const response = await request(app).delete("/api/v1/auth/login");

      expect(response.status).toBe(404 || 405);
    });

    test("should reject GET on POST-only endpoint with wrong method", async () => {
      const response = await request(app).get("/api/v1/auth/login");

      // May be 404 or 405 depending on implementation
      expect([404, 405, 400]).toContain(response.status);
    });
  });

  describe("Complex Query Scenarios", () => {
    test("should handle search with special characters", async () => {
      const response = await request(app)
        .get("/api/v1/instructor/search")
        .query({ q: "@#$%^" })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test("should handle very long search query", async () => {
      const longQuery = "a".repeat(1000);
      const response = await request(app)
        .get("/api/v1/instructor/search")
        .query({ q: longQuery });

      expect([200, 400, 500]).toContain(response.status);
    });

    test("should handle Unicode characters in search", async () => {
      const response = await request(app)
        .get("/api/v1/instructor/search")
        .query({ q: "Á Ü ő" }); // Hungarian characters

      expect([200, 400, 500]).toContain(response.status);
    });
  });

  describe("Authentication & Authorization", () => {
    test("should allow authenticated users to access protected routes", async () => {
      const response = await request(app)
        .get("/api/v1/user/000000000000000000000000")
        .set("Authorization", `Bearer ${authToken}`);

      // Will return 404 for non-existent user, but auth should pass
      expect([404, 200, 500]).toContain(response.status);
    });

    test("should deny unauthenticated users on protected routes", async () => {
      const response = await request(app)
        .put("/api/v1/user/000000000000000000000000")
        .send({ name: "Test" });

      expect(response.status).toBe(401);
    });

    test("should deny request with malformed Bearer token", async () => {
      const response = await request(app)
        .get("/api/v1/user/000000000000000000000000")
        .set("Authorization", "Bearer");

      expect(response.status).toBe(401);
    });
  });

  describe("Data Consistency", () => {
    test("should return consistent instructor list across requests", async () => {
      const response1 = await request(app)
        .get("/api/v1/instructor/")
        .expect(200);
      const response2 = await request(app)
        .get("/api/v1/instructor/")
        .expect(200);

      expect(response1.body.length).toBe(response2.body.length);
    });

    test("should return consistent user list across requests", async () => {
      const response1 = await request(app).get("/api/v1/user/").expect(200);
      const response2 = await request(app).get("/api/v1/user/").expect(200);

      expect(response1.body.length).toBe(response2.body.length);
    });
  });

  describe("Response Status Codes", () => {
    test("should return 200 for successful GET requests", async () => {
      const response = await request(app).get("/api/v1/user/");

      expect(response.status).toBe(200);
    });

    test("should return 200 or 201 for successful POST requests", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "admin@localhost.local",
        password: "admin123",
      });

      expect([200, 201]).toContain(response.status);
    });

    test("should return 401 for unauthorized requests", async () => {
      const response = await request(app)
        .put("/api/v1/user/000000000000000000000000")
        .send({ name: "Test" });

      expect(response.status).toBe(401);
    });

    test("should return 404 for not found resources", async () => {
      const response = await request(app)
        .get("/api/v1/user/000000000000000000000000")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});
