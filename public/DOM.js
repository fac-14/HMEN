/* eslint-disable */

var searchBox = document.getElementById('keyword-input');
var submitBtn = document.getElementById('submit');
var headline = document.getElementById('headline');
var abstract = document.getElementById('abstract');
var article = document.getElementById('article');
var gif = document.getElementById('gif');

// searchBox.addEventListener('keypress', function(event) {
//   var key = event.which || event.keyCode;
//   if (key === 13) {
//     event.preventDefault();
//     apiRequest(searchBox.value, function(data) {
//
//     });
//   }
// });

submitBtn.addEventListener('click', function(event) {
  event.preventDefault();
  apiRequest(searchBox.value, function(data) {
    headline.textContent = data.headline;
    abstract.textContent = data.summary;
    article.textContent = data.article;
    gif.setAttribute("src", data.gif);
    console.log(data.gif);

  });
});
