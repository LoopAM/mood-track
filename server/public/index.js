import '../node_modules/axios/index.js';

console.log('Loaded into mood page');

async function addSong(e) {
  // Get target element
  const target = e.target;

  // Get song id in data attribute
  const songId = target.dataset.songId;

  // Make axios post request to server to add song
  await axios({
    method: 'post',
    url: '/add',
    data: {
      id: songId
    }
  })
  .catch( error => console.log(error) )
  .then( response => {
    if (response.status === 'OK') {
      console.log('Song added!');
      target.textContent = 'Added!';
    } else {
      console.log('Failure to add');
      target.textContent = 'Failed to add';
    }
  });
}
