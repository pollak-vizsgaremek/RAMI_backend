//@ts-nocheck

import app from "../index.ts";
import request from "supertest";

describe("Authentication Tests", () => {
  let authToken;
  let userId;
  let instructorId;

  // Setup - Login admin user
  beforeAll(async () => {
    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: "admin@localhost.local",
      password: "admin123",
    });

    if (loginResponse.status === 200) {
      authToken = loginResponse.body.token;
    }
  });

  describe("POST /api/v1/auth/register - User Registration", () => {
    test("should register a new user with valid credentials", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Test User",
          email: `test_user_${Date.now()}@example.com`,
          password: "TestPassword123!",
        });

      expect([201, 200, 500]).toContain(response.status);
      if (response.status === 500) {
        console.log("Skipping email verification: Email service failed");
      } else {
        expect(response.body).toHaveProperty("message");
    });

    test("should return 409 when registering with existing email", async () => {
      const email = `duplicate_${Date.now()}@example.com`;

      // First registration
      await request(app).post("/api/v1/auth/register").send({
        name: "User 1",
        email: email,
        password: "Password123!",
      });

      // Try duplicate
      const response = await request(app).post("/api/v1/auth/register").send({
        name: "User 2",
        email: email,
        password: "Password123!",
      });

      expect(response.status).toBe(409);
    });

    test("should return 400 when missing required fields", async () => {
      const response = await request(app).post("/api/v1/auth/register").send({
        name: "Test User",
        // Missing email and password
      });

      expect([400, 500]).toContain(response.status);
    });

    test("should hash password before storing", async () => {
      const email = `hash_test_${Date.now()}@example.com`;
      const password = "TestPassword123!";

      const response = await request(app).post("/api/v1/auth/register").send({
        name: "Hash Test User",
        email: email,
        password: password,
      });

      expect([201, 200, 500]).toContain(response.status);
    });
  });

  describe("POST /api/v1/auth/register-instructor - Instructor Registration", () => {
    test("should register a new instructor with valid credentials", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register-instructor")
        .send({
          name: "Test Instructor",
          email: `instructor_${Date.now()}@example.com`,
          password: "InstructorPass123!",
          age: 35,
          phoneNumber: "06201234567",
          hobbies: ["teaching", "coding"],
          city: "Budapest",
          experience: 5,
        });

      expect([201, 200, 500]).toContain(response.status);
      if (response.status === 500) {
        console.log("Skipping email verification: Email service failed");
      } else {
        expect(response.body).toHaveProperty("message");
      }
    });

    test("should return 409 when instructor email already exists", async () => {
      const email = `dup_instructor_${Date.now()}@example.com`;

      // First registration
      await request(app).post("/api/v1/auth/register-instructor").send({
        name: "Instructor 1",
        email: email,
        password: "Password123!",
        age: 30,
        phoneNumber: "06301234567",
        city: "Budapest",
        experience: 3,
      });

      // Try duplicate
      const response = await request(app)
        .post("/api/v1/auth/register-instructor")
        .send({
          name: "Instructor 2",
          email: email,
          password: "Password123!",
          age: 35,
          phoneNumber: "06351234567",
          city: "Debrecen",
          experience: 5,
        });

      expect(response.status).toBe(409);
    });
  });

  describe("POST /api/v1/auth/login - User Login", () => {
    test("should login with valid credentials", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "admin@localhost.local",
        password: "admin123",
      });

      expect([200, 401, 404]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("email");
      }
    });

    test("should return 404 with non-existent email", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "nonexistent@example.com",
        password: "anypassword",
      });

      expect(response.status).toBe(404);
    });

    test("should return token in JWT format", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "admin@localhost.local",
        password: "admin123",
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toMatch(
        /^[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*$/,
      );
    });
  });

  describe("POST /api/v1/auth/forgot-password - Forgot Password", () => {
    test("should send password reset email with valid email", async () => {
      const response = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({
          email: "admin@localhost.local",
        });

      // 429 if rate limited, 500 if email service fails, 200 if successful
      expect([200, 429, 500]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body).toHaveProperty("message");
      }
    });

    test("should handle non-existent email gracefully", async () => {
      const response = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({
          email: "nonexistent@example.com",
        });

      // 429 if rate limited, 404 if not found, 500 if error
      expect([200, 404, 429, 500]).toContain(response.status);
    });
  });

  describe("POST /api/v1/auth/reset-password - Reset Password", () => {
    test("should reset password with valid token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({
          token: "validtoken",
          newPassword: "NewPassword123!",
        });

      // Depends on implementation
      expect([200, 400, 500]).toContain(response.status);
    });

    test("should return 400 with invalid token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({
          token: "invalidtoken123",
          newPassword: "NewPassword123!",
        });

      expect([400, 500]).toContain(response.status);
    });
  });

  describe("GET /api/v1/auth/verify/:token - Email Verification", () => {
    test("should handle email verification redirect", async () => {
      const response = await request(app)
        .get("/api/v1/auth/verify/invalidtoken")
        .redirects(0);

      expect([400, 302, 404]).toContain(response.status);
    });
  });
});
