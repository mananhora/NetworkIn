var name;
var myEmail;
var myPassword;
var selectedgroupAdd;
var selectedgroupSearch;

// PROCESS FORM
function updateValues() {
  document.getElementById("currentMember").innerHTML = get('name');
  if (get('email') !== null && get('email') !== "") {
    document.getElementById("email").innerHTML = '<strong>Email: </strong>' + get('email');
  }
  if (get('taglist') !== null) {
    document.getElementById("taglist").innerHTML = '<strong>Tags: </strong>' +get('taglist');
  }

}

function get(name) {
  if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
    return decodeURIComponent(name[1]);
}

// DELETE MEMBER
function deleteMember(memberId) {
  $.ajax({
    url: "users/deleteMember",
    type: "POST",
    dataType: "text",
    data: {
      member: memberId
    },

    success: function(result) {
      console.log("successful deletion");
    }
  });
}

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
        console.log("ERROR");
      } else {
        result = JSON.parse(result);
        for (var i = 0; i < result.length; i++) {

          console.log(result[i].group_name);
          $("#spanselectgroupsAdd").append('     <input id="selectgroupsAdd' + i + '" onclick="validateAdd(' + i + ')" value = "' + result[i].groupid + '"" type="checkbox" aria-label="...">' + result[i].group_name + '<br>');

          $("#spanselectgroupsSearch").append('     <input id="selectgroupsSearch' + i + '" onclick="validateSearch(' + i + ')" value = "' + result[i].groupid + '"" type="checkbox" aria-label="...">' + result[i].group_name + '<br>');
        }
      }
    }
  });
}

function redirect() {
  var url = "../manageNetwork.html";
  window.location.replace(url);
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
        console.log("ERROR");
      } else {
        result = JSON.parse(result);
        for (var i = 0; i < result.length; i++) {
          console.log(result[i].group_name);
          var groupid = result[i].groupid;
          //  $("#viewgroups").append(result[i].group_name);
          //       $("#viewgroups").append('               <button onclick =  "getGroupById(' + userid + ',' + groupid + ')">' + result[i].group_name + '</button>');
          //
          //       $("#viewgroups").append('              <div class=\"panel panel-default\">
          //   <div class=\"panel-heading\">
          //     <h4 class=\"panel-title\">
          //       <a data-toggle=\"collapse\" href=\"#collapse1\">Collapsible panel</a>
          //     </h4>
          //   </div>
          //   <div id=\"collapse1\" class=\"panel-collapse collapse\">
          //     <div class=\"panel-body\">Panel Body</div>
          //     <div class=\"panel-footer\">Panel Footer</div>
          //   </div>
          // </div>');

          if (document.getElementById("viewgroups") != null) {
            var oldHTML = document.getElementById("viewgroups").innerHTML;
            document.getElementById("viewgroups").innerHTML = oldHTML + '<div class="panel-group"><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" href="#collapse' + groupid + '">' + result[i].group_name + '</a></h4></div><div id="collapse' + groupid + '" class="panel-collapse collapse"><div class="panel-body"><div id="viewgroupmembers' + groupid + '"></div></div><div class="panel-footer"><button type="button" onclick="redirect()" class="btn btn-primary">Add Members</button></div></div></div></div>';
            getGroupById(userid, groupid);
          }
          //  $("#spanselectgroups").append(  '     <input id="selectgroups'+i+'" onclick="validate('+i+')" value = "'+result[i].groupid+'"" type="checkbox" aria-label="...">' + result[i].group_name+'<br>');
        }
      }
    }
  });
}

