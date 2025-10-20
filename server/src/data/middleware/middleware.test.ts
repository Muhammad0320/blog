import request from "supertest";
import app from "../../test-utils/testApp";
import { createUser, loginUser } from "../../test-utils/helpers";
import prisma from "../../db/prisma";

describe("Authorization Middleware", () => {
  beforeEach(async () => {
    await prisma.comments.deleteMany();
    await prisma.posts.deleteMany();
    await prisma.users.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should prevent a user from deleting a post they do not own", async () => {
    // --- ARRANGE ---
    // We will create and log in each user sequentially to avoid race conditions.

    // 1. Create and Log in User A
    const userA_Data = {
      username: "userA",
      email: "a@test.com",
      password: "password123",
    };
    const userA = await createUser(userA_Data);
    expect(userA.status).toBe(201); // Verify user creation was successful
    const loginResA = await loginUser(userA_Data);
    expect(loginResA.status).toBe(200); // Verify login was successful
    const cookieUserA = loginResA.headers["set-cookie"];

    // 2. Create and Log in User B
    const userB_Data = {
      username: "userB",
      email: "b@test.com",
      password: "password123",
    };
    const userB = await createUser(userB_Data);
    expect(userB.status).toBe(201); // Verify user creation was successful
    const loginResB = await loginUser(userB_Data);
    expect(loginResB.status).toBe(200); // Verify login was successful
    const cookieUserB = loginResB.headers["set-cookie"];

    // 3. As User A, create a new post. We know User A is fully logged in.
    const postCreationRes = await request(app)
      .post("/api/v1/posts")
      .set("Cookie", cookieUserA)
      .send({ title: "User A Post", content: "This is my post." });

    expect(postCreationRes.status).toBe(201);
    const { postId } = postCreationRes.body;

    // --- ACT ---
    // 4. As User B, try to delete the post created by User A.
    const deleteAttemptRes = await request(app)
      .delete(`/api/v1/posts/${postId}`)
      .set("Cookie", cookieUserB);

    console.log(deleteAttemptRes.body);

    // --- ASSERT ---
    // 5. Expect a 403 Forbidden error, proving our authorization works.
    expect(deleteAttemptRes.status).toBe(403);
    expect(deleteAttemptRes.body.message).toContain("Forbidden");
  });

  it("should authenticate user with a valid cookie", async () => {
    const userData = {
      username: "testuserA",
      email: "a@test.com",
      password: "password123",
    };

    await createUser(userData);
    const loginRes = await loginUser(userData);
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
