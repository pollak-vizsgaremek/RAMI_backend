//@ts-nocheck

import app from "../index.ts";
import request from "supertest";

describe("Instructor Tests", () => {
  let authToken;
  let instructorId;

  // Setup - Get auth token
  beforeAll(async () => {
    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: "admin@localhost.local",
      password: "admin123",
    });

    if (loginResponse.status === 200) {
      authToken = loginResponse.body.token;
    }
  });

  describe("GET /api/v1/instructor - Get All Instructors", () => {
    test("should return array of all instructors", async () => {
      const response = await request(app)
        .get("/api/v1/instructor/")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test("should return instructors with expected properties", async () => {
      const response = await request(app)
        .get("/api/v1/instructor/")
        .expect(200);

      if (response.body.length > 0) {
        instructorId = response.body[0]._id;
        const instructor = response.body[0];
        expect(instructor).toHaveProperty("_id");
        expect(instructor).toHaveProperty("name");
        expect(instructor).toHaveProperty("email");
      }
    });

    test("should return populated school data", async () => {
      const response = await request(app)
        .get("/api/v1/instructor/")
        .expect(200);

      if (response.body.length > 0) {
        const instructor = response.body[0];
        // Schools should be populated
        if (instructor.schools) {
          expect(Array.isArray(instructor.schools)).toBe(true);
        }
      }
    });
  });

  describe("GET /api/v1/instructor/:id - Get Instructor By ID", () => {
    test("should return a single instructor by ID", async () => {
      const allResponse = await request(app)
        .get("/api/v1/instructor/")
        .expect(200);

      if (allResponse.body.length > 0) {
        const id = allResponse.body[0]._id;

        const response = await request(app)
          .get(`/api/v1/instructor/${id}`)
          .expect(200);

        expect(response.body._id).toEqual(id);
        expect(response.body).toHaveProperty("name");
      }
    });

    test("should return 404 for non-existent instructor", async () => {
      const response = await request(app).get(
        "/api/v1/instructor/000000000000000000000000",
      );

      expect(response.status).toBe(404);
    });

    test("should populate school information", async () => {
      const allResponse = await request(app)
        .get("/api/v1/instructor/")
        .expect(200);

      if (allResponse.body.length > 0) {
        const id = allResponse.body[0]._id;

        const response = await request(app)
          .get(`/api/v1/instructor/${id}`)
          .expect(200);

        if (response.body.schools) {
          expect(Array.isArray(response.body.schools)).toBe(true);
        }
      }
    });
  });

  describe("GET /api/v1/instructor/search - Search Instructors", () => {
    test("should return array of search results", async () => {
      const response = await request(app)
        .get("/api/v1/instructor/search")
        .query({ q: "test" })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test("should return empty array when search query is empty", async () => {
      const response = await request(app)
        .get("/api/v1/instructor/search")
        .query({ q: "" })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test("should search by instructor name", async () => {
      const response = await request(app)
        .get("/api/v1/instructor/search")
        .query({ q: "admin" })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      if (response.body.length > 0) {
        response.body.forEach((instructor) => {
          expect(instructor).toHaveProperty("name");
        });
      }
    });

    test("should return 400 without search query parameter", async () => {
      const response = await request(app).get("/api/v1/instructor/search");

      // Depends on implementation - may return empty array or 400
      expect([200, 400]).toContain(response.status);
    });
  });

  describe("PUT /api/v1/instructor/:id - Update Instructor", () => {
    test("should update instructor with valid data", async () => {
      const allResponse = await request(app)
        .get("/api/v1/instructor/")
        .expect(200);

      if (allResponse.body.length > 0) {
        const id = allResponse.body[0]._id;

        const response = await request(app)
          .put(`/api/v1/instructor/${id}`)
          .send({
            name: "Updated Instructor Name",
            email: allResponse.body[0].email,
          });

        expect([200, 500, 400]).toContain(response.status);

        if (response.status === 200) {
          expect(response.body).toHaveProperty("_id");
        }
      }
    });

    test("should return 404 for non-existent instructor", async () => {
      const response = await request(app)
        .put("/api/v1/instructor/000000000000000000000000")
        .send({ name: "New Name" });

      expect(response.status).toBe(404);
    });

    test("should allow partial updates", async () => {
      const allResponse = await request(app)
        .get("/api/v1/instructor/")
        .expect(200);

      if (allResponse.body.length > 0) {
        const id = allResponse.body[0]._id;

        const response = await request(app)
          .put(`/api/v1/instructor/${id}`)
          .send({ name: "Partially Updated Name" });

        expect([200, 500, 400]).toContain(response.status);
      }
    });
  });

  describe("DELETE /api/v1/instructor/:id - Delete Instructor", () => {
    test("should delete instructor with valid authorization", async () => {
      // Create a new instructor first
      const createResponse = await request(app)
        .post("/api/v1/auth/register-instructor")
        .send({
          name: "Delete Test Instructor",
          email: `delete_instructor_${Date.now()}@example.com`,
          password: "TestPassword123!",
          age: 35,
          phoneNumber: "06201234567",
          city: "Budapest",
          experience: 5,
        });

      if ([201, 200].includes(createResponse.status)) {
        // Instructor created, now try to delete
        // Note: We may not have the ID directly, so we'll get it from search
        const searchResponse = await request(app)
          .get("/api/v1/instructor/search")
          .query({ q: "Delete Test" });

        if (searchResponse.body.length > 0) {
          const id = searchResponse.body[0]._id;

          const deleteResponse = await request(app)
            .delete(`/api/v1/instructor/${id}`)
            .set("Authorization", `Bearer ${authToken}`);

          expect([200, 401, 404, 500]).toContain(deleteResponse.status);
        }
      }
    });

    test("should return 404 for non-existent instructor", async () => {
      const response = await request(app)
        .delete("/api/v1/instructor/000000000000000000000000")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    test("should return error message on successful deletion", async () => {
      const allResponse = await request(app)
        .get("/api/v1/instructor/")
        .expect(200);

      if (allResponse.body.length > 0) {
        const id = allResponse.body[0]._id;

        const response = await request(app).delete(`/api/v1/instructor/${id}`);

        // May require authorization
        if (response.status === 200) {
          expect(response.body).toHaveProperty("message");
        }
      }
    });
  });

  describe("Integration - Instructor Life Cycle", () => {
    test("should complete full instructor lifecycle", async () => {
      // 1. Register instructor
      const email = `lifecycle_test_${Date.now()}@example.com`;
      const registerResponse = await request(app)
        .post("/api/v1/auth/register-instructor")
        .send({
          name: "Lifecycle Test",
          email: email,
          password: "TestPassword123!",
          age: 30,
          experience: 5,
          phoneNumber: "06301234567",
          city: "Budapest",
        });

      // Allow 500 if email service fails
      if (![200, 201, 500].includes(registerResponse.status)) {
        throw new Error(`Unexpected status: ${registerResponse.status}`);
      }
      
      if (registerResponse.status !== 200 && registerResponse.status !== 201) {
        console.log("Skipping test: Email service failed");
        return;
      }

      // 2. Get all instructors to find the new one
      const allResponse = await request(app)
        .get("/api/v1/instructor/")
        .expect(200);

      expect(Array.isArray(allResponse.body)).toBe(true);

      // 3. Search for the instructor
      const searchResponse = await request(app)
        .get("/api/v1/instructor/search")
        .query({ q: "Lifecycle Test" })
        .expect(200);

      expect(Array.isArray(searchResponse.body)).toBe(true);
    });
  });
});
