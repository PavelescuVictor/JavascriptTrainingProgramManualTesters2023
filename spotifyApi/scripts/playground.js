export default async () => {
  const fetchData = async () => {
    const response = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    const responseData = await response.json();
    return responseData;
  };

  const fetchPlaylist = async () => {
    const response = await fetch(
      'https://api.spotify.com/v1/me/playlists?limit=50',
      {
        method: 'GET',
        headers: {
          authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    const responseData = await response.json();
    return responseData;
  };

  const generateCards = (playlists) => {
    return playlists.map((playlist) => {
      const card = document.createElement('div');
      card.setAttribute('id', playlist.id);

      const image = document.createElement('img');
      if (playlist.images.length) {
        image.setAttribute('src', playlist.images[0].url);
      }
      card.appendChild(image);

      const title = document.createElement('p');
      title.innerText = playlist.name;
      card.appendChild(title);

      const description = document.createElement('p');
      description.innerText = playlist.description;
      card.appendChild(description);

      const owner = document.createElement('p');
      owner.innerText = `Owner: ${playlist.owner['display_name']}`;
      card.appendChild(owner);

      const externalLink = document.createElement('a');
      externalLink.setAttribute('href', playlist['external_urls'].spotify);
      externalLink.setAttribute('target', '_blank');
      externalLink.innerText = 'Open in app';
      card.appendChild(externalLink);

      const requestSongs = document.createElement('button');
      requestSongs.innerText = 'Get Songs';
      requestSongs.addEventListener('click', handleGetPlaylistSongs);
      card.appendChild(requestSongs);

      return card;
    });
  };

  const handleGetPlaylistSongs = async (event) => {
    const playlistId = event.target.parentElement.getAttribute('id');

    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        method: 'GET',
        headers: {
          authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );

    const tracks = await response.json();
    console.log(tracks);
  };

  const getArtist = async (event) => {
    const artistId = '5bvwbAyrx6Yk8oLHqOnJ9p';

    const response = await fetch (
      `https://api.spotify.com/v1/artists/${artistId}`,
      {
        method: 'GET',
        headers: {
          authorization: `Bearer ${localStorage.getItem('access_token')}`,
        }
      }
    )
    const artist = await response.json();
    console.log(artist);
  }

  const handleSkipToNext = async () => {
    const devices = await getDevices();
    const body = JSON.stringify({
      device_id: devices.devices[0].id,
    });
    // setTimeout(() => {
    //   handleSkip(body);
    // }, 5000);
    handleSkip(body);
  };

  const getDevices = async () => {
    const response = await fetch(
      'https://api.spotify.com/v1/me/player/devices',
      {
        method: 'GET',
        headers: {
          authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );

    const devices = await response.json();
    return devices;
  };

  const handleSkip = async (body) => {
    const response = await fetch('https://api.spotify.com/v1/me/player/next', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body,
    });
  };

  const data = await fetchData();
  console.log(data);

  const playlists = await fetchPlaylist();
  console.log(playlists);

  const cards = generateCards(playlists.items);

  const bodyElement = document.querySelector('body');
  const cardsList = document.createElement('div');

  cards.forEach((card) => {
    cardsList.appendChild(card);
  });

  bodyElement.appendChild(cardsList);

  const skipToNextButton = document.createElement('button');
  skipToNextButton.innerText = 'Skip song';
  skipToNextButton.addEventListener('click', handleSkipToNext);
  bodyElement.appendChild(skipToNextButton);

  const getArtistButton = document.createElement('button');
  getArtistButton.innerText = 'Get Artitst';
  getArtistButton.addEventListener('click', getArtist);
  bodyElement.appendChild(getArtistButton)
};
