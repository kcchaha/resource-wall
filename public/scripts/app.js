var loggedIn;

// get user id from server when the user is logged in
function checkId() {
  $.get('/person', (data) => {
    console.log(data);
  })
}

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

function login() {
  $("#sign-in-form").on("submit", function (event) {
    event.preventDefault();
    $.ajax({
        method: "POST",
        url: "/sign-in",
        data: $(this).serialize()
      })
      .done(function (data) {
        console.log('here', data);

        console.log(data.success);

        if (!data.success) {
          $(".not-member").text("This email already exists");

        } else {

          window.location.replace("/");
        }
        checkUser();
      })
      .fail(err => {
        console.log(err);
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
      `<a class="go-to-link" href='../HTML/popup-link.html?linkId=${link.id}'><div class='one-link'>
        <img src=${link.imgUrl} onerror="this.src='../Docs/other.png'"></img>
        <span class='one-link-title'>${link.title}</span>
        </div></a></div>`
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
function getALink() {
  $(document).on('click', '.go-to-link', function () {
    console.log($(this))
    $.ajax({
      method: "GET",
      url: "/link",
      data: $(this).attr('data-linkid')
    }).done(function () {
      console.log('here!')
    });
  })
}

function displayButtons() {
  if (loggedIn) {
    $(".buttons-block").append(`
    <form class="form-inline" action="/logout" method="POST">
    <div class="form-group mb-2">
      <button type="submit" class="btn btn-primary">Logout</button>
    </div>
  </form>
    `)
  } else {
    $(".buttons-block").append(` <span id="signin"><a class="aa" href="/sign-in.html">Sign in</a></span>
    <span id="signup"><a class="aa" href="/sign-up.html">Sign up</a></span>`)
  }
}

function checkUser() {
  $.ajax({
    method: "GET",
    url: "/check_user",
  }).done(function (data) {
    loggedIn = data.loggedOn;
    displayButtons()
  });
}

function checkIfLoggedIn() {
  $('.bb').on('click', function () {
    $.ajax({
      method: "GET",
      url: "/check_user",
    }).done(function (data) {
      loggedIn = data.loggedOn;
      if (!loggedIn) {
        replaceToLogin()
      }
    });
  })
}

function replaceToLogin() {
  window.location.replace("/sign-in.html")
}




// Comments ////////////////////////////

// Helper function: Input safety
function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// Helper function: append each new composed comment into comment container
function renderComments(tweets) {
  for (tweet of tweets) {
    $('#tweet-container').append(createTweetElement(tweet));
  }
}

// get user id from server when the user is logged in

$(document).ready(function () {
  getALink();
  checkUser();
  loadLinks();
  getLinks();
  register();
  login();
  createLink();
  checkIfLoggedIn();
});
