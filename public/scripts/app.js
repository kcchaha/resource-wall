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

function getLinks() {
  $('#search button').on('click', function (event) {
    event.preventDefault();
    const inputText = $('#search input').val()
    if (inputText) {
      $.ajax({
        method: "GET",
        url: `/links?key=${inputText}`
      }).done(function (links) {
        console.log(links)
      })
    }
  })
}

$(document).ready(function () {
  getLinks();
  register();
  login();
})
