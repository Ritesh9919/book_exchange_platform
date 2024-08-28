import express from "express";
const router = express.Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  sendExchangeRequest,
  getIncomingExchangeRequest,
  getOutgoingExchangeRequest,
  respondToExchangeRequest,
} from "../controllers/exchange.controller.js";

router.post("/", verifyJWT, sendExchangeRequest);
router.get("/incoming", verifyJWT, getIncomingExchangeRequest);
router.get("/outgoing", verifyJWT, getOutgoingExchangeRequest);
router.put("/:id/respond", verifyJWT, respondToExchangeRequest);

export default router;
