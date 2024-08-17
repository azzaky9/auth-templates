import express from "express";
import userRouter from "@route/v1/user";

const router = express.Router();

router.use(userRouter);

export default router;
