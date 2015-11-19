var name;
var myEmail;
var myPassword;


$(document).ready(function() {

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

    //Ajax call
    $.ajax({
      url: "users/updateName",
      type: "POST",
      dataType: "text",
      data: {
        name: newName,
        email: myEmail,
        password: myPassword
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

  function getCookie(name) {
      var dc = document.cookie;
      var prefix = name + "=";
      var begin = dc.indexOf("; " + prefix);
      if (begin == -1) {
          begin = dc.indexOf(prefix);
          if (begin != 0) return null;
      }
      else
      {
          begin += 2;
          var end = document.cookie.indexOf(";", begin);
          if (end == -1) {
          end = dc.length;
          }
      }
      return unescape(dc.substring(begin + prefix.length, end));
  }

  function persistLogin() {
      var myCookie = getCookie("user");

      if (myCookie == null) {
          // do cookie doesn't exist stuff;
          cosole.log("DNE");
          $("#loggedIn").hide();
          $("#login").show();
      }
      else {
          // do cookie exists stuff
          var nameText = getCookie("user")
          console.log("nameText");
          $("#loginName").text(nameText);
          $("#loggedIn").show();
          $("#login").hide();
          console.log("Cookie val? : ", getCookie("user"));
          $("loginName").text(getCookie("user")); // = getCookie("user");
      }
  }

  //LOG OUT
  $("#logOutButton").click(function() {
    console.log("Logging out.");

  });

});
