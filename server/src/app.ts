import express from "express";
import postRoutes from "./data/routes/post.route";
import commentRouter from "./data/routes/comment.route";
import userRouter from "./data/routes/user.route";
import session from "express-session";
import "./data/db";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "my_default_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use("/api/v1", postRoutes);
app.use("/api/v1", commentRouter);
app.use("/api/v1", userRouter);

app.listen(port, () => {
  console.log(`🚀 Server is running a http://localhost:${port}`);
});
