/*
 * PersonalCRM
 * Developers: Nina Bose, Manan Hora
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
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(express.static('../client'));


app.get('/users/*', function(req, res) {
  console.log('hello');
  res.send('{}');
});


//REGISTER NEW USER
app.post('/register/*', function(req, res) {
  var postBody = req.body;
  var myName = postBody.name;
  var myEmail = postBody.email;
  var myPassword = postBody.password;


  pg.connect(connString, function(err, client, done) {
    if (err) response.send("Could not connect to DB: " + err);
    client.query('SELECT exists (SELECT 1 FROM users WHERE email=($1))', [myEmail], function(moreErr, result) {
      if (moreErr) {
        res.send("Oops! Something went wrong. Please try again.");
      } else if (!result.rows[0].exists) {
        client.query('INSERT INTO users (name,email,password) VALUES ($1,$2,$3)', [myName, myEmail, myPassword]);


        res.send('OK');
      } else {
        res.send('That email has already been taken. Please try another.');
      }
    });

  });

});


//LOGIN USER
app.post('/users/login', function(req, res) {
  var postBody = req.body;
  var myEmail = postBody.email;
  var myPassword = postBody.password;
  client.query('SELECT exists (SELECT 1 FROM users WHERE email=($1))', [myEmail], function(moreErr, result) {
    if (moreErr) {
      response.send("Oops! Something went wrong. Please try again.");
    } else if (result.rows[0].exists) {
      client.query('SELECT * FROM users WHERE email=($1)', [myEmail], function(moreErr, result) {

        if (moreErr) {
          response.send("There was an error: " + moreErr);
        }
        if (result.rows[0].password != myPassword) {
          res.send("Incorrect password.");
        } else {
          res.send(result.rows[0]);
        }
      });
    } else {
      res.send("Invalid email. Please try again.")
    }
  });
});


//UPDATE NAME
app.post('/users/updateName', function(req, res){
  console.log("UPDATING NAME");

  var postBody = req.body;
  var myName = postBody.name;
  var myEmail = postBody.email;
  var myPassword = postBody.password;


  client.query('UPDATE users SET name=($1) WHERE email=($2) AND password = ($3)', [myName, myEmail, myPassword], function(moreErr, result){
    if (moreErr) {
      res.send("There was an error: " + moreErr);
    }
    else{
      client.query('SELECT * FROM users WHERE email=($1) AND password=($2)', [myEmail, myPassword], function(err, result) {
          if(err) {
            return console.error('error running query', err);
          }
          else{
            res.send(result.rows[0].name);
          }
        });
      }
  });
});





// app.post('/addMember', function(req, res){
//   var postBody = req.body;
//   var membername = postBody.membername;
//   var memberemail = postBody.memberemail;
//   var myEmail = postBody.useremail;
//   var myPassword = postBody.userpassword;
//   var user = client.query('SELECT exists (SELECT 1 FROM users WHERE email=($1) AND password=($2))', [myEmail, myPassword], function(moreErr, result) {
//     if (moreErr) {
//       response.send("There was an error: " + moreErr);
//     }
//     else{
//       return result.rows[0];
//     }
// });


//ADD MEMBER TO NETWORK
app.post('/addMember', function(req, res){
  var postBody = req.body;
  var membername = postBody.membername;
  var memberemail = postBody.memberemail;
  var myEmail = postBody.useremail;
  var myPassword = postBody.userpassword;
  var user = client.query('SELECT exists (SELECT 1 FROM users WHERE email=($1) AND password=($2))', [myEmail, myPassword], function(moreErr, result) {
    if (moreErr) {
      response.send("There was an error: " + moreErr);
    }
    else{
      return result.rows[0];
    }
});
//var userID = user.UserID;
//console.log(userID);
console.log("fdf");
  client.query('INSERT INTO connections (membername, userid, memberid) VALUES ($1, 8, 2)', [membername]);
  console.log("hehllo");

});

var server = app.listen(3000, function() {
  var port = server.address().port;
  console.log('Server started at http://localhost:%s/', port);
});
