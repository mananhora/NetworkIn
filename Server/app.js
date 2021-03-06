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
// var cytoscape = require('cytoscape');
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
    client.query('SELECT exists (SELECT 1 FROM users WHERE email=($1) AND active=($2))', [myEmail, true], function(moreErr, result) {
      if (moreErr) {
        res.send("ERROR");
      } else if (!result.rows[0].exists) {
        client.query('INSERT INTO users (name,email,password,active) VALUES ($1,$2,$3,$4)', [myName, myEmail, myPassword, true]);
        res.send('OK');
      } else {
        res.send('ERROR');
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
  client.query('SELECT exists (SELECT 1 FROM users WHERE email=($1) AND active=($2))', [myEmail, true], function(moreErr, result) {
    if (moreErr) {
      res.send("Oops! Something went wrong. Please try again.");
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
      console.log("YAYAY");
      console.log(result.rows);
      console.log("sf");
      console.log(result.rows[0].name);
      res.send(result.rows[0].name);
    }
  })
});


//DELETE USER
app.post('/users/deleteUser', function(req, res) {
  console.log("Deleting User.");
  var postBody = req.body;
  var userId = postBody.user;
  client.query('UPDATE users SET active=($1) WHERE userid=($2)', [false, userId], function(err, result) {
    if (err) {
      return console.error("error in DeleteUser", err);
    }
    else {
      res.send("Deleted");
    }
  })
});

//DELETE MEMBER
app.post('/users/deleteMember', function(req, res) {
  console.log("Deleting Membebr.");
  var postBody = req.body;
  var memberId = postBody.member;
  client.query('DELETE FROM connections WHERE memberid=($1)', [memberId], function(err, result) {
    if (err) {
      return console.error("error in DeleteMember", err);
    }
    else {
      res.send("Deleted");
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
  console.log("ADDING MEMEMBER");
  var postBody = req.body;
  var membername = postBody.membername;
  var memberemail = postBody.memberemail;
  var taglist = postBody.taglist;
  var userid = postBody.user;
  var groupid = postBody.groupid;
  client.query('INSERT INTO connections (membername, memberemail, userid, taglist, groupid) VALUES ($1, $2, $3, $4, $5)', [membername, memberemail, userid, taglist, groupid], function(err) {
    if (err) {
      console.log("Could not add member to network");
    } else {
      res.send("successfully added");
    }
  });

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


//ADD GROUP
app.post('/users/addGroups', function(req, res) {
  var userid = req.body.user;
  var group = req.body.groupName;
  client.query('INSERT INTO groups (userid, group_name) VALUES ($1, $2)', [userid, group], function(err) {
    if (err) {
      console.log("Could not add group.");
    } else {
      res.send("New group created!");
    }
  })
});

//DELETE GROUP
app.post('/users/deleteGroup', function(req, res){
  console.log("DELETE GROUPS ");
  var userid = req.body.userid;
  var groupid = req.body.groupid;
  groupid = JSON.parse(groupid);
  userid = JSON.parse(userid);
  console.log(groupid);
  console.log(userid);
  client.query("DELETE * FROM connections WHERE groupid=($1) AND userid=($2)", [groupid, userid], function(err, result){
    if(err){
      console.log("cant delete connections..");
    }
    else{
      console.log("deleted connections..");
    }
  });
  client.query("DELETE FROM groups WHERE groupid=($1)", [groupid], function(err, result){
    //console.log(result.rows.length);
    console.log("query");
    if(err){
      console.log("Not able to delete group..");
    }
    else{
      console.log("GROUP DELETED");
      res.send("Group Deleted");
    }
  });
});

//ADD TO GROUP
app.post('/users/addToGroup', function(req, res) {
  var userid = req.body.user;
  var group = req.body.groupName;
  var member = req.body.memberName;
  console.log("\t\tuserid == " + userid + " group == " + group);
  client.query("SELECT groupid FROM groups WHERE userid=($1) AND group_name=($2)", [userid, group], function(err, result) {
    if (err) {
      console.log("Not added to group successfully.");
    } else {
      var groupid = result.rows[0].groupid;
      console.log("\t\tgroupid == " + groupid);
      client.query("INSERT INTO group_members (groupid, member) VALUES ($1, $2)", [groupid, member], function(err) {
        if (err) {
          console.error("Mistake in inserting new member into group!");
        } else {
          res.send("Member added successfully!");
        }
      })
    }
  })

});


//SEARCH MEMBERS FROM NETWORK
app.post('/searchMembers', function(req, res) {
  console.log("Search members");
  var postBody = req.body;
  var userid = postBody.user;
  var name = postBody.name;
  var tagone = postBody.tagone;
  var tagtwo = postBody.tagtwo;
  var tagthree = postBody.tagthree;
  console.log(name);
  console.log(tagone);
  console.log(tagtwo);


  //  var groupid = postBody.groupid;

  //JUST NAME
  if ((postBody.name != '' && postBody.name != null) && (tagone == null || tagone == '' || tagone.length == 0)) {
    console.log("SEARCHING NAME");
    //var name = postBody.name;
    console.log(name);
    //NAME
    client.query("SELECT * FROM connections WHERE userid = ($1) AND membername = ($2)", [userid, name], function(err, result) {
      if (err) {
        res.send("Error " + err);
      } else {
        console.log("RESULT");
        if (result.rows.length == 0) {
          console.log("0");
          res.send("0");
          return;
        } else {
          console.log("result");
          res.send(result.rows);
          return;
        }
      }
    });
  }


  //JUST Tag1
  if ((postBody.name == '' || postBody.name == null || postBody.name == "") && tagone != null && tagone != '' && (tagtwo==null || tagtwo=='')) {
    console.log("Searching tagone");
    console.log(tagone);
    client.query("SELECT * FROM connections WHERE userid = ($1)", [userid], function(err, result) {
      var searchresults = [];
      if (err) {
        res.send("There was an ERROR  " + err);
      } else {
        var connlist = [];
        console.log("result  "+result.rows);
        for (var i = 0; i < result.rows.length; i++) {
          console.log("ff");
          connlist.push(result.rows[i]);
        }
        console.log(connlist);

        for (var i = 0; i < connlist.length; i++) {
          console.log(connlist[i].taglist);
          var connlists = JSON.stringify(connlist);
          var taglists = connlist[i].taglist;
          if (taglists == null || taglists.length == 0 || taglists == '') {
            i++;
          }
          if (taglists != null) {
            if (searchTagList(taglists, tagone)) {
              searchresults.push(connlist[i]);
            }
          }
        }
        if (searchresults.length == 0) {
          console.log("NOT FOUND");
          res.send("0");
          return;
        } else {
          res.send(searchresults);
          return;
        }
      }
    });

    //NAME AND TAG1

    //TAG1 and TAG2

    //NAME AND TAG1 AND TAG2

    //TAG1 TAG2 TAG3

    //NAME AND TAG1 TAG2 AND TAG3
    console.log("done");

  }


  //Tag1 and Tag2
  if ((name == '' || name == null || name == "") && (tagone != null && tagone != '' && tagtwo!=null && tagtwo!='')){
    console.log("Searching tagone and tagtwo");
    console.log(tagone+'  '+tagtwo);

    client.query("SELECT * FROM connections WHERE userid = ($1)", [userid], function(err, result) {
      var searchresults = [];
      if (err) {
        res.send("There was an ERROR  " + err);
      } else {
        var connlist = [];
        console.log("result  "+result.rows);
        for (var i = 0; i < result.rows.length; i++) {
          console.log("ff");
          connlist.push(result.rows[i]);
        }
        console.log(connlist);

        for (var i = 0; i < connlist.length; i++) {
          console.log(connlist[i].taglist);
          var connlists = JSON.stringify(connlist);
          var taglists = connlist[i].taglist;
          if (taglists == null || taglists.length == 0 || taglists == '') {
            i++;
          }
          if (taglists != null) {
            if (searchTagList(taglists, tagone)) {
              if(searchTagList(taglists, tagtwo))
              searchresults.push(connlist[i]);
            }
          }
        }
        if (searchresults.length == 0) {
          console.log("NOT FOUND");
          res.send("0");
          return;
        } else {
          res.send(searchresults);
          return;
        }
      }

  });
  }


    //Name and Tag1 and Tag
    if ( (tagone != null && tagone != '' && tagtwo!=null && tagtwo!='')){
    console.log("tagone and tagtwo");
    if(name!==null && name!==''){
    console.log("Searching tagone and tagtwo and name");
    console.log(tagone+'  '+tagtwo);

    client.query("SELECT * FROM connections WHERE userid = ($1) AND membername = ($2)", [userid, name], function(err, result) {
      var searchresults = [];
      if (err) {
        res.send("There was an ERROR  " + err);
      } else {
        var connlist = [];
        console.log("result  "+result.rows);
        for (var i = 0; i < result.rows.length; i++) {
          connlist.push(result.rows[i]);
        }
        console.log(connlist);

        for (var i = 0; i < connlist.length; i++) {
          console.log(connlist[i].taglist);
          var connlists = JSON.stringify(connlist);
          var taglists = connlist[i].taglist;
          if (taglists == null || taglists.length == 0 || taglists == '') {
            i++;
          }
          if (taglists != null) {
            if (searchTagList(taglists, tagone)) {
              if(searchTagList(taglists, tagtwo))
              searchresults.push(connlist[i]);
            }
          }
        }
        if (searchresults.length == 0) {
          console.log("NOT FOUND");
          res.send("0");
          return;
        } else {
          res.send(searchresults);
          return;
        }
      }
    });

  }
  }
  });


//GET ALL THE GROUPS OF A USER
app.post('/users/getGroups', function(req, res){
  var postBody = req.body;
  var userid = postBody.userid;
  console.log(userid);

  client.query("SELECT * FROM groups WHERE userid = ($1)", [userid], function(err, result){
    if(err){
      res.send("0");
    }
    else{
      //console.log("RESULT   "+result);
      //result = JSON.parse(result);
      //console.log(result.rows);
      res.send(result.rows);
      console.log(result.rows);
      for(var i = 0; i<result.rows.length; i++){
        console.log(result.rows[i].group_name);

      }
    }
  });
});


//SEARCH TAG LIST FOR tagone
function searchTagList(taglist, tagone) {
  //write function to search through taglist (listof strings) to check if it contains tag one

  for (var i = 0; i < taglist.length; i++) {
    if (taglist[i] == tagone) {
      return true;
    }
  }
  return false;
}


//GET ALL TAGS DEFINED BY USER
app.post('/users/getTags', function(req, res){
  var postBody = req.body;
  var userid = postBody.userid;
  var taglist = [];
  console.log(userid);

  client.query('SELECT * FROM connections WHERE userid = ($1)', [userid], function(err, result){
    if(err){
      console.log(err+" ERROR!!!");
      res.send("0");
    }
    else{
      console.log("GET TAGS        ");
      console.log("fdfkjdhkjf");
      // console.log(result);
      // console.log(result.rows);
      // console.log(result.rows.length);
      // console.log(result);
      // console.log(result.rows);

      var connlists = JSON.stringify(result.rows);


      res.send(connlists);
      // for(var i = 0; i<result.rows.length; i++){
      //   // console.log("hui");
      //   // console.log(result.rows[i].taglist);
      //   var list = result.rows[i].taglist;
      //   list = JSON.stringify(list);
      //   list = JSON.parse(list);
      //   //list = JSON.parselist);
      //   console.log(list);
      //   //console.log(list.length);
      // //  console.log(list.length);
      //
      //   // for(var j = 0; j<list.length; i++){
      //   //   if(!taglist.contains(list[j])){
      //   //     taglist.push(list[j]);
      //   //     console.log(list[j]);
      //   //   }
      //   // }
      // }

    }
  });
});

app.post('/users/getGroupById', function(req, res){
 var postBody = req.body;
 var groupid = postBody.groupid;
 var userid = postBody.userid;

 client.query("SELECT * FROM connections WHERE groupid = ($1) AND userid=($2)", [groupid, userid], function(err, result){
   if(err){
     res.send("0");
   }
   else{
     res.send(result.rows);
   }
 });

});

var server = app.listen(3000, function() {
  var port = server.address().port;
  console.log('Server started at http://localhost:%s/', port);
});
