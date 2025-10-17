import request from "supertest";
import express from "express";
import userRouter from "./user.route";
import pool from "../db";
import session from "express-session";
import { UserData } from "../models/user.model";

const app = express();
app.use(express.json());

app.use(
  session({
    secret: "a_secret_for_testing_only",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/api/v1", userRouter);
const createUser = async (userData: UserData) => {
  const res = await request(app).post("/api/v1/users").send(userData);
  return res;
};

const loginUser = async (loginData: { email: string; password: string }) => {
  const res = await request(app).post("/api/v1/login").send(loginData);
  return res;
};

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

    await createUser(firstUser);
    const res = await createUser(secondUser);

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Username or email already exists.");
  });

  it("should fail to create a user with invalid data (e.g., short password )", async () => {
    const invalidUser = {
      username: "test",
      email: "test@gmail.com",
      password: "123",
    };

    const res = await createUser(invalidUser);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveProperty("password");
  });

  it("should successfully login user with valid credentials ans return a session cookie", async () => {
    const newUserData = {
      username: "testuser",
      email: "login@test.com",
      password: "password123",
    };

    await createUser(newUserData);
    const res = await loginUser({
      email: newUserData.email,
      password: newUserData.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.user.email).toBe(newUserData.email);

    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("should fails when a user tries to login with incorrect password", async () => {
    const newUserData = {
      username: "testuser",
      email: "login@test.com",
      password: "password123",
    };

    await createUser(newUserData);
    const res = await loginUser({
      email: newUserData.email,
      password: "password456",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("should fail when user tries to login with invalid data", async () => {
    const newUserData = {
      username: "testuser",
      email: "login@test.com",
      password: "password123",
    };

    await createUser(newUserData);
    const res = await loginUser({
      email: "mymail.com",
      password: newUserData.password,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveProperty("email");
  });
});
