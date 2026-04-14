import app from "../index.ts";
import request from "supertest";

describe("Instructor tests", () => {
  test("GET /api/v1/instructor/ should return all test model data", async () => {
    const response = await request(app).get("/api/v1/instructor/").expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  // Ha lenne ebben post így nézne ki valahogy (ez csak az órai példa)
  //   test("POST /api/v1/instructor/ should return succes message for valid credentails", async () => {
  //     const mockCredentials = {
  //       email: "admin@localhost.local",
  //       password: "admin123",
  //     };

  //     const response = await request(app)
  //       .post("/api/v1/instructor/")
  //       .send(mockCredentials)
  //       .expect(200);

  //     expect(response.body.message).toEqual({ message: "Login succesful" });
  //     expect(response.body.token).toBeDefine();
  //   });

  test("GET /api/v1/instructor/:id should return a single instructor by ID", async () => {
    const response = await request(app).get("/api/v1/instructor/").expect(200);
    
    if (response.body.length > 0) {
      const instructorId = response.body[0]._id;
      const singleResponse = await request(app)
        .get(`/api/v1/instructor/${instructorId}`)
        .expect(200);

      expect(singleResponse.body._id).toEqual(instructorId);
      expect(singleResponse.body.name).toBeDefined();
    }
  });

  test("GET /api/v1/instructor/search should return search results", async () => {
    const response = await request(app)
      .get("/api/v1/instructor/search")
      .query({ q: "test" })
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  test("PUT /api/v1/instructor/:id should update a test model record ", async () => {
    const mockCredentials = {
      email: "admin@localhost.local",
      password: "admin123",
    };

    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send(mockCredentials)
      .expect(200);

    const token = loginResponse.body.token;

    const newRecord = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "test", email: "test@test.xyz", password: "asd123" })
      .expect(201);

    const updateRecord = await request(app)
      .put(`/api/v1/instructor/${newRecord.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Upadted Test", email: "test@test.xyz", password: "asd123" })
      .expect(200);

    expect(updateRecord.body.name).toEqual("Upadted Test");

    await request(app)
      .delete(`/api/v1/instructor/${newRecord.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);
  });

  test("DELETE /api/v1/instructor/:id should delete an instructor", async () => {
    const mockCredentials = {
      email: "admin@localhost.local",
      password: "admin123",
    };

    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send(mockCredentials)
      .expect(200);

    const token = loginResponse.body.token;

    const newRecord = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "delete_test", email: "delete@test.xyz", password: "asd123" })
      .expect(201);

    const deleteResponse = await request(app)
      .delete(`/api/v1/instructor/${newRecord.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(deleteResponse.body.message).toEqual("Oktató sikeresen törölve.");
  });
});
