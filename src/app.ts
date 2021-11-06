import path from "path/posix";

import express from "express";
import Mongoose, { mongo } from "mongoose";
import multer from "multer";
import * as dotenv from "dotenv";

import { authRouter } from "./routes/authentication.routes";
import errorMiddleware from "./middleware/error.middleware";
import { testRouter } from "./routes/test.routes";
import helmet from "helmet";
import { postRouter } from "./routes/post.routes";
import { userRouter } from "./routes/user.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(helmet());

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.originalname.includes("post_image")) {
      cb(null, "images/post_images");
    } else {
      cb(null, "images/profile_images");
    }
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(multer({ storage: fileStorage }).single("image"));
// app.use("/images", express.static(path.join(__dirname, "images")));
// app.use("/images");

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "origin, X-Requested-With,Content-Type,Accept, Authorization"
    );

    res.header("Access-Control-Allow-Header", "Content-Type,Authorization");
    res.header("Content-Type", "application/json; charset=UTF-8");
    next();
  }
);

app.use("/test", testRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

app.use(errorMiddleware);

const MONGODB_URI = process.env.DB_CONNECTION_STRING as string;

Mongoose.connect(MONGODB_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`🌍 is listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
