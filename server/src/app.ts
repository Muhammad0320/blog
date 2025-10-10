import express from "express";
import postRoutes from "./data/routes/post.route";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/v1", postRoutes);

app.listen(port, () => {
  console.log(`🚀 Server is running a http://localhost:${port}`);
});
