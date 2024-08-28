import express from "express";
const router = express.Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  listBook,
  editBook,
  deleteBook,
  getBookmatching,
} from "../controllers/book.controller.js";

router.post("/", verifyJWT, listBook);
router.put("/:bookId", verifyJWT, editBook);
router.delete("/:bookId", verifyJWT, deleteBook);
router.get("/matches", verifyJWT, getBookmatching);

export default router;
