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
  res.send('{}');
  // res.render('index', {});
});


// CREATE a new user
app.post('/register/*', function (req, res) {
  var postBody = req.body;
  var myName = postBody.name;
  var myEmail = postBody.email;
  var myPassword = postBody.password;


  pg.connect(connString, function(err, client, done) {
    if(err) response.send("Could not connect to DB: " + err);
    client.query('INSERT INTO users (name,email,password) VALUES ($1,$2,$3)',
        [myName,myEmail,myPassword]);


    res.send('OK');
});

});

app.post('/users/*', function(req, res) {
  var postBody = req.body;
  var myEmail = postBody.email;
  var myPassword = postBody.password;

  client.query('SELECT * FROM users WHERE email=($1)', [myEmail], function(moreErr, result) {

    if(moreErr) { response.send("There was an error: " + moreErr); }
    if(result.rows[0].password != myPassword) {
      console.log("here.");
      res.send("Incorrect password."); }

    var userInformation = [result.rows[0].name, result.rows[0].password, result.rows[0].email];

    res.send(userInformation);
  // }
  // res.send("Incorrect Password.");

  });

});

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Server started at http://localhost:%s/', port);
});
