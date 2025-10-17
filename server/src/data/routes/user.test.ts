import request from "supertest";
import express from "express";
import userRouter from "./user.route";
import pool from "../db";

const app = express();
app.use(express.json());
app.use("/api/v1", userRouter);

describe("User API Endpoints", () => {
  beforeEach(async () => {
    await pool.query("DELETE FROM users");
  });

  afterAll(() => {
    pool.end();
  });

  it("should create a new user successfully", async () => {
    const newUserData = {
      username: "testuser",
      email: `test_${Date.now()}@example.com`,
      password: "password123",
    };

    const res = await request(app).post("/api/v1/users").send(newUserData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("userId");
    expect(res.body.message).toBe("User created successfully");
  });

  it("should faild to create user with duplicate email", async () => {
    const sharedEmail = `duplicate_${Date.now()}@example.com`;

    const firstUser = {
      username: "firstUser",
      email: sharedEmail,
      password: "password123",
    };

    const secondUser = {
      username: "secondUser",
      email: sharedEmail,
      password: "password123",
    };

    await request(app).post("/api/v1/users").send(firstUser);

    const res = await request(app).post("/api/v1/users").send(secondUser);

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Username or email already exists.");
  });

  it("should fail to create a user with invalid data (e.g., short password )", async () => {
    const invalidUser = {
      username: "test",
      email: "test@gmail.com",
      password: "123",
    };

    const res = await request(app).post("/api/v1/users").send(invalidUser);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveProperty("password");
  });
});
