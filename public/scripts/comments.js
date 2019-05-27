/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


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

// Helper function: Input safety
function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}


// Helper function: append each new composed comments into comment container
function renderComments(comments) {
  for (comment of comments) {
    $('.comment-display-area').append(createCommentElement(comment));
  }
}

// Building basic structure of each tweet by using jQuery
function createCommentElement(comment) {
  let $comment =
    `<section class="new-comment">
    <p class="single-comment">${escape(comment.comment)}</p>
    <div class="comment-icon">
      <p class="heart"><i class="fas fa-heart"></i></p>
      <p><i class="fas fa-retweet"></i></p>
      <p><i class="fas fa-flag"></i></p>
    </div>
  </section>`;

  return $comment;
}

// Real-time interactions on the page
$(document).ready(() => {
  loadComments();

  // Set restrictions for tweet composing by using error messages
  $('#input-comment').on(('submit'), function (event) {
    event.preventDefault();
    let queryString = $(this).serialize();
    console.log(queryString)
    const {
      linkId
    } = getUrlVars()

    // Load new tweet in the main page instantly after submission by AJAX
    $.ajax('/comments', {
      method: 'POST',
      dataType: 'json',
      data: queryString + "&link_id=" + linkId,
      error: function (req, status, error) {
        return error;
      },
      success: function (res, statusCode) {
        console.log('fuck res: ', res);
        $('.comment-display-area').prepend(createCommentElement(res));
        $('#textInput').val('');
      }
    })
  });

  // Helper function: Displaying all the tweets in real time and sort from newest to oldest by using AJAX
  function loadComments() {
    $.ajax('/comments', {
      method: 'GET',
      dataType: 'json',
      error: function (req, status, error) {
        return error;
      },
      success: function (res, statusCode) {
        renderComments(res);
      }
    });
  }
});
