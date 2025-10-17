import express from "express";
import userRouter from "./user.route";
import pool from "../db";
import request from "supertest";

const app = express();
app.use(express.json());
app.use("/api/v1", userRouter);

describe("User API Endpoints", () => {
  afterAll(() => {
    pool.end();
  });

  it("should create a new user successfully", async () => {
    const newUserData = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    const response = await request(app).post("/api/v1/users").send(newUserData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("userId");
    expect(response.body.message).toBe("User created successfully");
  });

  it("should faild to create user with duplicate email", async () => {
    const duplicateUser = {
      username: "newUser",
      email: "text@example.com",
      password: "password123",
    };

    const response = await request(app)
      .post("/api/v1/users")
      .send(duplicateUser);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Username or email already exists.");
  });
});
