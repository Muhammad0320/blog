import express from "express";
import postRoutes from "./data/routes/post.route";
import commentRouter from "./data/routes/comment.route";
import userRouter from "./data/routes/user.route";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/v1", postRoutes);
app.use("/api/v1", commentRouter);
app.use("/api/v1", userRouter);

app.listen(port, () => {
  console.log(`🚀 Server is running a http://localhost:${port}`);
});