//Get All members of a group given groupid and userid
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
        console.log("ERROR");
      } else {
        console.log("got result");
        var members = JSON.parse(result);
        console.log(members);
        var elementid = "#viewgroupmembers" + groupid;
        $(elementid).empty();
        for (var i = 0; i < members.length; i++) {
          $(elementid).append('<form action="member.html" method="GET">' +
          '<input type="hidden" value="' + members[i].memberid + '" name="id" id="id" >' +
            '<input type="hidden" value="' + members[i].membername + '" name="name" id="name" >' +
            '<input type="hidden" value="' + members[i].memberemail + '" name="email" id="email" >' +
            '<input type="hidden" value="' + members[i].taglist + '" name="taglist" id="taglist" >' +
            '<input type="submit" value="' + members[i].membername + '" ></form><br>');
        }
        if (members.length == 0) {
          $(elementid).append('<i> No Members Yet </i><br>');
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

function cookieExists(cookieName) {
  if (getCookie(cookieName) == null) {
    return false;
  }
  return true;
}

$(document).ready(function() {
  var loggedin = cookieExists('user');
  $(".dropdown").hide();
  // getViewGroups();

  getSelectGroups();

  persistLogin();
  if (loggedin == false) {
    $(".dropdown").hide();
  }
  if (loggedin == true) {
    $(".dropdown").show();
    getViewGroups();
  }
  //LOGIN
  $("#logInButton").click(function() {
    $(".dropdown").show();


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
        if (result === "Invalid email. Please try again.") {
          alert("Incorrect email/password.");
        } else {
          var results = JSON.parse(result);
          var uname = results.name;
          name = uname;

          myEmail = useremail;
          myPassword = userpassword;

          $("#loggedIn").show();
          $("#loggedinname").text(name + " ");
          $("#loginName").text(name);
          $("#login").hide();
          loggedin = true;
          window.location.replace('/index.html');
        }
      }

    });
  });

  $("#deleteAccountButton").click(function() {
    deleteAccount();
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
        console.log('Success! Welcome!' + result);
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
        if (result === "ERROR") {
          alert("That email is taken. Please select another.");
        } else {
          console.log('Success! Welcome!' + result);
          window.location.replace('/index.html');
        }
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

  // DELETE ACCOUNT
  function deleteAccount() {
    var userId = getCookie('user');

    $.ajax({
      url: "users/deleteUser",
      type: "POST",
      dataType: "text",
      data: {
        user: userId
      },

      success: function(result) {
        console.log("successful deletion");
        deleteCookie();
      }
    });

  }
  // PERSISTENT LOGIN
  function persistLogin() {
    $(".dropdown").show();

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
          $("#loggedinname").text(result + " ");
          $("#loginName").text(result);
        }
      });
      loggedin = true;
    }
  }

  //ADD Member
  $("#addMember").click(function() {
    //- As of now, can only add one member to one group
    console.log("ADDING MEMBER");
    var groupidvalue = selectedgroupAdd;
    console.log(groupidvalue);
    // if(selectedgroup==null || selectedgroup=='' || selectedgroup==""){
    //   window.alert("You must add the member to some group");
    // }

    console.log("ADDING MEMBER");
    var myUserId = getCookie("user");
    var taglist = parseAddTags();

    // console.log(myEmail);
    // console.log(myPassword);
    console.log("ADDDOng");

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

    console.log("SUCESSFULLY ADDED");
  });

  //DELETE MEMBER FROM MEMBER PROFILE
  $("#deleteMember").click(function() {
    var memberId = get('id');
    console.log("MemberId == " + memberId);
    deleteMember(memberId);
    window.location.replace('/index.html');
  });

  //SEARCH FOR MEMBER IN NETWORK
  $("#searchmynetwork").click(function() {
    var myUserId = getCookie("user");
    var name = $("#searchname").val();
    var taglist = parseSearchTags();
    var tagone = taglist[0];
    var tagtwo = taglist[1];
    var tagthree = taglist[2];
    var groupidvalue = selectedgroupSearch;


    $.ajax({
      url: "searchMembers",
      type: "POST",
      dataType: "text",
      data: {
        user: myUserId,
        name: name,
        tagone: tagone,
        tagtwo: tagtwo,
        tagthree: tagthree,
        groupid: groupidvalue
      },
      success: function(result) {
        console.log('Success! Welcome!' + result);
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



function validateAdd(i) {
  var group = "selectgroupsAdd".concat(i);
  var groupid = $("#" + group);
  var value = groupid.val();
  console.log(value);
  console.log("group  " + group);
  console.log("groupid  " + groupid);
  selectedgroupAdd = value; //this is the groupid of the selected group..
}

function validateSearch(i) {
  var group = "selectgroupsSearch".concat(i);
  var groupid = $("#" + group);
  var value = groupid.val();
  console.log(value);
  console.log("group  " + group);
  console.log("groupid  " + groupid);
  selectedgroupSearch = value; //this is the groupid of the selected group..
}
