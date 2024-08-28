import { Book } from "../models/book.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const listBook = async (req, res, next) => {
  try {
    const { title, author, genre, description, available } = req.body;
    if (!title || !author || !genre || !description) {
      return next(
        new ApiError("title, author, genre and description is required", 400)
      );
    }

    const isBookExist = await Book.findOne({
      title,
      author,
      owner: req.user._id,
    });
    if (isBookExist) {
      return next(new ApiError("This book already exist", 400));
    }

    const book = await Book.create({
      title,
      author,
      genre,
      description,
      owner: req.user._id,
      available,
    });

    const user = await User.findById(req.user._id);
    user.booksListed.push(book._id);
    await user.save();
    return res
      .status(201)
      .json(new ApiResponse(true, "Book listed successfully", book));
  } catch (error) {
    console.error("error in bookController listBook api", error.message);
    next(error);
  }
};

export const editBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { title, author, description, genre, available } = req.body;
    const book = await Book.findOneAndUpdate(
      { _id: bookId, owner: req.user._id },
      { title, description, genre, author, available },
      { new: true }
    );

    return res.status(200).json(new ApiResponse(true, "Book updated", book));
  } catch (error) {
    console.error("error in bookController editBook api", error.message);
    next(error);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findOneAndDelete({
      _id: bookId,
      owner: req.user._id,
    });
    if (!book) {
      return next(new ApiError("Book not found", 404));
    }

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { booksListed: bookId },
    });

    return res.status(200).json(new ApiResponse(true, "Book deleted!"));
  } catch (error) {
    console.error("error in bookController deleteBook api", error.message);
    next(error);
  }
};

export const getBookmatching = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("booksListed");
    const userBooks = user.booksListed;

    const allBooks = await Book.find({
      available: true,
      owner: { $ne: req.user._id },
    });

    const matches = allBooks.filter((book) => {
      return userBooks.some((userBook) => userBook.genre == book.genre);
    });

    return res
      .status(200)
      .json(new ApiResponse(true, "Matched book fetched", matches));
  } catch (error) {
    console.error("error in bookController getBookmatching api", error.message);
    next(error);
  }
};
