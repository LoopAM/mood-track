import axios from 'axios';
import { analyzeMood } from './components/mood.js';

// Get track data from the songIds passed into req
async function getSearchTracks(token, trackIds) {
  return await axios({
    method: 'get',
    url: 'https://api.spotify.com/v1/tracks',
    headers: {
      Authorization: 'Bearer ' + token
    },
    params: {
      ids: trackIds.join(',')
    }
  })
  .catch( error => console.log(error) )
  .then( response => {
    return response.data.tracks;
  });
}

// Fetch the tracks' audio features and return them
async function getFeatures(token, tracks) {
  const trackIds = [];

  // Push track ids from tracks paramter into array
  await tracks.forEach( track => {
    trackIds.push(track.id);
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
    trackIds.push(track.id);
  });

  return await axios({
    method: 'get',
    url: 'https://api.spotify.com/v1/recommendations',
    headers: {
      'Authorization': 'Bearer ' + token
    },
    params: {
      limit: 1,
      min_energy: (parseFloat(features.energy) - 0.1).toFixed(2),
      //target_energy: features.energy,
      max_energy: (parseFloat(features.energy) + 0.1).toFixed(2),
      min_loudness: (parseFloat(features.loudness) - 1).toFixed(2),
      //target_loudness: features.loudness,
      max_loudness: (parseFloat(features.loudness) + 1).toFixed(2),
      min_tempo: (parseFloat(features.tempo) - 10).toFixed(0),
      //target_tempo: features.tempo,
      max_tempo: (parseFloat(features.tempo) + 10).toFixed(0),
      min_valence: (parseFloat(features.valence) - 0.1).toFixed(2),
      //target_valence: features.valence,
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
async function getMoodTrackFromSearch(token, trackIds) {
  const searchTracks = await getSearchTracks(token, trackIds);
  const trackFeatures = await getFeatures(token, searchTracks);

  const loudness = (trackFeatures.reduce( (prev, cur) => {
    return prev + cur.loudness;
  }, 0) / trackFeatures.length).toFixed(4);

  const energy = (trackFeatures.reduce( (prev, cur) => {
    return prev + cur.energy;
  }, 0) / trackFeatures.length).toFixed(4);

  const tempo = (trackFeatures.reduce( (prev, cur) => {
    return prev + cur.tempo;
  }, 0) / trackFeatures.length).toFixed(4);

  const valence = (trackFeatures.reduce( (prev, cur) => {
    return prev + cur.valence;
  }, 0) / trackFeatures.length).toFixed(4);

  const speechiness = (trackFeatures.reduce( (prev, cur) => {
    return prev + cur.speechiness;
  }, 0) / trackFeatures.length).toFixed(4);

  const averageFeatures = {
    loudness,
    energy,
    tempo,
    valence,
    speechiness
  };

  const moodAnalysis = analyzeMood(averageFeatures);

  const moodTrack = await getSimilarTrack(token, averageFeatures, searchTracks);
  return {searchTracks, moodTrack, moodAnalysis};
}

export { getMoodTrackFromSearch }
