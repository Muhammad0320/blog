import prisma from "../../db/prisma";
import { createUser, loginUser } from "../../test-utils/helpers";
import request from "supertest";
import app from "../../test-utils/testApp";

describe("Post API Endpoints", async () => {
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
});
