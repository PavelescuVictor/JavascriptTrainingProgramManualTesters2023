const baseURL = 'http://localhost:3000';

const login = async () => {
  const url = `${baseURL}/login`;
  const method = 'POST';
  const payload = {
    username: 'user1',
    password: 'password1',
  };
  const headers = {
    'Content-Type': 'application/json',
  };
  const response = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(payload),
  });
  const results = await response.json();

  localStorage.setItem('token', results.token);
  localStorage.setItem('userId', results.userData.userId)
};

const getAccessToken = () => {
  return localStorage.getItem('token');
};

const getUserId = () => {
  return localStorage.getItem('userId');
}

const requestMovies = async () => {
  const url = `${baseURL}/movies`;
  const method = 'GET';
  const headers = {
    Authorization: `Bearer ${getAccessToken()}`,
  };
  const response = await fetch(url, {
    method,
    headers,
  })
  if (response.status === 401) {
    setMessageMovies("You are not logged in!");
    return;
  }
  if (response.status === 500) {
    setMessageMovies("There is an internal server error!");
  }
  const movies = await response.json();
  setMovies(movies)
};

const setMovies = (movies) => {
  const moviesWrapper = document.querySelector('.movies__content');
  moviesWrapper.innerHTML = '';
  movies.forEach((movie) => {
    const movieCard = createMovieCard(movie);
    moviesWrapper.appendChild(movieCard);
  });
}

const setMessageMovies = (message) => {
  const moviesWrapper  = document.querySelector('.movies');
  const messageWrapper = document.createElement('div');
  messageWrapper.classList.add('message');
  const messageText = document.createElement('p');
  const textNode = document.createTextNode(message);
  messageText.appendChild(textNode);
  messageWrapper.appendChild(messageText);
  moviesWrapper.appendChild(messageWrapper);
}

const requestBookmarks = async () => {
  const url = `${baseURL}/bookmarks/${getUserId()}`;
  const method = 'GET';
  const headers = {
    Authorization: `Bearer ${getAccessToken()}`,
  };
  const response = await fetch(url, {
    method,
    headers,
  })
  if (response.status === 401) {
    setBookmarksMessage("You are not logged in!");
    return;
  }
  if (response.status === 500) {
    setBookmarksMessage("There is an internal server error!");
  }
  const bookmarks = await response.json();
  setBookmarks(bookmarks)
}

const setBookmarks = (bookmarks) => {
  const bookmarksWrapper = document.querySelector('.bookmarks__content');
  bookmarksWrapper.innerHTML = '';
  bookmarks.forEach((bookmark) => {
    const bookmarkCard = createMovieCard(bookmark, false);
    bookmarksWrapper.appendChild(bookmarkCard);
  });
};

const setBookmarksMessage = (message) => {
  const bookmarksWrapper = document.querySelector('.bookmarks');
  const messageWrapper = document.createElement('div');
  messageWrapper.classList.add('message');
  const messageText = document.createElement('p');
  const textNode = document.createTextNode(message);
  messageText.appendChild(textNode);
  messageWrapper.appendChild(messageText);
  bookmarksWrapper.appendChild(messageWrapper);
}

const addBookmark = (movie) => {
  const url = `${baseURL}/bookmarks`;
  const method = 'POST';
  const headers = {
    Authorization: `Bearer ${getAccessToken()}`,
    'Content-Type': 'application/json',
  };
  const payload = {
    userId: getUserId(),
    movieId: movie.id,
  }
  fetch(url, {
    method,
    headers,
    body: JSON.stringify(payload),
  })
  .then((response) => {
    if (response.status === 200) requestBookmarks();
    else {
      console.log("here");
    }
  })
}

