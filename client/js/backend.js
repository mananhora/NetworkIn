var name;
var myEmail;
var myPassword;
var selectedgroup;

// GET COOKIE
function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else {
    begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
      end = dc.length;
    }
  }
  return unescape(dc.substring(begin + prefix.length, end));
}

//GET LIST OF ALL PEOPLE  in NETWORK
function getListOfMembers() {
  $("#viewlist").text(" ");
  $("#viewlist").append("<br>");

  var myUserId = getCookie("user");
  var list = [];
  $.ajax({
    url: "getMembers",
    type: "POST",
    dataType: "text",

    data: {
      user: myUserId
    },

    success: function(result) {
      list = result;
      list = JSON.parse(list);
      console.log(list.length);

      for (var i = 0; i < list.length; i++) {
        console.log(list[i].membername);
        $("#viewlist").append(list[i].membername);
        $("#viewlist").append("<br>");
      }
      console.log(list);
    }

  });
};

//Function to parse tags for adding members
function parseAddTags() {
  var taglist = [];
  var tags = $("#addtags").val();
  var previous = 0;
  for (var i = 0; i < tags.length; i++) {
    var a = tags.charAt(i);
    if (a == ",") {
      var word = tags.substring(previous, i);
      previous = i + 1;
      console.log(word);
      taglist.push(word);
    }
    if (i == tags.length - 1) {
      var word = tags.substring(previous, i + 1);
      taglist.push(word);
    }
  }
  return taglist;

};

//Function to parse tags for search
function parseSearchTags() {
  var taglist = [];
  var tags = $("#searchtags").val();
  var previous = 0;
  for (var i = 0; i < tags.length; i++) {
    var a = tags.charAt(i);
    if (a == ",") {
      var word = tags.substring(previous, i);
      previous = i + 1;
      console.log(word);
      taglist.push(word);
    }
    if (i == tags.length - 1) {
      var word = tags.substring(previous, i + 1);
      taglist.push(word);
    }
  }
  return taglist;

};

//Add group
function addGroup() {
  var userid = getCookie("user");
  $.ajax({
    url: "users/addGroups",
    type: "POST",
    dataType: "text",
    data: {
      user: userid,
      groupName: $("#newGroup").val()
    },
    success: function(result) {
      console.log(result);
    }
  });
};

//Get list of groups of the user when adding new members
function getSelectGroups() {
  var userid = getCookie("user");
  $.ajax({
    url: "users/getGroups",
    type: "POST",
    dataType: "text",
    data: {
      userid: userid
    },
    success: function(result) {
      if (result == "0") {
        alert("ERROR");
      } else {
        result = JSON.parse(result);
        for (var i = 0; i < result.length; i++) {

          console.log(result[i].group_name);
          $("#spanselectgroups").append('     <input id="selectgroups' + i + '" onclick="validate(' + i + ')" value = "' + result[i].groupid + '"" type="checkbox" aria-label="...">' + result[i].group_name + '<br>');
        }
      }
    }
  });
}

//Get list of groups of the user when viewing groups
function getViewGroups() {
  var userid = getCookie("user");
  $.ajax({
    url: "users/getGroups",
    type: "POST",
    dataType: "text",
    data: {
      userid: userid
    },
    success: function(result) {
      console.log("Success");
      if (result == "0") {
        alert("ERROR");
      } else {
        result = JSON.parse(result);
        for (var i = 0; i < result.length; i++) {
          console.log(result[i].group_name);
          var groupid = result[i].groupid;
          //  $("#viewgroups").append(result[i].group_name);
          $("#viewgroups").append('               <button onclick =  "getGroupById(' + userid + ',' + groupid + ')">' + result[i].group_name + '</button>');

          //  $("#spanselectgroups").append(  '     <input id="selectgroups'+i+'" onclick="validate('+i+')" value = "'+result[i].groupid+'"" type="checkbox" aria-label="...">' + result[i].group_name+'<br>');
        }
      }
    }
  });
}

function getGroupById(userid, groupid) {
  console.log("get group by id");
  $.ajax({
    url: "users/getGroupById",
    type: "POST",
    dataType: "text",
    data: {
      userid: userid,
      groupid: groupid
    },
    success: function(result) {
      console.log("Success");
      if (result == "0") {
        console.log("0");
        alert("ERROR");
      } else {
        console.log("got result");
        var members = JSON.parse(result);
        console.log(members);
        $("#viewgroupmembers").empty();
        for(var i = 0; i<members.length; i++){
          $("#viewgroupmembers").append(members[i].membername+'<br>');
        }

      }
    }
  });
}

