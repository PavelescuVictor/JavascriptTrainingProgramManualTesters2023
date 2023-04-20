import spotifyConfig from './config.js';

export default function () {
  function exchangeToken(code) {
    const client_id = spotifyConfig.CLIENT_ID;
    const redirect_uri = spotifyConfig.REDIRECT_URI;
    const code_verifier = localStorage.getItem('code_verifier');

    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: new URLSearchParams({
        client_id,
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        code_verifier,
      }),
    })
      .then(addThrowErrorToFetch)
      .then((data) => {
        processTokenResponse(data);
        window.history.replaceState({}, document.title, '/');
        window.location.replace(redirect_uri);
      })
      .catch(handleError);
  }

  function handleError(error) {
    console.error(error);
  }

  async function addThrowErrorToFetch(response) {
    if (response.ok) {
      return response.json();
    } else {
      throw { response, error: await response.json() };
    }
  }

  function processTokenResponse(data) {
    access_token = data.access_token;
    refresh_token = data.refresh_token;

    const t = new Date();
    expires_at = t.setSeconds(t.getSeconds() + data.expires_in);

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('expires_at', expires_at);
  }

  let access_token = localStorage.getItem('access_token') || null;
  let refresh_token = localStorage.getItem('refresh_token') || null;
  let expires_at = localStorage.getItem('expires_at') || null;

  const args = new URLSearchParams(window.location.search);
  const code = args.get('code');

  if (code) {
    exchangeToken(code);
  }
}
