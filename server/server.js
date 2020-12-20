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

const __dirname = dirname(fileURLToPath(import.meta.url));

const port = process.env.PORT || 5500;
const client = process.env.CLIENT_ID;
const secret = process.env.SECRET;
const redirectURI = process.env.REDIRECT_URI;

// Set up middleware
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// Set up templateing engine
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.engine('hbs', handlebars({
  layoutsDir: __dirname + '/views/layouts',
  extname: 'hbs'
}));



app.get('/', (req, res) => {
  //res.sendFile('index.html');
  res.render('home',{layout: 'index'});
});

app.get('/login', Login);

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
    const accessToken = result.data.access_token;
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
      console.log('display name', displayName);
      console.log('moodtrack', moodTrack.tracks[0]);
      console.log('album cover', moodTrack.tracks[0].album.images);
      console.log('recent tracks', recentTracks[0].track);
      res.render('mood', {
        layout: 'index',
        display_name: displayName,
        mood: 'Pumped Up',
        mood_desc: 'keep that pump going',
        mood_track: moodTrack.tracks[0],
        recent_tracks: recentTracks
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Mood Track running. Listening on port ${port}`);
});
