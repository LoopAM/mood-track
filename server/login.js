import 'dotenv/config.js';
import querystring from 'querystring';

const client = process.env.CLIENT_ID;
const redirectURI = process.env.REDIRECT_URI;

const scopes = [
  'user-read-recently-played',
  'user-read-private',
  'user-library-modify'
]

// Redirects request to Spotify's authorization endpoint
// On user login in, redirects back to /callback endpoint
function Login(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client,
      scope: scopes.join(' '),
      redirect_uri: redirectURI
    }));
}

export default Login;
