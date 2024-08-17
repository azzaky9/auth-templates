import express from "express";
import userRouter from "@route/v1/user";
import orderRouter from "@route/v1/order";
import shopRouter from "@route/v1/shop";
import omsetRouter from "@route/v1/omset";

const router = express.Router();

router.use(userRouter);

router.use(orderRouter);

router.use(shopRouter);

router.use(omsetRouter);

export default router;
