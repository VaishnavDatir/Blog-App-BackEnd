import Router from "express";
import HttpException from "../exceptions/error.exception";
import isAuth from "../middleware/is_auth.middleware";

const testRouter = Router();

testRouter.get("/servercheck", (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Server is working",
  });
});

export { testRouter };
