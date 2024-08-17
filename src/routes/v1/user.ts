import express from "express";
import {
  createUserController,
  updateUserController,
  deleteUserController,
  getUsersController,
  getUserProfileController
} from "@controller/user.controller";

const router = express.Router();

router.get("/user", getUsersController);

router.get("/user/profile/:id", getUserProfileController);

router.post("/user", createUserController);

router.put("/user/:id", updateUserController);

router.delete("/user/:id", deleteUserController);

export default router;
