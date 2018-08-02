/* eslint-disable */

var searchBox = document.getElementById('keyword-input');
var submitBtn = document.getElementById('submit');
var headline = document.getElementById('headline');
var abstract = document.getElementById('abstract');
var article = document.getElementById('article');
var gif = document.getElementById('gif');
var relatedHeadlines = document.getElementById('related-headlines');

searchBox.addEventListener('keypress', function(event) {
  var key = event.which || event.keyCode;
  if (key === 13) {
    event.preventDefault();
    apiRequest(searchBox.value, function(data) {
      headline.textContent = data.headline;
      abstract.textContent = data.summary;
      article.textContent = data.article;
      for (var i = 0; i < data['other_headlines'].length; i++) {
        var otherHeadline = document.createElement('p');
        otherHeadline.textContent = data['other_headlines'][i];
        relatedHeadlines.appendChild(otherHeadline);
      }
    });
  }
});

submitBtn.addEventListener('click', function() {
  apiRequest(searchBox.value, function(data) {
    article.textContent = data['guardian-data'];
  });
});
