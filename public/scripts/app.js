function register() {
  $("#sign-up-form").on("submit", function (event) {
    event.preventDefault();
    console.log('register form clicked')
    $.ajax({
      url: '/register',
      type: 'POST',
      data: $(this).serialize()
    }).done(function () {
      window.location.replace('/')
    })
  })
}

function login() {
  $("#sign-in-form").on("submit", function (event) {
    event.preventDefault();
    console.log("This is working!")
    $.ajax({
      method: "POST",
      url: $(this).attr("action"),
      data: $(this).serialize()
    }).done(function () {
      window.location.replace('/')
    })
  })
}

$(document).ready(function () {
  register();
  login();
})
