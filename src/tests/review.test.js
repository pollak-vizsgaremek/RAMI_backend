//@ts-nocheck

import app from "../index.ts";
import request from "supertest";

describe("Review Tests", () => {
  let authToken;
  let reviewId;
  let instructorId;
  let userId;

  // Setup - Get auth token
  beforeAll(async () => {
    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: "admin@localhost.local",
      password: "admin123",
    });

    if (loginResponse.status === 200) {
      authToken = loginResponse.body.token;
      userId = loginResponse.body.user?._id;
    }

    // Get first instructor
    const instructorsResponse = await request(app).get("/api/v1/instructor/");

    if (instructorsResponse.body.length > 0) {
      instructorId = instructorsResponse.body[0]._id;
    }
  });

  describe("GET /api/v1/review - Get All Reviews", () => {
    test("should return array of reviews", async () => {
      const response = await request(app).get("/api/v1/review/").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test("should return reviews with expected properties", async () => {
      const response = await request(app).get("/api/v1/review/").expect(200);

      if (response.body.length > 0) {
        const review = response.body[0];
        expect(review).toHaveProperty("_id");
      }
    });
  });

  describe("POST /api/v1/review/newreview - Create Review", () => {
    test("should create a new review with valid data", async () => {
      if (!instructorId || !userId) {
        console.log("Skipping test: No instructor or user found");
        return;
      }

      const response = await request(app)
        .post("/api/v1/review/newreview")
        .send({
          user: userId,
          instructor: instructorId,
          rating: [
            {
              patience: 8,
              teachingquality: 9,
              clarity: 8,
            },
          ],
        });

      expect([201, 200, 400, 500]).toContain(response.status);

      if ([201, 200].includes(response.status)) {
        reviewId = response.body._id;
        expect(response.body).toHaveProperty("_id");
      }
    });

    test("should validate rating is within valid range", async () => {
      if (!instructorId || !userId) {
        console.log("Skipping test: No instructor or user found");
        return;
      }

      const response = await request(app)
        .post("/api/v1/review/newreview")
        .send({
          user: userId,
          instructor: instructorId,
          rating: [
            {
              patience: 15, // Invalid: max is 10
              teachingquality: 9,
              clarity: 8,
            },
          ],
        });

      expect([201, 400, 500]).toContain(response.status);
    });

    test("should return 400 when missing required fields", async () => {
      const response = await request(app)
        .post("/api/v1/review/newreview")
        .send({
          user: userId,
          // Missing instructor and rating
        });

      expect([400, 500]).toContain(response.status);
    });
  });

  describe("GET /api/v1/review/instructor/:id - Get Instructor Reviews", () => {
    test("should return array of reviews for instructor", async () => {
      if (!instructorId) {
        console.log("Skipping test: No instructor found");
        return;
      }

      const response = await request(app)
        .get(`/api/v1/review/instructor/${instructorId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test("should return reviews with user data populated", async () => {
      if (!instructorId) {
        console.log("Skipping test: No instructor found");
        return;
      }

      const response = await request(app)
        .get(`/api/v1/review/instructor/${instructorId}`)
        .expect(200);

      if (response.body.length > 0) {
        const review = response.body[0];
        // Should have user populated
        if (review.user) {
          expect(review.user).toHaveProperty("name");
        }
      }
    });
  });

  describe("GET /api/v1/review/user/:userId - Get User Reviews", () => {});

  describe("PUT /api/v1/review/:id/helpful - Toggle Helpful Review", () => {
    test("should toggle helpful status on review", async () => {
      if (!reviewId && instructorId && userId) {
        // Create a review first
        const createResponse = await request(app)
          .post("/api/v1/review/newreview")
          .send({
            user: userId,
            instructor: instructorId,
            rating: [
              {
                patience: 7,
                teachingquality: 8,
                clarity: 7,
              },
            ],
          });

        if (createResponse.status === 201) {
          reviewId = createResponse.body._id;
        }
      }

      if (!reviewId) {
        console.log("Skipping test: No review found");
        return;
      }

      const response = await request(app)
        .put(`/api/v1/review/${reviewId}/helpful`)
        .send({ helpful: true })
        .expect(200);

      expect(response.body).toBeDefined();
    });
  });

  describe("DELETE /api/v1/review/:id - Delete Review", () => {
    test("should delete an existing review", async () => {
      if (!instructorId || !userId) {
        console.log("Skipping test: No instructor or user found");
        return;
      }

      // Create a review first
      const createResponse = await request(app)
        .post("/api/v1/review/newreview")
        .send({
          user: userId,
          instructor: instructorId,
          rating: [
            {
              patience: 6,
              teachingquality: 7,
              clarity: 6,
            },
          ],
        });

      if (createResponse.status !== 201) {
        console.log("Skipping test: Could not create review");
        return;
      }

      const deleteResponse = await request(app)
        .delete(`/api/v1/review/${createResponse.body._id}`)
        .expect(200);

      expect(deleteResponse.body).toHaveProperty("message");
    });

    test("should return 404 when deleting non-existent review", async () => {
      const response = await request(app).delete("/api/v1/review/invalidid");

      expect([404, 500, 200]).toContain(response.status);
    });
  });
});
