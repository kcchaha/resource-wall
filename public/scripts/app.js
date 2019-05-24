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

$(document).ready(function () {
  register();
  login();
})
