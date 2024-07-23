const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username, password)) {
      users.push({ username, password });
      return res
        .status(200)
        .json({ message: 'User registered successfully, proceed to login' });
    } else {
      return res.status(300).json({ message: 'Username already exists' });
    }
  } else {
    return res.status(300).json({ message: 'Credentials not provided' });
  }
  //Write your code here
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  return res.status(200).json({ books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  try {
    const filterPromise = await new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve({ [isbn]: book });
      } else {
        reject(new Error('Book not found'));
      }
    });
    return res.status(200).json(filterPromise);
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const author = req.params.author;
  let filterBook = [];
  const filterPromise = new Promise((resolve, reject) => {
    for (key in books) {
      if (books[key]['author'] === author) {
        filterBook.push({
          isbn: key,
          title: books[key]['title'],
          reviews: books[key]['reviews'],
        });
      }
    }
    if (filterBook.length === 0) {
      reject(new Error('Book not found'));
    } else {
      resolve({ booksByAuthor: filterBook });
    }
  });
  filterPromise
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((e) => {
      return res.status(401).json({ message: e.message });
    });
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  const title = req.params.title;
  let filterBook = [];
  const filterPromise = new Promise((resolve, reject) => {
    for (key in books) {
      if (books[key]['title'] === title) {
        filterBook.push({
          isbn: key,
          author: books[key]['author'],
          reviews: books[key]['reviews'],
        });
      }
    }
    if (filterBook.length > 0) {
      resolve({ 'Books by title': filterBook });
    } else {
      reject(new Error('Book not found'));
    }
  });
  filterPromise
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((e) => {
      return res.status(401).json({ message: e.message });
    });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json({ reviews: books[isbn]['reviews'] });
  } else {
    return res.status(401).json({ message: 'Book not found' });
  }
});

module.exports.general = public_users;
