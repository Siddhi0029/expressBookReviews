const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
});

// Task 1 & Task 10: Get the book list available in the shop using Promise callbacks / async-await
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  });

  getBooks
    .then((bookList) => {
      return res.status(200).send(JSON.stringify(bookList, null, 4));
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error fetching books", error: error.message });
    });
});

// Task 2 & Task 11: Get book details based on ISBN using Promise callbacks / async-await
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  });

  getBookByISBN
    .then((book) => {
      return res.status(200).send(JSON.stringify(book, null, 4));
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});

// Task 3 & Task 12: Get book details based on author using Promise callbacks / async-await
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  const getBooksByAuthor = new Promise((resolve, reject) => {
    let matchedBooks = {};
    const keys = Object.keys(books);
    keys.forEach((key) => {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        matchedBooks[key] = books[key];
      }
    });

    if (Object.keys(matchedBooks).length > 0) {
      resolve(matchedBooks);
    } else {
      reject({ status: 404, message: "No books found by this author" });
    }
  });

  getBooksByAuthor
    .then((result) => {
      return res.status(200).send(JSON.stringify(result, null, 4));
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});

// Task 4 & Task 13: Get all books based on title using Promise callbacks / async-await
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  const getBooksByTitle = new Promise((resolve, reject) => {
    let matchedBooks = {};
    const keys = Object.keys(books);
    keys.forEach((key) => {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        matchedBooks[key] = books[key];
      }
    });

    if (Object.keys(matchedBooks).length > 0) {
      resolve(matchedBooks);
    } else {
      reject({ status: 404, message: "No books found with this title" });
    }
  });

  getBooksByTitle
    .then((result) => {
      return res.status(200).send(JSON.stringify(result, null, 4));
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});

// Task 5: Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// =============================================================================
// Asynchronous Axios implementations for Tasks 10-13 (Promise / Async-Await)
// =============================================================================

const BASE_URL = 'http://localhost:5000';

// Task 10: Get all books using Promise with Axios
const getAllBooksAsync = () => {
  return new Promise((resolve, reject) => {
    axios.get(`${BASE_URL}/`)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
};

// Task 11: Get book by ISBN using Async-Await with Axios
const getBookByISBNAsync = async (isbn) => {
  try {
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Task 12: Get books by Author using Async-Await with Axios
const getBooksByAuthorAsync = async (author) => {
  try {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Task 13: Get books by Title using Async-Await with Axios
const getBooksByTitleAsync = async (title) => {
  try {
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports.general = public_users;
module.exports.getAllBooksAsync = getAllBooksAsync;
module.exports.getBookByISBNAsync = getBookByISBNAsync;
module.exports.getBooksByAuthorAsync = getBooksByAuthorAsync;
module.exports.getBooksByTitleAsync = getBooksByTitleAsync;
