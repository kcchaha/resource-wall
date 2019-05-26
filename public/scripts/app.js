var loggedIn;

function register() {
  $("#sign-up-form").on("submit", function (event) {
    event.preventDefault();
    $.ajax({
        url: "/register",
        type: "POST",
        data: $(this).serialize()
      })
      .done(function () {
        window.location.replace("/");
        checkUser();
      })
      .fail(err => {
        $(".is-member span.member").text("This email already exists");
      });
  });
}

function container() {
  $("#my-container").on("click", function(event) {
    event.preventDefault();
    $.ajax({
      method: "GET",
      url: "/"
    }).done(function() {
      window.location.replace("/container");
      checkUser();
    })
    .fail(err => {
      console.log("User is not logged in!")
    });
  });
}

//search bar-> get links
function getLinks() {
  //hide the present links
  //show searched link
  $("#search button").on("click", function (event) {
    event.preventDefault();
    const inputText = $("#search input").val();
    if (inputText) {
      $(".link-display").empty();
      $.ajax({
        method: "GET",
        url: `/links?key=${inputText}`
      }).done(function (links) {
        console.log(links);
        addLinksToPage(links);
      });
    }
  });
}

// my container links
// function containerLinks() {
//   $ajax({
//     method: "GET",
//     url: "/container"
//   }).done(function(links) {
//     addLinksToPage(links);
//   })
// }

//load links
function loadLinks() {
  $.ajax({
    method: "GET",
    url: "/links"
  }).done(function (links) {
    $(".link-display").empty();
    console.log("ll", links);
    addLinksToPage(links);
  });
}

function addLinksToPage(links) {
  //add category
  //create a category object to assign icons to the links
  links.forEach(link => {
    $(".link-display").prepend(
      `<a href='/popup-link.html'><div class='one-link'>
        <img src=${link.imgUrl}></img>
        <span class='one-link-title'>${link.title}</span>
        </div></a>`
    );
  });
}

//create a new link
function createLink() {
  $("#newLink").on("submit", function () {
    event.preventDefault();
    $.ajax({
      method: "POST",
      url: "/links",
      data: $(this).serialize()
    }).done(function () {
      window.location.replace("/");
    });
  });
}

//get a link
function getAlink() {
  $.ajax({
    method: "GET",
    url: "/links/:id/comment",
    data: $(this).serialize()
  }).done(function () {
    window.location.replace("/");
  });
}

function hideButtons() {
  if (loggedIn) {
    console.log('if block')
    $(".form-group.mb-2 button").on("click", function () {
      document.cookie = "session.sig = ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
      window.location.reload()
    })
    $("span#signin").hide()
    $("span#signup").hide()
  } else {
    console.log('else')
    $(".form-group.mb-2 button").hide()
  }
}

function checkUser() {
  $.ajax({
    method: "GET",
    url: "/check_user",
  }).done(function (data) {
    loggedIn = data.loggedOn;
    hideButtons()
  });
}

$(document).ready(function () {
  checkUser();
  loadLinks();
  getLinks();
  register();
  container();
  createLink();

  // //hide logout if logged in
  // if (document.cookie) {
  //   //when log out button is clicked empty the cookie
  //   $(".aa").hide()
  // } else {
  //   $(".form-inline button").hide()
  // }

});
