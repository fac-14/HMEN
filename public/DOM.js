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
    data.forEach(function(source) {
        if (source.nyt) {
          headline.textContent = source.nyt.headline;
          abstract.textContent = source.nyt.summary;
        } else if (source.Guardian) {
          article.textContent = source.Guardian.article;
        } else if (source.Giphy) {
          gif.setAttribute("src", source.Giphy.gif);
          gif.setAttribute("alt", source.Giphy.gifDescription);
        }
    })
  });
});
