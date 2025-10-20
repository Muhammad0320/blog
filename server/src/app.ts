import express from "express";
import postRoutes from "./data/routes/post.route";
import commentRouter from "./data/routes/comment.route";
import userRouter from "./data/routes/user.route";
import session from "express-session";
import "./data/db";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";

const app = express();
app.use(helmet());
const port = process.env.PORT || 3000;

// -- CORS configuration --
const allowdOrigins = [
  "http://localhost:3000",
  "http://my-prod-frontend-url.com",
]; // InshaAllah

const corsOptions: CorsOptions = {
  origin: (origin: any, callback: any) => {
    // Allows requests with no origin like mobile app and curl requests
    if (!origin) return callback(null, true);
    if (allowdOrigins.indexOf(origin) === -1) {
      const msg =
        "The CORS policy for this site does not allow access for the specified origins";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
};
app.use(cors(corsOptions));

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
