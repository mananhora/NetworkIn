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


var pg = require('pg');
var connString = "postgres://postgres:postgres@localhost:5432/personalcrm";

var client = new pg.Client(connString);
client.connect();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


app.use(express.static('../client'));


app.get('/users/*', function (req, res) {
  console.log('hello');
  var getBody = req.body;
  var email = getBody.email;
  var password = getBody.password;
  res.send('{}');
  // res.render('index', {});
});


// CREATE a new user
app.post('/users/*', function (req, res) {
  console.log('In correct method');
  var postBody = req.body;
  var myName = postBody.name;

  pg.connect(connString, function(err, client, done) {
    if(err) response.send("Could not connect to DB: " + err);
    client.query('INSERT INTO users (user_id) VALUES ($1)',
        [myName]);

    res.send('OK');
});

  // must have a name!
  // if (!myName) {
  //   res.send('ERROR');
  //   return; // return early!
  // }

  // check if user's name is already in database; if so, send an error
  // client.query("INSERT ")

  // otherwise add the user to the database by pushing (appending)
  // postBody to the fakeDatabase list


});

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Server started at http://localhost:%s/', port);
});
