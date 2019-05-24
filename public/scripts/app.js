function register() {
  $("#sign-up-form").on("submit", function (event) {
    event.preventDefault();
    $.ajax({
      url: '/register',
      type: 'POST',
      data: $(this).serialize()
    }).done(function (error) {
      window.location.replace('/')
    }).fail(err => {
      $('.is-member span').text('This email already exists')
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
