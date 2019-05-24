function register() {
  $("#sign-up-form").on("submit", function(event) {
    event.preventDefault();
    $.ajax({
      url: "/register",
      type: "POST",
      data: $(this).serialize()
    })
      .done(function() {
        window.location.replace("/");
      })
      .fail(err => {
        $(".is-member span.member").text("This email already exists");
      });
  });
}

function login() {
  $("#sign-in-form").on("submit", function(event) {
    event.preventDefault();
    console.log("This is working!");
    $.ajax({
      method: "POST",
      url: $(this).attr("action"),
      data: $(this).serialize()
    }).done(function() {
      window.location.replace("/");
    });
  });
}

//search bar-> get links
function getLinks() {
  //hide the present links
  //show searched link
  $("#search button").on("click", function(event) {
    event.preventDefault();
    const inputText = $("#search input").val();
    if (inputText) {
      $(".link-display").empty();
      $.ajax({
        method: "GET",
        url: `/links?key=${inputText}`
      }).done(function(links) {
        console.log(links);
        addLinksToPage(links);
      });
    }
  });
}

//load links
function loadLinks() {
  $.ajax({
    method: "GET",
    url: "/links"
  }).done(function(links) {
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
      `<div class='one-link'>
      <a href='#'>
        <img src=${link.imgUrl}></img>
        <span class='one-link-title'>${link.title}</span>
        </a></div>`
    );
  });
}

//create a new link
function createLink() {
  $("#newLink").on("submit", function() {
    event.preventDefault();
    $.ajax({
      method: "POST",
      url: "/links",
      data: $(this).serialize()
    }).done(function() {
      window.location.replace("/");
    });
  });
}

$(document).ready(function() {
  loadLinks();
  getLinks();
  register();
  login();
  createLink();
});
