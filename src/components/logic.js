import axios from 'axios';
import { analyzeMood } from './mood.js';

// Get the user's information from callback redirect
// after the user logs into their Spotify account
async function getUser(token) {
  return await axios({
    method: 'get',
    url: 'https://api.spotify.com/v1/me',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  .catch( err => console.log(err) )
  .then( result => result.data );
}

// Get the user's most recent tracks after the redirect
// to the callback url once the user has logged in to Spotify
async function getRecentTracks(token) {
  return await axios({
    method: 'get',
    url: 'https://api.spotify.com/v1/me/player/recently-played?limit=5',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  .catch( err => console.log(err) )
  .then( result => {
    return result.data.items
  });
}

// Fetch the tracks' audio features and return them
async function getFeatures(token, tracks) {
  const trackIds = [];

  // Push track ids from tracks paramter into array
  await tracks.forEach( track => {
    trackIds.push(track.track.id);
  });

  return await axios({
    method: 'get',
    url: 'https://api.spotify.com/v1/audio-features',
    headers: {
      'Authorization': 'Bearer ' + token
    },
    params: {
      ids: trackIds.join(',')
    }
  })
  .catch( error => console.log(error) )
  .then( response => {
    return response.data.audio_features;
  });
}

// Fetch a song that is similar to the average features
// analyzed from the most recent tracks
async function getSimilarTrack(token, features, tracks) {
  const trackIds = [];

  // Push track ids from tracks paramter into array
  await tracks.forEach( track => {
    trackIds.push(track.track.id);
  });

  return await axios({
    method: 'get',
    url: 'https://api.spotify.com/v1/recommendations',
    headers: {
      'Authorization': 'Bearer ' + token
    },
    params: {
      limit: 1,
      market: 'from_token',
      min_energy: (parseFloat(features.energy) - 0.1).toFixed(2),
      max_energy: (parseFloat(features.energy) + 0.1).toFixed(2),
      min_valence: (parseFloat(features.valence) - 0.1).toFixed(2),
      max_valence: (parseFloat(features.valence) + 0.1).toFixed(2),
      min_speechiness: (parseFloat(features.speechiness) - 0.1).toFixed(2),
      max_speechiness: (parseFloat(features.speechiness) + 0.1).toFixed(2),
      seed_tracks: trackIds.join(',')
    }
  })
  .catch( error => console.log(error) )
  .then( response => {
    return response.data;
  });
}

// Analyze the tracks' audio features and fetch a track that matches
// the averages of the features collected
async function getMoodTrack(token) {
  const recentTracks = await getRecentTracks(token);
  const trackFeatures = await getFeatures(token, recentTracks);

  const energy = (trackFeatures.reduce( (prev, cur) => {
    return prev + cur.energy;
  }, 0) / trackFeatures.length).toFixed(4);

  const valence = (trackFeatures.reduce( (prev, cur) => {
    return prev + cur.valence;
  }, 0) / trackFeatures.length).toFixed(4);

  const speechiness = (trackFeatures.reduce( (prev, cur) => {
    return prev + cur.speechiness;
  }, 0) / trackFeatures.length).toFixed(4);

  const averageFeatures = {
    energy,
    valence,
    speechiness
  };

  const moodAnalysis = analyzeMood(averageFeatures);

  const moodTrack = await getSimilarTrack(token, averageFeatures, recentTracks);
  return {recentTracks, moodTrack, moodAnalysis}
}

export { getUser, getMoodTrack }
