'use strict';
// var moment = require('moment');
// console.log(moment('20111031', 'YYYYMMDD').fromNow());
// create sticky header

window.onscroll = function() {
  stickyFunc();
};

let header = document.getElementById('headerBox');
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

// get data/create posts function below

function getData() {
  let responseData = JSON.parse(this.responseText);
  let responseChildren = responseData.data.children;
  postsBox.innerHTML = '';
  console.log(responseChildren);
  for (let i = 0; i < responseChildren.length; i++) {
    // create new postBox
    let newPost = document.createElement('div');
    newPost.className = 'postBox';
    postsBox.appendChild(newPost);
    let innerPostBox = document.createElement('div');
    innerPostBox.className = 'innerPostBox';
    newPost.appendChild(innerPostBox);

    // add image
    if (responseChildren[i].data.thumbnail !== 'self' && responseChildren[i].data.thumbnail !== '') {
      let postImage = document.createElement('img');
      postImage.className = 'postImages';
      postImage.src = responseChildren[i].data.thumbnail;
      innerPostBox.appendChild(postImage);
    }

    // add title
    let postTitle = document.createElement('div');
    postTitle.className = 'postTitles';
    postTitle.innerHTML = responseChildren[i].data.title;
    innerPostBox.appendChild(postTitle);

    // add author/date/upvotes container
    let statsBox = document.createElement('div');
    statsBox.className = 'postStats';
    // grab author,date, upvotes
    let author = responseChildren[i].data.author;
    // let date = moment(responseChildren[i].data.created, 'YYYYMMDD');
    // console.log(date);
    let upvotes = responseChildren[i].data.score;
    statsBox.innerHTML = `By : ${author} ●  DATE HERE  ● Upvotes: ${upvotes}`;

    // add post content
    let postContent = document.createElement('div');
    postContent.className = 'partPostContent';
    let fullParagraph = responseChildren[i].data.selftext;
    let fullPostContent = document.createElement('div');
    if (fullParagraph !== '') {
      var reducedParagraph = fullParagraph.substr(0, 175);
      postContent.innerHTML = reducedParagraph + '...';
      // postContent.innerHTML = fullParagraph;
      // full contentstuff below
      fullPostContent.className = 'fullPostContent';
      fullPostContent.innerHTML = fullParagraph;
      fullPostContent.style.display = 'none';
      postContent.addEventListener('click', showFull);
    }

    innerPostBox.appendChild(statsBox);
    innerPostBox.appendChild(postContent);
    innerPostBox.appendChild(fullPostContent);
  }
}

function showFull() {
  fullPostContent.style.display = 'block';
}
// function showLess(){

// }

// add click event to nav bar

surfNav.addEventListener('click', sendRequest('surfing'));
spaceNav.addEventListener('click', sendRequest('astrophotography'));
hawaiiNav.addEventListener('click', sendRequest('hawaii'));
randomNav.addEventListener('click', randomNumGener());

// random subreddit generator below

// function randomSub() {
//   let randomSubArray = ['pic', 'EarthPorn', 'FoodPorn', 'askReddit', 'dogswithjobs', 'nba', 'javascript'];
//   let randomNum = Math.floor(Math.random() * 7);

//   return randomSubArray[Math.floor(Math.random() * 7)];
// }
// function getSub() {
//   return randomSub();
// }
function randomNumGener() {
  postsBox.innerHTML = '';
  let randomSubArray = ['pic', 'EarthPorn', 'FoodPorn', 'askReddit', 'dogswithjobs', 'nba', 'javascript'];
  let randomNum = Math.floor(Math.random() * 7);
  let newTopic = randomSubArray[randomNum];
  console.log(newTopic);
  return sendRequest(newTopic);
}

// endless scroll attempt
// window.onscroll = function(ev) {
//   if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
//     loadMore();
//   }
// };

// function loadMore() {}
