'use strict';

// create sticky header

window.onscroll = function() {
  stickyFunc();
};

let header = document.getElementById('top-header');
let sticky = header.offsetTop;

function stickyFunc() {
  if (window.pageYOffset > sticky) {
    header.classList.add('sticky');
  } else {
    header.classList.remove('sticky');
  }
}

// reddit request function below

function sendRequest(subreddit) {
  return function() {
    let request = new XMLHttpRequest();
    request.open('GET', `https://www.reddit.com/r/${subreddit}/.json?raw_json=1`);
    request.send();
    request.addEventListener('load', getData);
  };
}

header.addEventListener('click', sendRequest('surfing'));

function getData() {
  let responseData = JSON.parse(this.responseText);
  let responseChildren = responseData.data.children;
  console.log(responseChildren);
  for (let i = 0; i < responseChildren.length; i++) {
    let newPost = document.createElement('div');
    newPost.innerHTML = responseChildren[i].data.title;
    postsBox.appendChild(newPost);
  }
}
