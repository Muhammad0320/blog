import express from "express";
import postRoutes from "./data/routes/post.route";
import commentRouter from "./data/routes/comment.route";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/v1", postRoutes);
app.use("/api/v1", commentRouter);

app.listen(port, () => {
  console.log(`🚀 Server is running a http://localhost:${port}`);
});
