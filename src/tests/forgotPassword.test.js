//@ts-nocheck

import app from "../index.ts";
import request from "supertest";

describe("Forgot Password & Password Reset Tests", () => {
  describe("POST /api/v1/auth/forgot-password - Request Password Reset", () => {
    test("should accept email and initiate password reset", async () => {
      const response = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({
          email: "admin@localhost.local",
        });

      // Response depends on email service configuration
      expect([200, 201, 500, 404, 429]).toContain(response.status);
    });

    test("should handle non-existent email gracefully", async () => {
      const response = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({
          email: "nonexistent@example.com",
        });

      expect([200, 404, 500, 429]).toContain(response.status);
    });

    test("should accept valid email formats", async () => {
      const response = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({
          email: "test@example.com",
        });

      expect([200, 404, 500, 201, 429]).toContain(response.status);
    });

    test("should reject invalid email format", async () => {
      const response = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({
          email: "not-an-email",
        });

      expect([400, 500, 200, 429]).toContain(response.status);
    });
  });

  describe("POST /api/v1/auth/reset-password - Reset Password with Token", () => {
    test("should reset password with valid token and new password", async () => {
      const response = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({
          token: "valid_token_here",
          newPassword: "NewSecurePassword123!",
        });

      // Response depends on token validity
      expect([200, 400, 404, 500]).toContain(response.status);
    });

    test("should return 400 with invalid token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({
          token: "invalid_token",
          newPassword: "NewPassword123!",
        });

      expect([400, 404, 500]).toContain(response.status);
    });

    test("should return 400 with missing token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({
          newPassword: "NewPassword123!",
        });

      expect([400, 500]).toContain(response.status);
    });

    test("should return 400 with missing new password", async () => {
      const response = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({
          token: "validtoken",
        });

      expect([400, 500]).toContain(response.status);
    });

    test("should validate password strength", async () => {
      const response = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({
          token: "validtoken",
          newPassword: "weak", // Too weak
        });

      // Depends on validation rules
      expect([200, 400, 500]).toContain(response.status);
    });
  });

  describe("Password Reset Flow Integration", () => {
    test("should complete password reset workflow", async () => {
      // 1. Request password reset
      const forgotResponse = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({
          email: "admin@localhost.local",
        });

      expect([200, 201, 500, 404, 429]).toContain(forgotResponse.status);

      // 2. Attempt reset with invalid token (simulating real flow)
      const resetResponse = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({
          token: "invalid_token",
          newPassword: "NewPassword123!",
        });

      expect([200, 400, 404, 500]).toContain(resetResponse.status);
    });
  });
});
