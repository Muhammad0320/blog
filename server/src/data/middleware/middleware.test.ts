import request from "supertest";
import app from "../../test-utils/testApp";
import { createUser, loginUser } from "../../test-utils/helpers";
import prisma from "../../db/prisma";
import { setTimeout } from "timers/promises";

describe("Authorization Middleware", () => {
  beforeEach(async () => {
    await prisma.comments.deleteMany();
    await prisma.posts.deleteMany();
    await prisma.users.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should authenticate user with a valid cookie", async () => {
    const newUserData = {
      username: "testuser",
      email: "login@test.com",
      password: "password123",
    };

    await createUser(newUserData);
    const loginRes = await loginUser({
      email: newUserData.email,
      password: newUserData.password,
    });

    expect(loginRes.status).toBe(200);
    const cookie = loginRes.headers["set-cookie"];

    const postRes = await request(app)
      .post("/api/v1/posts")
      .set("Cookie", cookie)
      .send({ title: "The Beginning", content: "Bismillah" });

    expect(postRes.status).toBe(201);
    expect(postRes.body).toHaveProperty("postId");
  });

  it("should fail without a cookie", async () => {
    const postRes = await request(app)
      .post("/api/v1/posts")
      .send({ title: "The Beginning", content: "Bismillah" });

    expect(postRes.status).toBe(401);
    expect(postRes.body.message).toContain("Unauthorized");
  });
});
