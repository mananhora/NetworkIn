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
var cookie = require('cookie');
var cookieParser = require('cookie-parser')
var pg = require('pg');
var connString = "postgres://postgres:postgres@localhost:5432/personalcrm";
var client = new pg.Client(connString);
client.connect();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser());
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
  console.log("Cookies: ", req.cookies);
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
          res.cookie('user', result.rows[0].userid, {
            httpOnly: false
          });
          // console.log("InAPPMyCookie: ", res.cookie);
          res.send(result.rows[0]);
        }
      });
    } else {
      res.send("Invalid email. Please try again.")
    }
  });
});


//GET NAME
app.post('/users/getUser', function(req, res) {
  console.log("Getting User.");

  var postBody = req.body;
  var userId = postBody.user;

  console.log("GetUser: UserId == " + userId);
  client.query('SELECT * FROM users WHERE userid=($1)', [userId], function(err, result) {
    if (err) {
      return console.error("error in getUser", err);
    } else {
      res.send(result.rows[0].name);
    }
  })
});


//UPDATE NAME
app.post('/users/updateName', function(req, res) {
  console.log("UPDATING NAME");

  var postBody = req.body;
  var myName = postBody.name;
  var myUserId = postBody.user;


  client.query('UPDATE users SET name=($1) WHERE userid=($2)', [myName, myUserId], function(moreErr, result) {
    if (moreErr) {
      res.send("There was an error: " + moreErr);
    } else {
      client.query('SELECT * FROM users WHERE userid=($1)', [myUserId], function(err, result) {
        if (err) {
          return console.error('error running query', err);
        } else {
          res.send(result.rows[0].name);
        }
      });
    }
  });
});


//ADD MEMBER TO NETWORK
app.post('/addMember', function(req, res) {
  var postBody = req.body;
  var membername = postBody.membername;
  var memberemail = postBody.memberemail;
  var tag1 = postBody.tag1;
  var tag2 = postBody.tag2;
  var userid = postBody.user;


  client.query('INSERT INTO connections (membername, memberemail, userid, tag1, tag2) VALUES ($1, $2, $3, $4, $5)', [membername, memberemail, userid, tag1, tag2]);
  console.log("hehllo");



});


//GET ALL MEMBERS FROM NETWORK
app.post('/getMembers', function(req, res) {


  var userid = req.body.user;
        client.query('SELECT * FROM connections WHERE userid = ($1)', [userid], function(moreErr, result2) {
        if (moreErr) {
          res.send("THEre was an error " + moreErr);
        } else {
          res.send(result2.rows);
        }




  });

});


//SEARCH MEMBERS FROM NETWORK
app.post('/searchMembers', function(req, res){
  console.log("Search members");
  var postBody = req.body;
  var userid = postBody.user;
  var name = postBody.name;
  var tagone = postBody.tagone;
  var tagtwo = postBody.tagtwo;
  console.log(name+" "+tagone + " "+tagtwo);

  //NAME
  // if(postBody.name!='' && postBody.tag1==''){
  //   console.log("SEARCHING NAME");
  //   var name = postBody.name;
  //   //NAME
  //   client.query("SELECT * FROM connections WHERE userid = ($1) AND name = ($2)", [userid, name], function(err,result){
  //     if(err){
  //       res.send("Error "+err);
  //     }
  //     else{
  //       res.send(result.rows);
  //     }
  //   });
  // }

  //TAG1
  // if(postBody.name=='' && postBody.tag1!=''){
  //   console.log("Searching tag1");
  //   var tag1 = postBody.tag1;
  //   client.query("SELECT * FROM connections WHERE userid = ($1) AND tag1=($2)", [userid, tag1], function(err, result){
  //     if(err){
  //       res.send("There was an error "+err);
  //     }
  //     else{
  //       console.log("sending results");
  //       console.log(result);
  //       res.send(result.rows);
  //       console.log("ehll");
  //     }
  //     console.log("almost done");
  //   });
  //   console.log("done");
  // }

  //TAG1 AND TAG2
  // if(postBody.name=='' && postBody.tag1!='' && postBody.tag2!=''){
  //   console.log("SEARCING TAG 1 and tag2");
  //   var tag1 = postBody.tag1;
  //   var tag2 = postBody.tag2;
  //   client.query("SELECT * FROM connections WHERE userid = ($1) AND tag1=($2) AND tag2=($3)", [userid, tag1, tag2], function(err, result){
  //     if(err){
  //       res.send("There was an error "+err);
  //     }
  //     else{
  //       res.send(result.rows);
  //     }
  //   });
  // }

  //NAME AND TAG1
  // if(postBody.name!='' && postBody.tag1!=''){
  //   console.log("SEARCHING NAME AND TAG1");
  //   var name = postBody.name;
  //   var tag1 = postBody.tag1;
  //   client.query("SELECT * FROM connections WHERE userid = ($1) AND tag1=($2) AND name=($3)", [userid, tag1, name], function(err, result){
  //     if(err){
  //       res.send("There was an error "+err);
  //     }
  //     else{
  //       res.send(result.rows);
  //     }
  //   });
  // }

  //NAME AND TAG1 AND TAG2
  //if(postBody.name!=''&& postBody.tag1!='' && postBody.tag2!='' )
    console.log("SEARCHIG NAME AND TAG1 and TAG2");

    client.query("SELECT * FROM connections WHERE userid = ($1) AND tag1=($2) AND membername=($3) AND tag2=($4)", [userid, tagone, name, tagtwo], function(err, result){
      if(err){
        console.log("ERRROR"+ err);
        res.send(err);
      }
      else{
        console.log(result);
        res.send(result.rows);
      }
    });


  console.log("done");

});

























var server = app.listen(3000, function() {
  var port = server.address().port;
  console.log('Server started at http://localhost:%s/', port);
});
