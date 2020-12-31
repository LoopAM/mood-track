// Takes in the audio features from the tracks provided
// and then returns a mood and a description based on the
// features
function analyzeMood(features) {
  const loudness = features.loudness;
  const energy = features.energy;
  const tempo = features.tempo;
  const valence = features.valence;

  if (valence <= 0.33) {
    if (energy <= 0.33) {
      // depressed
      return {
        mood: 'In the feels',
        mood_desc: 'Ride out those feelings'
      }
    }
    else if (energy >= 0.67) {
      // Angry
      return {
        mood: 'Mad at the world',
        mood_desc: 'Help you stay mad'
      }
    }
    else {
      // Between angry and depressed
      return {
        mood: 'Feeling down',
        mood_desc: 'Keep you down, but not out'
      }
    }
  }
  else if (valence >- 0.67) {
    if (energy <= 0.33) {
      // Relaxed
      return {
        mood: 'Just vibin\'',
        mood_desc: 'Keep those good vibes going'
      }
    }
    else if (energy >= 0.67) {
      // Pumped up
      return {
        mood: 'Pumped up',
        mood_desc: 'Keep that pump going'
      }
    }
    else {
      // Content
      return {
        mood: 'Feeling good',
        mood_desc: 'Keep that seratonin coming'
      }
    }
  }
  else {
    return {
      mood: 'Just feeling',
      mood_desc: 'Feel some more'
    }
  }
}

export { analyzeMood };
