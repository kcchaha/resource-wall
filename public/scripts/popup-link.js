function checkUser() {
  $.ajax({
    method: "GET",
    url: "/check_user",
  }).done(function (data) {
    loggedIn = data.loggedOn;
  });
}

function getALinkRequest() {
  const {
    linkId
  } = getUrlVars()
  console.log('linkid', linkId)
  $.ajax({
    method: "GET",
    url: `/links/${linkId}`,
  }).done(function (link) {
    console.log('link', link[0])
    linkDetails(link[0])
  });
}

function linkDetails(link) {
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
  getALinkRequest()
});
