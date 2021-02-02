import axios from 'axios';

export async function getPredefinedMoodTracks(token, mood, genre) {
  let minValence; let maxValence;
  let minEnergy; let maxEnergy;

  switch (mood) {
    case 'mad':
      minValence = 0.00; maxValence = 0.34;
      minEnergy = 0.66; maxEnergy = 1.00;
      break;
    case 'anxious':
      minValence = 0.34; maxValence = 0.66;
      minEnergy = 0.66; maxEnergy = 1.00;
      break;
    case 'pumped':
      minValence = 0.66; maxValence = 1.00;
      minEnergy = 0.66; maxEnergy = 1.00;
      break;
    case 'blue':
      minValence = 0.00; maxValence = 0.34;
      minEnergy = 0.34; maxEnergy = 0.66;
      break;
    case 'content':
      minValence = 0.34; maxValence = 0.66;
      minEnergy = 0.34; maxEnergy = 0.66;
      break;
    case 'good':
      minValence = 0.66; maxValence = 1.00;
      minEnergy = 0.34; maxEnergy = 0.66;
      break;
    case 'feels':
      minValence = 0.00; maxValence = 0.34;
      minEnergy = 0.00; maxEnergy = 0.34;
      break;
    case 'bored':
      minValence = 0.34; maxValence = 0.66;
      minEnergy = 0.00; maxEnergy = 0.34;
      break;
    case 'vibe':
      minValence = 0.66; maxValence = 1.00;
      minEnergy = 0.00; maxEnergy = 0.34;
      break;
    default:
      minValence = 0.5; maxValence = 0.5;
      minEnergy = 0.5; maxEnergy = 0.5;
  }

  return await axios({
    method: 'get',
    url: 'https://api.spotify.com/v1/recommendations',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    params: {
      limit: 5,
      min_valence: minValence,
      max_valence: maxValence,
      min_energy: minEnergy,
      max_energy: maxEnergy,
      seed_genres: genre,
    }
  })
  .catch( err => console.log(err))
  .then( response => {
    return response.data;
  });
}
