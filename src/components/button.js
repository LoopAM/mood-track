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
      market: 'US',
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

export function getMoodDescription(mood) {
  let moodTitle, moodText;

  switch (mood) {
    case 'mad':
      moodTitle = 'Mad at the world';
      moodText = 'Help you stay mad'
      break;
    case 'anxious':
      moodTitle = 'A little anxious';
      moodText = 'Ride out that anxiety'
      break;
    case 'pumped':
      moodTitle = 'Pumped up';
      moodText = 'Keep that pump going'
      break;
    case 'blue':
      moodTitle = 'Feeling a bit blue';
      moodText = 'Feel the blues a bit more'
      break;
    case 'content':
      moodTitle = 'Nice and content';
      moodText = 'Feel more in tune with the moment'
      break;
    case 'good':
      moodTitle = 'Feelin\' real good';
      moodText = 'Keep that serotonin coming'
      break;
    case 'feels':
      moodTitle = 'In the feels';
      moodText = 'Ride out those feelings'
      break;
    case 'bored':
      moodTitle = 'Bored';
      moodText = 'Help you stare at the wall'
      break;
    case 'vibe':
      moodTitle = 'Just vibin\'';
      moodText = 'Keep those good vibes going'
      break;
    default:
      moodTitle = 'Just feeling';
      moodText = 'Help feel some more';
  }

  return {moodTitle, moodText};
}
