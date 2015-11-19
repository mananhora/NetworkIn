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
        alert('Success! Welcome!');
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


  //ADD Member
  $("#addMember").click(function(){
    console.log("ajax call add member");
    $.ajax({
      url: "addMember/",
      type: "POST",
      dataType: "text",
      data: {
        useremail:myEmail,
        userpassword: myPassword,
        membername: $("#membername").val(),
        memberemail: $("#memberemail").val(),
      },
  });
});

});
