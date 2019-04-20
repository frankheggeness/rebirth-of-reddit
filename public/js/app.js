'use strict';

window.addEventListener('scroll', stickyFunc);

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

// reddit request function below

function sendRequest(subreddit) {
  return function() {
    userContainer.style.display = 'none';
    let request = new XMLHttpRequest();
    currentSubreddit = subreddit;
    request.addEventListener('load', getData);
    request.open('GET', `https://www.reddit.com/r/${subreddit}/.json?raw_json=1`);
    request.send();
    postsBox.innerHTML = '';
  };
}

function sendRequestInfinite() {
  let request = new XMLHttpRequest();
  request.addEventListener('load', getData);
  request.open('GET', `http://www.reddit.com/r/${currentSubreddit}/.json?limit=25&after=t3_10omtd/`);
  request.send();
}

// get data/create posts function below

function getData() {
  let responseData = JSON.parse(this.responseText);
  let responseChildren = responseData.data.children;

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
      postImage.src =
        'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBB%0D%0AZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9u%0D%0AOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBT%0D%0AVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzEx%0D%0ALmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3%0D%0ALnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxp%0D%0AbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMTIwcHgiIGhlaWdodD0iNjBweCIgdmlld0Jv%0D%0AeD0iMCAwIDEyMCA2MCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTIwIDYwIiB4bWw6c3Bh%0D%0AY2U9InByZXNlcnZlIj4NCjxnPg0KCTxwYXRoIGZpbGw9IiM0MTQwNDIiIGQ9Ik0zMS45NiwxMS45%0D%0ANThoLTMuNDA5djEzLjYzNGgyLjcyN3YyLjA0NWgtMi43Mjd2MTkuMDg3aC0yLjcyN1Y5LjkxM2g2%0D%0ALjEzNlYxMS45NTh6Ii8+DQoJPHBhdGggZmlsbD0iIzQxNDA0MiIgZD0iTTQyLjU5NSw0Ni43MjVo%0D%0ALTIuNzI3bC0wLjM0MS04Ljg2MmgtMi4wMjRsLTAuMzYyLDguODYyaC0yLjcyN2wyLjA0NS0zNi44%0D%0AMTJoNC4wOUw0Mi41OTUsNDYuNzI1eg0KCQkgTTM5LjE4NiwyNy42MzhsLTAuNjgyLTE2LjM2MWwt%0D%0AMC42ODIsMTYuMzYxbC0wLjMyLDguMThoMi4wMjRMMzkuMTg2LDI3LjYzOHoiLz4NCgk8cGF0aCBm%0D%0AaWxsPSIjNDE0MDQyIiBkPSJNNTAuNTAyLDM3Ljc1NWMwLTEuNTA1LTAuMDc4LTIuNzk4LTAuMjM0%0D%0ALTMuODc3Yy0wLjE1Ni0xLjA4LTAuMzYxLTIuMDIxLTAuNjE2LTIuODIzDQoJCXMtMC41NTctMS40%0D%0AOTMtMC45MDYtMi4wN2MtMC4zNDktMC41NzctMC42ODctMS4xMzYtMS4wMTQtMS42NzdjLTAuMzI3%0D%0ALTAuNTQxLTAuNjUtMS4wNzUtMC45NjktMS42MDQNCgkJYy0wLjMyLTAuNTI4LTAuNjA3LTEuMTI3%0D%0ALTAuODYzLTEuNzk0Yy0wLjI1NS0wLjY2Ny0wLjQ2MS0xLjQzOC0wLjYxOC0yLjMxMnMtMC4yMzQt%0D%0AMS45Mi0wLjIzNC0zLjE0MnYtNS4xMzQNCgkJYzAtMC4zNDEsMC4wNTMtMC43MjgsMC4xNi0xLjE2%0D%0AMWMwLjEwNy0wLjQzMywwLjMwOS0wLjgzNywwLjYwNy0xLjIxNHMwLjcxMy0wLjY5NiwxLjI0Ni0w%0D%0ALjk1OQ0KCQljMC41MzMtMC4yNjMsMS4yMjUtMC4zOTQsMi4wNzctMC4zOTRzMS41NDQsMC4xMzEs%0D%0AMi4wNzcsMC4zOTRjMC41MzMsMC4yNjMsMC45NDgsMC41ODMsMS4yNDYsMC45NTlzMC41LDAuNzgx%0D%0ALDAuNjA3LDEuMjE0DQoJCWMwLjEwNiwwLjQzNCwwLjE2LDAuODIsMC4xNiwxLjE2MXY5LjU0NGgt%0D%0AMi43Mjd2LTkuNTQ0YzAtMC4zNDEtMC4wMzktMC42MjEtMC4xMTctMC44NDFzLTAuMTgxLTAuMzkx%0D%0ALTAuMzA5LTAuNTExDQoJCWMtMC4xMjgtMC4xMjEtMC4yNzQtMC4yMDYtMC40MzctMC4yNTZjLTAu%0D%0AMTYzLTAuMDQ5LTAuMzMtMC4wNzUtMC41LTAuMDc1cy0wLjMzNywwLjAyNS0wLjUsMC4wNzUNCgkJ%0D%0AYy0wLjE2NCwwLjA1LTAuMzA5LDAuMTM1LTAuNDM3LDAuMjU1Yy0wLjEyNywwLjEyMS0wLjIzMSww%0D%0ALjI5MS0wLjMwOSwwLjUxYy0wLjA3OSwwLjIyLTAuMTE3LDAuNS0wLjExNywwLjg0djQuMTQ2DQoJ%0D%0ACWMwLDEuNjAyLDAuMTM4LDIuOTQxLDAuNDE0LDQuMDE4YzAuMjc2LDEuMDc3LDAuNjIxLDIuMDE2%0D%0ALDEuMDM1LDIuODE3czAuODMzLDEuNTQyLDEuMjU2LDIuMjI0DQoJCWMwLjQyMywwLjY4MiwwLjg2%0D%0AMSwxLjM4OCwxLjMxMywyLjExOGMwLjQ1MywwLjczLDAuODA1LDEuNTk3LDEuMDU3LDIuNmMwLjI1%0D%0AMSwxLjAwMywwLjM3OCwyLjI1MiwwLjM3OCwzLjc0NXY4LjMyNA0KCQljMCwwLjE3MS0wLjAyMSww%0D%0ALjQ4LTAuMDY0LDAuOTI5cy0wLjE5MiwwLjkwNy0wLjQ0NywxLjM3NmMtMC4yNTYsMC40Ny0wLjY2%0D%0AMSwwLjg4Ni0xLjIxNCwxLjI0OQ0KCQljLTAuNTU0LDAuMzYzLTEuMzQyLDAuNTQ0LTIuMzY1LDAu%0D%0ANTQ0cy0xLjgxMS0wLjE4MS0yLjM2NS0wLjU0M3MtMC45NTgtMC43NzctMS4yMTQtMS4yNDZjLTAu%0D%0AMjU1LTAuNDY5LTAuNDA1LTAuOTI3LTAuNDQ3LTEuMzc0DQoJCXMtMC4wNjQtMC43NTctMC4wNjQt%0D%0AMC45MjdWMzEuMDQ2aDIuNzI3djEyLjI3MWMwLDAuMTcsMC4wMDcsMC4zNzMsMC4wMjEsMC42MDdz%0D%0AMC4wNjQsMC40NTgsMC4xNDksMC42NzENCgkJYzAuMDg1LDAuMjEzLDAuMjIsMC4zOTQsMC40MDUs%0D%0AMC41NDNjMC4xODQsMC4xNDksMC40NDcsMC4yMjQsMC43ODgsMC4yMjRzMC42MDQtMC4wNzQsMC43%0D%0AODgtMC4yMjRzMC4zMi0wLjMzLDAuNDA1LTAuNTQzDQoJCWMwLjA4NS0wLjIxMywwLjEzNS0wLjQz%0D%0ANywwLjE0OS0wLjY3MWMwLjAxNC0wLjIzNCwwLjAyMS0wLjQzOCwwLjAyMS0wLjYwN1YzNy43NTV6%0D%0AIi8+DQoJPHBhdGggZmlsbD0iIzQxNDA0MiIgZD0iTTYzLjg2NCw5LjkxM3YyLjA0NWgtMi43Mjd2%0D%0AMzQuNzY3aC0yLjcyN1YxMS45NThoLTIuNzI3VjkuOTEzSDYzLjg2NHoiLz4NCgk8cGF0aCBmaWxs%0D%0APSIjNDE0MDQyIiBkPSJNNzMuMTM2LDExLjk1OGgtMy40MDl2MTQuMzE2aDIuNzI2djIuMDQ1aC0y%0D%0ALjcyNlY0NC42OGgzLjQwOXYyLjA0NUg2N1Y5LjkxM2g2LjEzNlYxMS45NTh6Ii8+DQoJPHBhdGgg%0D%0AZmlsbD0iIzQxNDA0MiIgZD0iTTg0LjQ1MSw0Ni43MjVoLTIuNzI3bC0zLjQwOC0yNy4zMjF2Mjcu%0D%0AMzIxaC0yLjA0NVY5LjkxM2gyLjcyN2wzLjQwOCwyNy4zMjJWOS45MTNoMi4wNDVWNDYuNzI1eiIv%0D%0APg0KCTxwYXRoIGZpbGw9IiM0MTQwNDIiIGQ9Ik05NS43NjgsNDYuNzI1aC0yLjcyN0w5Mi43LDM3%0D%0ALjg2M2gtMi4wMjRsLTAuMzYxLDguODYyaC0yLjcyN2wyLjA0NS0zNi44MTJoNC4wOUw5NS43Njgs%0D%0ANDYuNzI1eg0KCQkgTTkyLjM1OSwyNy42MzhsLTAuNjgyLTE2LjM2MWwtMC42ODIsMTYuMzYxbC0w%0D%0ALjMyLDguMThIOTIuN0w5Mi4zNTksMjcuNjM4eiIvPg0KCTxwYXRoIGZpbGw9IiM0MTQwNDIiIGQ9%0D%0AIk0xMDYuMjU0LDkuOTEzdjIuMDQ1aC0yLjcyN3YzNC43NjdoLTIuNzI3VjExLjk1OGgtMi43MjhW%0D%0AOS45MTNIMTA2LjI1NHoiLz4NCgk8cGF0aCBmaWxsPSIjNDE0MDQyIiBkPSJNMTE1LjUyNSwxMS45%0D%0ANThoLTMuNDA5djE0LjMxNmgyLjcyN3YyLjA0NWgtMi43MjdWNDQuNjhoMy40MDl2Mi4wNDVoLTYu%0D%0AMTM3VjkuOTEzaDYuMTM3VjExLjk1OHoiLz4NCjwvZz4NCjxwb2x5Z29uIGZpbGw9IiNCNjQzMjYi%0D%0AIHBvaW50cz0iMTcuNTQ5LDEwLjU2MyAyLjcwMywxMC41NjMgMy44NDYsMTQuMTI1IDMuOTQxLDE0%0D%0ALjEyNSA0Ljk4OCwyNy4xMiA4LjUyOCwyNy4xMiAxMC4xMjUsNDguNTYzIA0KCTExLjcyMiwyNy4x%0D%0AMiAxNS4yNjMsMjcuMTIgMTYuMzExLDE0LjEyNSAxNi40MDYsMTQuMTI1ICIvPg0KPC9zdmc+DQo=';
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
    let title = responseChildren[i].data.title;
    let titleArray = title.split('');
    if (titleArray.length > 55) {
      let newTitle = title.substr(0, 55);
      postTitle.innerHTML = newTitle + '...';
      innerPostBox.appendChild(postTitle);
    } else {
      postTitle.innerHTML = title;
      innerPostBox.appendChild(postTitle);
    }

    // add author/date/upvotes container
    let statsBox = document.createElement('div');
    statsBox.className = 'postStats';
    // grab author,date, upvotes
    let author = responseChildren[i].data.author;
    let date = new Date(responseChildren[i].data.created * 1000);
    let newDateStr = date.toString();
    let newDate = newDateStr.substr(0, 15);
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
  let randomSubArray = ['pics', 'hawaii', 'FoodPorn', 'askReddit', 'dogswithjobs', 'nba', 'javascript'];
  let randomize = randomSubArray[Math.floor(Math.random() * randomSubArray.length)];

  sendRequest(randomize)();
}

