import axios from 'axios';

async function getUser(token) {
  return await axios({
    method: 'get',
    url: 'https://api.spotify.com/v1/me',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  .catch( err => console.log(err) )
  .then( result => {
    console.log(result.data);
    return result.data;
  })
}

async function getRecentTracks(token) {
  return await axios({
    method: 'get',
    url: 'https://api.spotify.com/v1/me/player/recently-played?limit=5',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  .catch( err => console.log(err) )
  .then( result => result.data );
}

export { getUser, getRecentTracks }
