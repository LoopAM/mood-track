import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import path, { dirname } from 'path';
import bodyParser from 'body-parser';
import querystring from 'querystring';
import axios from 'axios';
import { getUser, getRecentTracks } from './logic';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const port = process.env.PORT || 5500;
const client = process.env.CLIENT_ID;
const secret = process.env.SECRET;
const redirectURI = process.env.REDIRECT_URI;

const scopes = [
  'user-read-recently-played',
  'user-read-private',
  'user-library-modify'
]

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, './client/dist')));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.get('/login', (req, res) => {
  // Get auth code from Spotify's authorize endpoint
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client,
      scope: scopes.join(' '),
      redirect_uri: redirectURI
    }));
});

app.get('/callback', (req, res) => {
  if (req.query.error) { res.send('error') }

  const code = req.query.code || null;

  axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectURI,
    client_id: client,
    client_secret: secret
  }))
  .catch( err => {
    console.log(err);
  })
  .then( result => {
    console.log(result.data);

    const accessToken = result.data.access_token;
    const tokenType = result.data.token_type;
    const refreshToken = result.data.refresh_token;

    Promise.all([
      getUser(accessToken),
      getRecentTracks(accessToken)
    ])
    .catch( err => console.log(err))
    .then( results => {
      console.log(results);
      res.send(results);
    });
  });
});

app.listen(port, () => {
  console.log(`Mood Track running. Listening on port ${port}`);
});
