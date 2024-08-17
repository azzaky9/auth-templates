import express from "express";
import {
  createOrderController,
  deleteOrderController,
  getOrdersController,
  getPagebasedOnShopName,
  getPageOrder,
  updateOrderController,
  getOrderByIdController,
  queryOrder
} from "@controller/order.controller";

const router = express.Router();

router.post("/order", createOrderController);

router.put("/order/:id", updateOrderController);

router.get("/order", getOrdersController);

router.get("/order/:id", getOrderByIdController);

router.get("/order/page/:index", getPageOrder);

router.get("/order/search/:customerName", queryOrder)

router.get("/order/page-shop/:name/:index", getPagebasedOnShopName);

router.delete("/order/:id", deleteOrderController);

export default router;
