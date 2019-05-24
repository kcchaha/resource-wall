var ogs = require('open-graph-scraper');
var links = [{
  url: 'https://getbootstrap.com/',
  title: 'Bootstrap'
}, {
  url: 'https://www.codecademy.com',
  title: 'codeacademy'
}]

var promises = links.map(link => {
  var options = {
    'url': link.url
  };
  return ogs(options)
    .then(response => {
      link.imgUrl = response.data.ogImage.url;
      return link;
    })
});
console.log(promises);
Promise.all(promises)
  .then(links => {
    console.log(links);
  });

// var options = {
//   'url': process.argv[2]
// };
// ogs(options, function (error, results) {
//   console.log('error:', error); // This is returns true or false. True if there was a error. The error it self is inside the results object.
//   console.log('results:', results);
//   console.log('image URL:', results.data.ogImage.url)
// });
