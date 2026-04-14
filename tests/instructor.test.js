import test, { describe } from "node:test";
import app from "../index.js";
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
      .put(`/api/v1/instructor/:id/${newRecord.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "test", email: "test@test.xyz", password: "asd123" })
      .expect(200);

    expect(updateRecord.body.name).toEqual("Upadted Test");

    await request(app)
      .delete(`/api/v1/instructor/:id/${newRecord.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);
  });
});
