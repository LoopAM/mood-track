import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import { dirname } from 'path';
import bodyParser from 'body-parser';
import querystring from 'querystring';
import axios from 'axios';
import { fileURLToPath } from 'url';
import handlebars from 'express-handlebars';

import Login from './login.js';
import { getUser, getMoodTrack } from './logic.js';
import { getSearchToken } from './token.js';
import { getMoodTrackFromSearch } from './submit.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const port = process.env.PORT || 5500;
const client = process.env.CLIENT_ID;
const secret = process.env.SECRET;
const redirectURI = process.env.REDIRECT_URI;

let accessToken = '';

// Set up middleware
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// Set up templating engine
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.engine('hbs', handlebars({
  layoutsDir: __dirname + '/views/layouts',
  extname: 'hbs'
}));

// HOME PAGE
app.get('/', (req, res) => {
  //res.sendFile('index.html');
  res.render('home', {layout: 'index'});
});

// End point when user clicks login button
app.get('/login', Login);

// End point for redirect from Spotify authentication
// from /login end point
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
    accessToken = result.data.access_token;
    const tokenType = result.data.token_type;
    const refreshToken = result.data.refresh_token;

    Promise.all([
      getUser(accessToken),
      getMoodTrack(accessToken)
    ])
    .catch( err => console.log(err))
    .then( results => {
      const displayName = results[0].display_name;
      const recentTracks = results[1].recentTracks;
      const moodTrack = results[1].moodTrack;
      const moodAnalysis = results[1].moodAnalysis;
      /* console.log('display name', displayName);
      console.log('moodtrack', moodTrack.tracks[0]);
      console.log('album cover', moodTrack.tracks[0].album.images);
      console.log('recent tracks', recentTracks[0].track); */
      res.render('mood', {
        layout: 'index',
        display_name: displayName,
        mood: moodAnalysis.mood,
        mood_desc: moodAnalysis.mood_desc,
        mood_track: moodTrack.tracks[0],
        recent_tracks: recentTracks
      });
    });
  });
});

// End point for when user clicks add to library
// on their mood track
app.post('/add', async (req, res) => {
  // Song id from req params
  const id = req.body.songId;

  await axios({
    method: 'put',
    url: 'https://api.spotify.com/v1/me/tracks',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    },
    data: {
      ids: [id]
    }
  })
  .catch( error => {
    console.log(error)
    res.sendStatus(400);
  })
  .then( response => {
    if (response.status === 200) {
      res.sendStatus(200);
    }
  });
});

// Middleware for /search and /submit endpoints to verify
// search token and fetch a new one if necessary
app.use('/search', getSearchToken)


// Fetch songs from Spotify search api
app.post('/search', async (req, res) => {
  const songTitle = req.body.songTitle;

  await axios({
    method: 'get',
    url: 'https://api.spotify.com/v1/search',
    headers: {
      Authorization: `Bearer ${req.searchToken}`
    },
    params: {
      q: songTitle,
      type: 'track',
      limit: 5,

    }
  })
  .catch( error => {
    console.log(error);
  })
  .then( response => {
    res.json(response.data.tracks.items);
  })
});

app.use('/submit', getSearchToken)

// Get mood track similar to the login api endpoint
// Uses search tracks as seeds for mood track
app.post('/submit', async (req, res) => {
  const id1 = req.body.song_id_1;
  const id2 = req.body.song_id_2;
  const id3 = req.body.song_id_3;
  const songIds = [id1, id2, id3];
  const searchToken = req.searchToken;

  Promise.all([
    getMoodTrackFromSearch(searchToken, songIds)
  ])
  .catch( error => console.log(error) )
  .then( result => {
    const searchTracks = result[0].searchTracks;
    const moodTrack = result[0].moodTrack;
    const moodAnalysis = result[0].moodAnalysis;

    res.render('mood', {
      layout: 'index',
      mood: moodAnalysis.mood,
      mood_desc: moodAnalysis.mood_desc,
      mood_track: moodTrack.tracks[0],
      search_tracks: searchTracks
    });
  });
});

app.listen(port, () => {
  console.log(`Mood Track running. Listening on port ${port}`);
});
