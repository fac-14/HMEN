const searchBox = document.getElementById('keyword-input');
console.log(searchBox);
const submitBtn = document.getElementById('submit');

const apiRequest = (query, callback) => {
  const url = `//localhost:4000/?q=${query}`;
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => { // eslint-disable-line
    if (xhr.readyState == 4) { // eslint-disable-line
      if (xhr.status == 200) { // eslint-disable-line
        const parsedObj = JSON.parse(xhr.responseText);
        return callback(parsedObj);
      }
      console.log('Error');
    }
  };
  xhr.open('GET', url, true);
  xhr.send();
};

searchBox.addEventListener('keypress', (event) => {
  const key = event.which || event.keyCode;
  if (key === 13) {
    apiRequest(searchBox.value);
  }
});

submitBtn.addEventListener('click', () => {
  apiRequest(searchBox.value);
});
