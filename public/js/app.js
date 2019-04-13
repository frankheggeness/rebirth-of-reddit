'use strict';

// var moment = require('moment');
// moment().format();

window.addEventListener('scroll', stickyFunc);
// window.addEventListener('scroll', footerSticky);
let currentSubreddit = '';

let header = document.getElementById('headerBox');
let sticky = header.offsetTop;

function stickyFunc() {
  if (window.pageYOffset > sticky) {
    header.classList.add('sticky');
  } else {
    header.classList.remove('sticky');
  }
}
// function footerSticky() {
//   if (window.pageYOffset > sticky) {
//     header.classList.add('stickyBottom');
//   } else {
//     header.classList.remove('stickyBottom');
//   }
// }

// reddit request function below

function sendRequest(subreddit) {
  return function() {
    let request = new XMLHttpRequest();
    currentSubreddit = subreddit;
    request.open('GET', `https://www.reddit.com/r/${subreddit}/.json?raw_json=1`);
    request.send();
    request.addEventListener('load', getData);
    postsBox.innerHTML = '';
  };
}
function sendRequestInfinite() {
  let request = new XMLHttpRequest();
  request.open('GET', `http://www.reddit.com/r/${currentSubreddit}/.json?limit=50&after=t3_10omtd/`);
  request.send();
  request.addEventListener('load', getData);
}

// get data/create posts function below

function getData() {
  let responseData = JSON.parse(this.responseText);
  let responseChildren = responseData.data.children;
  console.log(responseChildren);
  for (let i = 0; i < responseChildren.length; i++) {
    // create new postBox
    let newPost = document.createElement('div');
    newPost.className = 'postBox';
    postsBox.appendChild(newPost);
    let innerPostBox = document.createElement('div');
    innerPostBox.className = 'innerPostBox';
    newPost.appendChild(innerPostBox);

    let imageLink = responseChildren[i].data.url;
    // add image
    let postImage = document.createElement('img');
    postImage.className = 'postImages';
    if (
      imageLink.search('imgur') !== -1 ||
      responseChildren[i].data.thumbnail === '' ||
      responseChildren[i].data.thumbnail === 'self'
    ) {
      console.log('found imgur');
      postImage.src = 'https://s.newsweek.com/sites/www.newsweek.com/files/styles/full/public/2018/09/28/reddit.png';
      innerPostBox.appendChild(postImage);
    } else if (responseChildren[i].data.thumbnail !== 'self' && responseChildren[i].data.thumbnail !== '') {
      if (responseChildren[i].data.url.charAt(responseChildren[i].data.url.length - 1) === 'g') {
        postImage.src = responseChildren[i].data.url;
      } else if (
        responseChildren[i].data.url.charAt(responseChildren[i].data.url.length - 1) !== 'g' &&
        responseChildren[i].data.thumbnail.charAt(responseChildren[i].data.thumbnail.length - 1) === 'g'
      ) {
        postImage.src = responseChildren[i].data.thumbnail;
      }

      if (this.status === 200) {
        innerPostBox.appendChild(postImage);
      }
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
    let date = new Date(responseChildren[i].data.created * 1000);
    let newDateStr = date.toString();
    let newDate = newDateStr.substr(0, 15);
    // let date = moment(responseChildren[i].data.created, 'YYYYMMDD');
    let upvotes = responseChildren[i].data.score;
    statsBox.innerHTML = `By : ${author} ●  ${newDate}  ● Upvotes: ${upvotes}`;

    // add post content
    let postContent = document.createElement('div');
    postContent.className = 'partPostContent';
    let fullParagraph = responseChildren[i].data.selftext;
    let fullPostContent = document.createElement('div');
    if (fullParagraph !== '') {
      let reducedParagraph = fullParagraph.substr(0, 175);
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
// add click event to nav bar

surfNav.addEventListener('click', sendRequest('surfing'));
spaceNav.addEventListener('click', sendRequest('astrophotography'));
earthNav.addEventListener('click', sendRequest('EarthPorn'));
randomNav.addEventListener('click', randomSubRedditFunc);

function randomSubRedditFunc() {
  let randomSubArray = ['pic', 'hawaii', 'FoodPorn', 'askReddit', 'dogswithjobs', 'nba', 'javascript'];
  let randomize = randomSubArray[Math.floor(Math.random() * randomSubArray.length)];

  sendRequest(randomize)();
}

// // endless scroll attempt
// window.onscroll = function(ev) {
//   if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
//     console.log('test');
//     sendRequestInfinite();
//   }
// };

// function loadMore() {}