//Add to group
function addMemberToGroup() {

  var userid = getCookie("user");
  $.ajax({
    url: "users/addToGroup",
    type: "POST",
    dataType: "text",
    data: {
      user: userid,
      groupName: $("#groupName").val(),
      memberName: $("#memberName").val()
    },
    success: function(result) {
      console.log(result);
    }
  });
}

$(document).ready(function() {
  getViewGroups();

  getSelectGroups();

  persistLogin();
  //LOGIN
  $("#logInButton").click(function() {

    console.log("loggin");
    var useremail = $("#email").val();
    var userpassword = $("#password").val();
    $.ajax({
      url: "users/login",
      type: "POST",
      dataType: "text",

      data: {
        email: $("#email").val(),
        password: $("#password").val()
      },
      success: function(result) {
        console.log(result);
        var results = JSON.parse(result);
        var uname = results.name;
        name = uname;

        myEmail = useremail;
        myPassword = userpassword;

        $("#loggedIn").show();
        $("#loginName").text(name);
        $("#login").hide();
      }

    });
  });

  //UPDATE NAME
  $("#changeNameButton").click(function() {
    var newName = $("#updateName").val();
    var myUserId = getCookie("user");

    //Ajax call
    $.ajax({
      url: "users/updateName",
      type: "POST",
      dataType: "text",
      data: {
        name: newName,
        user: myUserId
      },
      success: function(result) {
        alert('Success! Welcome!' + result);
        name = result;
        $("#loginName").text(name);
      }
    });
  });

  //SIGN UP
  $("#registerButton").click(function() {
    console.log("REGSITRER");
    $.ajax({
      url: "register/",
      type: "POST",
      dataType: "text",
      data: {
        name: $("#name").val(),
        email: $("#email").val(),
        password: $("#password").val()
      },
      success: function(result) {
        alert('Success! Welcome!' + result);
      }
    });
  });

  //LOG OUT
  $("#logOutButton").click(function() {
    console.log("Logging out.");
    deleteCookie();
  });

  //DELECTE cookie
  function deleteCookie() {
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location = "index.html";
  }

  // PERSISTENT LOGIN
  function persistLogin() {
    var myCookie = getCookie("user");
    console.log("persistLogin");
    if (myCookie == null) {
      console.log("DNE");
      $("#loggedIn").hide();
      $("#login").show();
    } else {

      $("#loggedIn").show();
      $("#login").hide();
      $.ajax({
        url: "users/getUser/",
        type: "POST",
        dataType: "text",
        data: {
          user: myCookie
        },
        success: function(result) {
          $("#loginName").text(result);
        }
      });

    }
  }

  //ADD Member
  $("#addMember").click(function() {
    //- As of now, can only add one member to one group
    console.log("ADDING MEMBER");
    var groupidvalue = selectedgroup;
    console.log(groupidvalue);
    // if(selectedgroup==null || selectedgroup=='' || selectedgroup==""){
    //   window.alert("You must add the member to some group");
    // }

    console.log("ADDING MEMBER");
    var myUserId = getCookie("user");
    var taglist = parseAddTags();

    // console.log(myEmail);
    // console.log(myPassword);
    window.alert("ADDDOng");

    console.log("ajax call add member");
    $.ajax({
      url: "addMember/",
      type: "POST",
      dataType: "text",
      data: {
        user: myUserId,
        membername: $("#membername").val(),
        memberemail: $("#memberemail").val(),
        taglist: taglist,
        groupid: groupidvalue

      },

    });

    alert("SUCESSFULLY ADDED");
  });

  //SEARCH FOR MEMBER IN NETWORK
  $("#searchmynetwork").click(function() {
    var myUserId = getCookie("user");
    var name = $("#searchname").val();
    var taglist = parseSearchTags();
    var tagone = taglist[0];
    var tagtwo = taglist[1];
    var tagthree = taglist[2];

    $.ajax({
      url: "searchMembers",
      type: "POST",
      dataType: "text",
      data: {
        user: myUserId,
        name: name,
        tagone: tagone,
        tagtwo: tagtwo,
        tagthree: tagthree
      },
      success: function(result) {
        alert('Success! Welcome!' + result);
        var list = JSON.parse(result);
        if (result == "0") {
          $("#searchresults").text("NO RESULTS FOUND");
        } else {
          $("#searchresults").text(" ");
          for (var i = 0; i < list.length; i++) {
            $("#searchresults").append(list[i].membername + "  " + list[i].memberemail);
            $("#searchresults").append("<br>");
            console.log(list[i].memberemail);
          }
        }


      }
    });


  });

});



function validate(i) {
  var group = "selectgroups".concat(i);
  var groupid = $("#" + group);
  var value = groupid.val();
  console.log(value);
  console.log("group  " + group);
  console.log("groupid  " + groupid);
  selectedgroup = value; //this is the groupid of the selected group..
}