// // endless scroll attempt
window.onscroll = function(ev) {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    sendRequestInfinite();
  }
};

// search function below
let searchBarBig = document.getElementById('searchBarBig');
searchButtonBig.addEventListener('click', searchFunctionBig);
searchButtonSmall.addEventListener('click', searchFunctionSmall);

function searchFunctionBig() {
  let input = searchBarBig.value;
  sendRequest(input)();
}

function searchFunctionSmall() {
  let input = searchBarSmall.value;
  sendRequest(input)();
}

// user settings open

let squareBox = document.getElementById('squareBox');
squareBox.addEventListener('click', showUser);

function showUser() {
  postsBox.innerHTML = '';
  userContainer.style.display = 'block';
}

let closeButton = document.getElementById('closeButton');
closeButton.addEventListener('click', showPosts);

function showPosts() {
  userContainer.style.display = 'none';
}

let squareBoxSmall = document.getElementById('squareBoxSmall');
squareBoxSmall.addEventListener('click', showUser);

// slider settings function below

settingsButton.addEventListener('click', showSettings);

function showSettings() {
  userContainer.style.display = 'none';
  slideBox.style.display = 'block';
}

let slider = document.getElementById('fontSlider');
var output = document.getElementById('testFont');
output.innerHTML = slider.value + ' pixels';

slider.oninput = function() {
  output.innerHTML = this.value + ' pixels';
  output.style.fontSize = `${this.value}px`;
};

changeFontButton.addEventListener('click', changeFontSize);

function changeFontSize() {
  let findContent = document.getElementsByClassName('navBar');
  for (let i = 0; i < findContent.length; i++) {
    findContent[i].style.fontSize = `${slider.value}px`;
  }
}

backToSettings.addEventListener('click', backSetttings);

function backSetttings() {
  userContainer.style.display = 'block';
  slideBox.style.display = 'none';
}

// background function

changeBackground.addEventListener('click', switchBack);

function switchBack() {
  document.body.style.backgroundImage =
    'url(https://previews.123rf.com/images/atomicchamp/atomicchamp1512/atomicchamp151200020/50324444-sun-and-cloud-background-with-a-pastel-colored-.jpg)';
}

sendRequest('surfing')();
