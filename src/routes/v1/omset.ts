import { getOmsetController } from "@controller/omset.controller";
import { Router } from "express";

const router = Router();

router.get("/omset", getOmsetController);

export default router;
