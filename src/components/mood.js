// Takes in the audio features from the tracks provided
// and then returns a mood and a description based on the
// features
function analyzeMood(features) {
  const energy = features.energy;
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
        mood: 'Feeling a bit blue',
        mood_desc: 'Feel the blues a bit more'
      }
    }
  }
  else if (valence >= 0.67) {
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
        mood: 'Feeling real good',
        mood_desc: 'Keep that serotonin coming'
      }
    }
  }
  else {
    if (energy <= 0.33) {
      return {
        mood: 'Bored',
        mood_desc: 'Stare at the wall'
      }
    } else if (energy >= 0.66) {
      return {
        mood: 'A little anxious',
        mood_desc: 'Ride out that anxiety'
      }
    } else {
      return {
        mood: 'In tune with the world',
        mood_desc: 'Feel more in tune'
      }
    }
  }
}

export { analyzeMood };
