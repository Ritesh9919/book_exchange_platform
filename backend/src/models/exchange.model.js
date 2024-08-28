import mongoose from "mongoose";

const exchangeRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    requestedBook: {
      type: mongoose.Types.ObjectId,
      ref: "Book",
    },
    offeredBook: {
      type: mongoose.Types.ObjectId,
      ref: "Book",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const ExchangeRequest = mongoose.model(
  "ExchangeRequest",
  exchangeRequestSchema
);
