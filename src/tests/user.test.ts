import app from "../index.ts";
import request from "supertest";

describe("User tests", () => {
  test("GET /api/v1/user/ should return all users", async () => {
    const response = await request(app).get("/api/v1/user/").expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /api/v1/user/:id should return a single user by ID", async () => {
    const mockCredentials = {
      email: "admin@localhost.local",
      password: "admin123",
    };

    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send(mockCredentials)
      .expect(200);

    const token = loginResponse.body.token;

    const allUsers = await request(app).get("/api/v1/user/").expect(200);

    if (allUsers.body.length > 0) {
      const userId = allUsers.body[0]._id;
      const userResponse = await request(app)
        .get(`/api/v1/user/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(userResponse.body._id).toEqual(userId);
      expect(userResponse.body.email).toBeDefined();
    }
  });

  test("PUT /api/v1/user/:id should update a user", async () => {
    const mockCredentials = {
      email: "admin@localhost.local",
      password: "admin123",
    };

    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send(mockCredentials)
      .expect(200);

    const token = loginResponse.body.token;

    const newUser = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "updatetest", email: "updatetest@test.xyz", password: "asd123" })
      .expect(201);

    const updateResponse = await request(app)
      .put(`/api/v1/user/${newUser.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated User", email: "updatetest@test.xyz" })
      .expect(200);

    expect(updateResponse.body.name).toEqual("Updated User");
  });

  test("DELETE /api/v1/user/:id should delete a user", async () => {
    const mockCredentials = {
      email: "admin@localhost.local",
      password: "admin123",
    };

    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send(mockCredentials)
      .expect(200);

    const token = loginResponse.body.token;

    const newUser = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "deletetest", email: "deletetest@test.xyz", password: "asd123" })
      .expect(201);

    const deleteResponse = await request(app)
      .delete(`/api/v1/user/${newUser.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(deleteResponse.body.message).toEqual("Felhasználó sikeresen törölve.");
  });

  test("POST /api/v1/user/:id/nominate should nominate an instructor", async () => {
    const mockCredentials = {
      email: "admin@localhost.local",
      password: "admin123",
    };

    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send(mockCredentials)
      .expect(200);

    const token = loginResponse.body.token;

    const allUsers = await request(app).get("/api/v1/user/").expect(200);

    if (allUsers.body.length > 0) {
      const userId = allUsers.body[0]._id;

      const nominateResponse = await request(app)
        .post(`/api/v1/user/${userId}/nominate`)
        .set("Authorization", `Bearer ${token}`)
        .send({ instructorId: userId })
        .expect(200);

      expect(nominateResponse.body.message).toEqual("Sikeresen megjelölted az oktatót.");
    }
  });
});