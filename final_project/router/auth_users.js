const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const user = users.find((user) => {
    return username === user.username;
  });
  if (user) {
    return false;
  } else {
    return true;
  }
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  const user = users.find((user) => {
    return username === user.username && password === user.password;
  });
  if (user) {
    return true;
  } else {
    return false;
  }
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(403).json({ message: 'Credentials not provided' });
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken: token };
    return res.status(200).json({ message: 'Login successful' });
  } else {
    return res.status(300).json({ message: 'Invalid Login Credentials' });
  }
  //Write your code here
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const user = req.user;
  const review = req.query.review;
  if (books[isbn]) {
    books[isbn]['reviews'][user.username] = review;
    return res.status(200).json({
      message: `Review added/updated successfully for book with ISBN ${isbn}`,
    });
  } else if (!review) {
    return res.status(401).json({ message: 'Review not provided' });
  } else {
    return res.status(401).json({ message: 'Book not found' });
  }
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const user = req.user;
  if (books[isbn]) {
    if (books[isbn]['reviews'][user.username]) {
      delete books[isbn]['reviews'][user.username];
      return res.status(200).json({
        message: `Review by ${user.username} deleted successfully for book with ISBN ${isbn}`,
      });
    } else {
      return res.status(401).json({ message: 'Review not found' });
    }
  } else {
    return res.status(401).json({ message: 'Book not found' });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
