const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = 'http://localhost:5000';

/**
 * Task 6: Register a new user in the system
 * Route: POST /register
 * Logic:
 * 1. Extracts username and password from the request body.
 * 2. Validates that both fields are non-empty strings.
 * 3. Uses the isValid helper to verify the username does not already exist.
 * 4. Pushes the new user object into the users array and returns confirmation.
 */
public_users.post("/register", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered" });
});

/**
 * Task 1 & Task 10: Get the list of all books available in the shop
 * Route: GET /
 * Logic:
 * Resolves all available book objects formatted as neat JSON.
 */
public_users.get('/', function (req, res) {
  const getBooksPromise = new Promise((resolve, reject) => {
    resolve(books);
  });

  getBooksPromise
    .then((bookList) => {
      return res.status(200).send(JSON.stringify(bookList, null, 4));
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error retrieving book list", error: error.message });
    });
});

/**
 * Task 2 & Task 11: Get book details based on ISBN
 * Route: GET /isbn/:isbn
 * Logic:
 * 1. Extracts the isbn parameter from req.params.
 * 2. Checks if the ISBN key exists in the books database.
 * 3. Resolves the matched book object or rejects with a 404 error if not found.
 */
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const getBookByISBNPromise = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  });

  getBookByISBNPromise
    .then((book) => {
      return res.status(200).send(JSON.stringify(book, null, 4));
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});

/**
 * Task 3 & Task 12: Get book details based on Author
 * Route: GET /author/:author
 * Logic:
 * 1. Extracts the author parameter from req.params.
 * 2. Iterates through all book keys and filters books where the author matches (case-insensitive).
 * 3. Returns the dictionary of matched books, or 404 if no matching author exists.
 */
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  const getBooksByAuthorPromise = new Promise((resolve, reject) => {
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

  getBooksByAuthorPromise
    .then((result) => {
      return res.status(200).send(JSON.stringify(result, null, 4));
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});

/**
 * Task 4 & Task 13: Get all books based on Title
 * Route: GET /title/:title
 * Logic:
 * 1. Extracts the title parameter from req.params.
 * 2. Iterates through all book keys and filters books where the title matches (case-insensitive).
 * 3. Returns the dictionary of matched books, or 404 if no matching title exists.
 */
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  const getBooksByTitlePromise = new Promise((resolve, reject) => {
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

  getBooksByTitlePromise
    .then((result) => {
      return res.status(200).send(JSON.stringify(result, null, 4));
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});

/**
 * Task 5: Get book review based on ISBN
 * Route: GET /review/:isbn
 * Logic:
 * 1. Retrieves the book matching the given ISBN key.
 * 2. Returns its reviews object.
 */
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
// Demonstrates direct, efficient Axios calls without redundant Promise wrappers
// =============================================================================

/**
 * Task 10: Asynchronously get all books using Promise callback with Axios
 * Directly returns the Axios GET call promise for optimal efficiency and maintainability.
 */
function getAllBooks() {
  return axios.get(`${BASE_URL}/`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

/**
 * Task 11: Asynchronously get book details by ISBN using async/await with Axios
 * Directly awaits the Axios GET request using encodeURIComponent for clean parameter formatting.
 */
async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`${BASE_URL}/isbn/${encodeURIComponent(isbn)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Task 12: Asynchronously get book details by Author using async/await with Axios
 * Filters books matching the specified author via asynchronous Axios GET request.
 */
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Task 13: Asynchronously get book details by Title using async/await with Axios
 * Filters books matching the specified title via asynchronous Axios GET request.
 */
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
