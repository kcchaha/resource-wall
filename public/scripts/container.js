function checkUser() {
  $.ajax({
    method: "GET",
    url: "/check_user",
  }).done(function (data) {
    loggedIn = data.loggedOn;
  });
}

function getUserContainer() {
  const {
    userID
  } = getUrlVars()
  console.log('userID: ', userID)
  $.ajax({
    method: "GET",
    url: `/container`,
  }).done(function (userData) {
    console.log('user: ', userData)
    $(".userEmail").text(userData.email);
    ownLinks(userData.ownLinks)
    likedLinks(userData.likedLinks)
  });
}

function ownLinks(links) {
  links.forEach(link => {
    $(".my-links").append(`<p><a class="show-links" href="${link.url}" target="blank">${link.title}</a></p>`)
  })
}

function likedLinks(links) {
  links.forEach(link => {
    $(".liked-links").append(`<p><a class="show-links" href="${link.url}" target="blank">${link.title}</a></p>`)
  })
}

function containerDetails(link) {
  $(".info h3").text(link.title)
  $(".info p").text(link.user_id)
}

function getUrlVars() {
  var vars = [],
    hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

$(document).ready(function () {
  getUserContainer()
});
