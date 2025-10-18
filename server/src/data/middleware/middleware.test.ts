import request, { agent } from "supertest";
import pool from "../db";
import app from "../../test-utils/testApp";
import { createUser, loginUser } from "../../test-utils/helpers";

describe("Authorization Middleware", () => {
  beforeEach(async () => {
    await pool.query("SET FOREIGN_KEY_CHECKS = 0;");

    // 2. Truncate each table individually. The order doesn't matter now.
    await pool.query("TRUNCATE TABLE comments;");
    await pool.query("TRUNCATE TABLE posts;");
    await pool.query("TRUNCATE TABLE users;");

    // 3. IMPORTANT: Re-enable foreign key checks to enforce data integrity.
    await pool.query("SET FOREIGN_KEY_CHECKS = 1;");
  });

  afterAll(() => {
    pool.end();
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
    console.log(loginResA.body, "----------------");
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
    console.log(loginResB.body, "----------------");
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

    // --- ASSERT ---
    // 5. Expect a 403 Forbidden error, proving our authorization works.
    expect(deleteAttemptRes.status).toBe(403);
    expect(deleteAttemptRes.body.message).toContain("Forbidden");
  });

  // it("should prevent a user from deleting a post they do not own", async () => {
  //   // --- ARRANGE ---
  //   // We will create and log in each user sequentially to avoid race conditions.

  //   // 1. Create and Log in User A
  //   const userA_Data = {
  //     username: "userA",
  //     email: "a@test.com",
  //     password: "password123",
  //   };

  //   const agentA = agent(app);
  //   const userA = await agentA.post("/api/v1/posts").send(userA_Data);
  //   expect(userA.status).toBe(201); // Verify user creation was successful
  //   const loginResA = await agentA.post("/api/v1/login").send(userA_Data);
  //   console.log(loginResA.body, "----------------");
  //   expect(loginResA.status).toBe(200); // Verify login was successful

  //   // 2. Create and Log in User B
  //   const userB_Data = {
  //     username: "userB",
  //     email: "b@test.com",
  //     password: "password123",
  //   };
  //   const agentB = agent(app);
  //   const userB = await agentA.post("/api/v1/posts").send(userB_Data);
  //   expect(userB.status).toBe(201); // Verify user creation was successful
  //   const loginResB = await agentA.post("/api/v1/login").send(userB_Data);
  //   console.log(loginResA.body, "----------------");
  //   expect(loginResB.status).toBe(200); // Verify login was successful

  //   // 3. As User A, create a new post. We know User A is fully logged in.
  //   const postCreationRes = await agentA
  //     .post("/api/v1/posts")
  //     .send({ title: "User A Post", content: "This is my post." });

  //   expect(postCreationRes.status).toBe(201);
  //   const { postId } = postCreationRes.body;

  //   // --- ACT ---
  //   // 4. As User B, try to delete the post created by User A.
  //   const deleteAttemptRes = await agentB.delete(`/api/v1/posts/${postId}`);

  //   // --- ASSERT ---
  //   // 5. Expect a 403 Forbidden error, proving our authorization works.
  //   expect(deleteAttemptRes.status).toBe(403);
  //   expect(deleteAttemptRes.body.message).toContain("Forbidden");
  // });

  // it("should authenticate user with a valid cookie", async () => {
  //   const userData = {
  //     username: "testuserA",
  //     email: "a@test.com",
  //     password: "password123",
  //   };

  //   await createUser(userData);
  //   const loginRes = await loginUser(userData);
  //   expect(loginRes.status).toBe(200);
  //   const cookie = loginRes.headers["set-cookie"];

  //   const postRes = await request(app)
  //     .post("/api/v1/posts")
  //     .set("Cookie", cookie)
  //     .send({ title: "The Beginning", content: "Bismillah" });

  //   expect(postRes.status).toBe(201);
  //   expect(postRes.body).toHaveProperty("postId");
  // });

  // it("should fail without a cookie", async () => {
  //   const postRes = await request(app)
  //     .post("/api/v1/posts")
  //     .send({ title: "The Beginning", content: "Bismillah" });

  //   expect(postRes.status).toBe(401);
  //   expect(postRes.body.message).toContain("Unauthorized");
  // });
});
