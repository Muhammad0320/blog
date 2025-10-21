import prisma from "../../db/prisma";
import { createUser, loginUser } from "../../test-utils/helpers";
import request from "supertest";
import app from "../../test-utils/testApp";
import { setTimeout } from "timers/promises";

describe("Post API Endpoints", () => {
  beforeEach(async () => {
    await prisma.posts.deleteMany();
    await prisma.users.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should allow an authenticated user to create a post", async () => {
    const userData = {
      username: "muhammad",
      email: "balogun@gmail.com",
      password: "password",
    };

    const user = await createUser(userData);
    await setTimeout(1 * 1000);
    expect(user.status).toBe(201);
    const authUser = await loginUser(userData);
    expect(authUser.status).toBe(200);
    const userCookie = authUser.headers["set-cookie"];

    const postData = {
      title: "Post Title",
      content: "Post content",
    };

    const postRes = await request(app)
      .post("/api/v1/posts")
      .set("Cookie", userCookie)
      .send(postData);

    expect(postRes.status).toBe(201);
  });

  it("should prevent a user from deleting a post they do not own", async () => {
    // 1. Create and Log in User A
    const userA_Data = {
      username: "userA",
      email: "a@test.com",
      password: "password123",
    };
    const userA = await createUser(userA_Data);
    expect(userA.status).toBe(201); // Verify user creation was successful
    await setTimeout(1 * 1000);
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

    console.log(postCreationRes.body, "---------------------");

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
});