const createMovieCard = (movie, withBookmarkButton = true) => {
  // Paragraph Node
  const titleNode = document.createTextNode(movie.title);
  const paragraphTitle = document.createElement('p');
  paragraphTitle.appendChild(titleNode);
  paragraphTitle.classList.add('card-title');

  // Card Info Wrapper
  const cardInfoWrapper = document.createElement('div');
  cardInfoWrapper.classList.add('card-info');
  cardInfoWrapper.appendChild(paragraphTitle);

  // Button Node
  if (withBookmarkButton) {
    const buttonTextNode = document.createTextNode('Bookmark');
    const buttonNode = document.createElement('button');
    buttonNode.appendChild(buttonTextNode);
    buttonNode.classList.add('card-button');
    buttonNode.addEventListener('click', () => addBookmark(movie));
    cardInfoWrapper.appendChild(buttonNode);
  }

  // Card Image
  const cardImage = document.createElement('img');
  cardImage.classList.add('card-image');
  cardImage.setAttribute('alt', movie.title);
  cardImage.setAttribute('src', `${baseURL}/images/${movie.image}`);

  // Card Wrapper
  const cardWrapper = document.createElement('div');
  cardWrapper.classList.add('card');
  cardWrapper.appendChild(cardImage);
  cardWrapper.appendChild(cardInfoWrapper);

  return cardWrapper;
};

const displayMoviesTest = () => {
  console.log("Movies Tests - Test to see movies are displayed properly");
  const mockMoviesData = [
    {
      "id": "3a5029b4-a5fc-4fb1-aec1-452ae3b6207f",
      "title": "Dune",
      "image": "Dune.jpg"
    },
    {
      "id": "e64bb9c5-f6d9-46d7-9ec8-8582487f262a",
      "title": "GodFather 1",
      "image": "GodFather_1.jpg"
    },
    {
      "id": "1e389c7b-308a-425d-839a-780e937ef3da",
      "title": "GodFather 2",
      "image": "GodFather_2.jpg"
    }
  ]
  setMovies(mockMoviesData);
  const moviesContentWrapper = document.querySelectorAll('.movies__content')[0];
  const movies = moviesContentWrapper.querySelectorAll('.card');
  if (movies.length !== mockMoviesData.length) console.log("FAILED")
  console.log("PASSED");
}

const internalServerErrorTest = () => {
  console.log("Movies Tests - Test to see internal server error message is present");
  const message = "Internal server error";
  setMessageMovies(message);
  const messageWrapper = document.querySelectorAll('.message');
  if (!messageWrapper || messageWrapper.length !== 1) {
    console.log("FAILED")
    return;
  }
  const messageText = messageWrapper[0].querySelectorAll('p')[0];
  if (messageText.textContent !== message) {
    console.log("FAILED");
    return;
  }
  console.log("PASSED")
}

const unauthorizedTest = () => {
  console.log("Movies Tests - Test to see unauthorized message is present");
  const message = "You are not logged in!";
  setMessageMovies(message);
  const messageWrapper = document.querySelectorAll('.message');
  if (!messageWrapper || messageWrapper.length !== 1) {
    console.log("FAILED")
    return;
  }
  const messageText = messageWrapper[0].querySelectorAll('p')[0];
  if (messageText.textContent !== message) {
    console.log("FAILED");
    return 
  }
  console.log("PASSED")
}

const startTests = () => {
  // Reset between tests the state of app to be clear
  // Catch the failed implementation from the FE side for the multiple message items
  // use data-tesid custom attributes for elements
  console.log("Movies Tests");
  displayMoviesTest();
  internalServerErrorTest();
  unauthorizedTest();
}

const requestLoginButton = document.getElementById('request-login');
requestLoginButton.addEventListener('click', login);

const requestMoviesButton = document.getElementById('request-movies');
requestMoviesButton.addEventListener('click', requestMovies);

const requestBookmarksButton = document.getElementById('request-bookmarks');
requestBookmarksButton.addEventListener('click', requestBookmarks);

const testButton = document.getElementById('test');
testButton.addEventListener('click', startTests)

export default {};
