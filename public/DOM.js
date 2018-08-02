/* eslint-disable */

var searchBox = document.getElementById('keyword-input');
var submitBtn = document.getElementById('submit');
var article = document.getElementById('news-container');

searchBox.addEventListener('keypress', function(event) {
  var key = event.which || event.keyCode;
  if (key === 13) {
    event.preventDefault();
    apiRequest(searchBox.value, function(data) {
      var guardianContainer = document.createElement('p');
      var guardianArticle = document.createTextNode(data['guardian-data']);
      guardianContainer.appendChild(guardianArticle);
      var nytContainer = document.createElement('p');
      var nytArticle = document.createTextNode(data['nyt-data']);
      nytContainer.appendChild(nytArticle);
      while (article.firstChild) {
        article.removeChild(article.childNodes[0]);
      }
      article.appendChild(guardianContainer);
      article.insertBefore(nytContainer, article.childNodes[0]);
    });
  }
});

submitBtn.addEventListener('click', function() {
  apiRequest(searchBox.value, function(data) {
    article.textContent = data['guardian-data'];
  });
});
