// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for (user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
// });

function register() {
  $("#sign-up-form").on("submit", function (event) {
    event.preventDefault();
    console.log('register form clicked')
    $.ajax({
      url: '/register',
      type: 'POST',
      data: $(this).serialize()
    }).done(function () {
      console.log(data)
      window.location.replace('/')
    })
  })
}

$(document).ready(function () {
  register()
})
