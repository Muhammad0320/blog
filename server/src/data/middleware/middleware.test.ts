import request from "supertest";
import pool from "../db";
import app from "../../test-utils/testApp";
import { createUser, loginUser } from "../../test-utils/helpers";

describe("Authorization Middleware", () => {
  beforeEach(async () => {
    // Clean all relevant tables
    await pool.query("DELETE FROM users");
    await pool.query("DELETE FROM posts");
    await pool.query("DELETE FROM comments");
  });

  afterAll(() => {
    pool.end();
  });

  it("should fail when unauthorized user tries to delete a post", async () => {
    const userDataA = {
      username: "testuserA",
      email: "a@test.com",
      password: "password123",
    };
    const userDataB = {
      username: "testuserB",
      email: "b@test.com",
      password: "password123",
    };

    await createUser(userDataA);
    await createUser(userDataB);

    const userResA = await loginUser(userDataA);
    expect(userResA.status).toBe(200);
    const cookieUserA = userResA.headers["set-cookie"];

    const userResB = await loginUser(userDataB);
    expect(userResB.status).toBe(200);
    const cookieUserB = userResB.headers["set-cookie"];

    const postCreationRes = await request(app)
      .post("/api/v1/posts")
      .set("Cookie", cookieUserA)
      .send({ title: "The begining", content: "Bismillah" });
    expect(postCreationRes.status).toBe(201);
    const { postId } = postCreationRes.body;

    const postDeletionRes = await request(app)
      .delete(`/api/v1/posts/${postId}`)
      .set("Cookie", cookieUserB);

    expect(postDeletionRes.status).toBe(403);
    expect(postDeletionRes.body.message).toContain("Forbidden");
  });

  it("should authenticate user with a valid cookie", async () => {
    const userData = {
      username: "testuserA",
      email: "a@test.com",
      password: "password123",
    };

    await createUser(userData);
    const loginRes = await loginUser(userData);
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
