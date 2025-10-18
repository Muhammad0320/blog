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
});
