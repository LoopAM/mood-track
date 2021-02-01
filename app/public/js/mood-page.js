async function addSong(e) {
  // Get target element
  const target = e.target;

  // Get song id in data attribute
  const songId = target.dataset.songid;

  // Make fetch post request to server to add song
  await fetch('/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({songId: songId})
  })
  .catch( error => console.log(error) )
  .then( response => {
    if (response.status === 200) {
      target.textContent = 'Song added';
    } else {
      target.textContent = 'Failed to add';
    }
  });
}

const addSongBtn = document.getElementById('add-song-btn');
if (addSongBtn) {
  addSongBtn.addEventListener('click', addSong);
}
