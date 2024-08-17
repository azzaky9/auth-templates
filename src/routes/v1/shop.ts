import express from "express";
import {
  createShopController,
  getShopController
} from "@controller/shop.controller";

const router = express.Router();

router.post("/shop", createShopController);

router.get("/shop", getShopController);

export default router;
