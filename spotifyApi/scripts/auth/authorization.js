import spotifyConfig from './config.js';

export default function () {
  function generateRandomString(length) {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async function generateCodeChallenge(codeVerifier) {
    const digest = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(codeVerifier)
    );

    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  function generateUrlWithSearchParams(url, params) {
    const urlObject = new URL(url);
    urlObject.search = new URLSearchParams(params).toString();

    return urlObject.toString();
  }

  function redirectToSpotifyAuthorizeEndpoint() {
    const codeVerifier = generateRandomString(64);

    generateCodeChallenge(codeVerifier).then((code_challenge) => {
      window.localStorage.setItem('code_verifier', codeVerifier);

      window.location = generateUrlWithSearchParams(
        'https://accounts.spotify.com/authorize',
        {
          response_type: 'code',
          client_id,
          scope:
            'user-modify-playback-state user-read-private user-read-email playlist-modify-public playlist-modify-private user-top-read playlist-read-private user-read-playback-state',
          code_challenge_method: 'S256',
          code_challenge,
          redirect_uri,
        }
      );
    });
  }

  const client_id = spotifyConfig.CLIENT_ID;
  const redirect_uri = spotifyConfig.REDIRECT_URI;

  const buttonLogIn = document.getElementById('login-button');
  if (buttonLogIn) {
    buttonLogIn.addEventListener(
      'click',
      redirectToSpotifyAuthorizeEndpoint,
      false
    );
  }

  redirectToSpotifyAuthorizeEndpoint();
}
