import userRouter from "../data/routes/user.route";
import postRoutes from "../data/routes/post.route";
import express from "express";
import session from "express-session";

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
app.use("/api/v1", postRoutes);

export default app;
