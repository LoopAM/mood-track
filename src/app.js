import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import { dirname } from 'path';
import querystring from 'querystring';
import axios from 'axios';
import { fileURLToPath } from 'url';
import handlebars from 'express-handlebars';
import cluster from 'cluster';
import os from 'os';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import Login from './components/login.js';
import { getUser, getMoodTrack } from './components/logic.js';
import { getSearchToken } from './components/token.js';
import { getPredefinedMoodTracks, getMoodDescription } from './components/button.js';

// Hack to make __dirname work with ES Modules
const __dirname = dirname(fileURLToPath(import.meta.url));

// ENV variables
const port = process.env.PORT || 5500;
const client = process.env.CLIENT_ID;
const secret = process.env.SECRET;
const redirectURI = process.env.REDIRECT_URI;


if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < os.cpus().length; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {

  // Set up middleware
  const app = express();
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(compression());
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
      const accessToken = result.data.access_token;

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

        res.cookie('moodToken', accessToken, {
          maxAge: 1000 * 60 * 60,
          httpOnly: true
        })
        .render('login-mood', {
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
    const token = req.cookies['moodToken'];

    await axios({
      method: 'put',
      url: 'https://api.spotify.com/v1/me/tracks',
      headers: {
        Authorization: 'Bearer ' + token,
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

  // End point for when the user selects one of the mood buttons
  app.use('/mood', getSearchToken);
  app.post('/mood', async (req, res) => {
    const mood = req.body.mood;
    const genre = req.body.genre;
    const searchToken = req.searchToken;

    const {moodTitle, moodText} = getMoodDescription(mood);
    const songs = await getPredefinedMoodTracks(searchToken, mood, genre);

    res.render('button-mood', {
      layout: 'index',
      mood_title: moodTitle,
      mood_text: moodText,
      genre: genre,
      tracks: songs.tracks,
    });
  });

  app.listen(port, () => {
    console.log(`Mood Track running. Listening on port ${port}`);
  });
}
