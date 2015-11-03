/*
 * STUDY ROOMS
 * Developers: Manan Hora, Nina Bose
 * October 22nd, 2015
 */

/** TODO: UPDATE DESCRIPTION OF FILE
 */

// Code to import required pakages acquired from Philip Guo's
// University of Rochester CSC 210 Fall 2015 GitHub repository:
// https://github.com/pgbovine/csc210-fall-2015/blob/master/www/lectures-11-and-12/server.js
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.user(bodyParser.urlencoded({ extended: true}));


// CREATE a new user
app.post('/users', function (req, res) {
  var postBody = req.body;
  var myName = postBody.name;

  // must have a name!
  if (!myName) {
    res.send('ERROR');
    return; // return early!
  }

  // check if user's name is already in database; if so, send an error

  // otherwise add the user to the database by pushing (appending)
  // postBody to the fakeDatabase list

  res.send('OK');
});
