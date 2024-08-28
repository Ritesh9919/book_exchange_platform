import { Book } from "../models/book.model.js";
import { ExchangeRequest } from "../models/exchange.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const sendExchangeRequest = async (req, res, next) => {
  try {
    const { requestedBookId, offeredBookId } = req.body;
    const requestedBook = await Book.findById(requestedBookId);
    const offeredBook = await Book.findById(offeredBookId);
    if (!requestedBook || !offeredBook) {
      return next(new ApiError("Book not found", 404));
    }

    if (requestedBook.owner.equals(req.user._id)) {
      return next(new ApiError("Cannot request your own book'", 400));
    }

    const exchangeRequest = await ExchangeRequest.create({
      requestedBook: requestedBookId,
      offeredBook: offeredBookId,
      requester: req.user._id,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          true,
          "Request for exchange book created",
          exchangeRequest
        )
      );
  } catch (error) {
    console.error(
      "error in exchangeController sendExchangeRequest api",
      error.message
    );
    next(error);
  }
};

export const getIncomingExchangeRequest = async (req, res, next) => {
  try {
    const incomingExchangeRequests = await ExchangeRequest.find({
      requestedBook: { $in: req.user.booksListed },
    })
      .populate("requester")
      .populate("requestedBook")
      .populate("offeredBook");

    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          "Incomming exchange request fetched successfully",
          incomingExchangeRequests
        )
      );
  } catch (error) {
    console.error(
      "error in exchangeController getIncomingExchangeRequest api",
      error.message
    );
    next(error);
  }
};

export const getOutgoingExchangeRequest = async (req, res, next) => {
  try {
    const outgoingExchangeRequests = await ExchangeRequest.find({
      requester: req.user.userId,
    })
      .populate("requestedBook")
      .populate("offeredBook");

    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          "Outgoing exchange request fetched successfully",
          outgoingExchangeRequests
        )
      );
  } catch (error) {
    console.error(
      "error in exchangeController getOutgoingE api",
      error.message
    );
    next(error);
  }
};

export const respondToExchangeRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return next(new ApiError("Invalid status", 400));
    }

    const exchangeRequest = await ExchangeRequest.findById(id)
      .populate("requestedBook")
      .populate("offeredBook");

    if (!exchangeRequest) {
      return next(new ApiError("Exchange request not found", 404));
    }

    if (!exchangeRequest.requestedBook.owner.equals(req.user.userId)) {
      return next(new ApiError("Unauthorized", 401));
    }

    exchangeRequest.status = status;
    if (status === "accepted") {
      exchangeRequest.requestedBook.available = false;
      exchangeRequest.offeredBook.available = false;

      await exchangeRequest.requestedBook.save();
      await exchangeRequest.offeredBook.save();
    }

    await exchangeRequest.save();

    return res
      .status(200)
      .json(new ApiResponse(true, "exchange request toggled", exchangeRequest));
  } catch (error) {
    console.error("error in exchangeController respondToExchangeRequest api");
    next(error);
  }
};
