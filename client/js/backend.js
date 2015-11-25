var name;
var myEmail;
var myPassword;

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


$(document).ready(function() {
  persistLogin();
  //LOGIN
  $("#logInButton").click(function() {
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
    var myUserId = getCookie("user");
    var tag1 = $("#tag1").val();
    var tag2 = $("#tag2").val();
    console.log(myEmail);
    console.log(myPassword);
    console.log("ajax call add member");
    $.ajax({
      url: "addMember/",
      type: "POST",
      dataType: "text",
      data: {
        user: myUserId,
        membername: $("#membername").val(),
        memberemail: $("#memberemail").val(),
        tag1 : tag1,
        tag2 :tag2
      },
    });
  });



  //
});
