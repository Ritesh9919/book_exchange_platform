import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.route.js";
import bookRouter from "./routes/book.route.js";
import exchangeRouter from "./routes/exchange.route.js";

import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorHandlerMiddleware } from "./middlewares/error_handler.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.put("/", async (req, res) => {
  res.send("Hello World");
});

app.use("/api/auth", authRouter);
app.use("/api/books", bookRouter);
app.use("/api/exchange-requests", exchangeRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export { app };
