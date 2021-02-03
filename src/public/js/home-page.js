// async function handleMoodClick(e) {
//   const target = e.target;
//   const mood = target.dataset.mood;
//   const genre = document.getElementById('genre-select').value;

//   const data = new FormData();
//   data.append("mood", mood);
//   data.append("genre", genre);

//   const request = new XMLHttpRequest();
//   request.open('post', '/mood');
//   request.send(data);

//   // Make fetch request to mood endpoint with
//   // mood and genre in body
//   // await fetch('/mood?' + new URLSearchParams({
//   //   mood: mood,
//   //   genre: genre
//   // }), {
//   //   method: 'get',
//   //   headers: {
//   //     'Content-Type': 'application/json'
//   //   }
//   // })
//   // .catch( err => console.log(err));
// }

// const moodBtns = Array.from(document.getElementsByClassName('mood-btn'));
// moodBtns.forEach( element => {
//   element.addEventListener('click', handleMoodClick);
// });

// function handleSearch(e) {
//   const target = e.target;
//   const targetDiv = target.parentNode.nextElementSibling;
//   const value = target.value;

//   if (value === '' || value === undefined) {
//     return;
//   }

//   // Make fetch request for search query when value changes
//   fetch('/search', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({songTitle: value})
//   })
//   .catch( error => {
//     console.log(error);
//   })
//   .then( response => response.json() )
//   .then( data => {
//     // Show search results in div below input
//     appendSearch(targetDiv, data);
//   });
// }

// // Append data search results to the element
// function appendSearch(element, data) {
//   // Reset the div on each new function call
//   element.textContent = '';

//   // Loop over the returned data
//   data.forEach( obj => {
//     const title = obj.name;
//     const artist = obj.artists[0].name;
//     const art = obj.album.images[1].url;
//     const id = obj.id;

//     const result = document.createElement('div');
//     result.classList.add('result');
//     element.appendChild(result);

//     const coverImg = document.createElement('img');
//     coverImg.classList.add('cover-art');
//     coverImg.src = art;
//     coverImg.setAttribute('width', '100px');
//     coverImg.setAttribute('height', '100px');
//     coverImg.alt = 'Album cover art.';
//     result.appendChild(coverImg);

//     const resultInfo = document.createElement('div');
//     resultInfo.classList.add('result-info');
//     result.appendChild(resultInfo);

//     const resultTitle = document.createElement('p');
//     resultTitle.textContent = title;
//     resultTitle.setAttribute('data-songid', id);
//     resultTitle.classList.add('text');
//     resultInfo.appendChild(resultTitle);

//     const lineBreak = document.createElement('br');
//     resultInfo.appendChild(lineBreak);

//     const resultArtist = document.createElement('p');
//     resultArtist.textContent = artist;
//     resultArtist.classList.add('text');
//     resultInfo.appendChild(resultArtist);

//     // Inserts selected song's title and data-songid into input
//     // element when clicked
//     function insertSelectedSong(e) {
//       const target = e.currentTarget;
//       const parent = target.parentNode;
//       const prevInput = parent.previousElementSibling.children[0];
//       const prevHiddenInput = parent.previousElementSibling.children[1];
//       const targetTitle = target.children[1].firstChild.textContent;
//       const targetId = target.children[1].firstChild.dataset.songid;

//       prevInput.value = targetTitle;
//       prevHiddenInput.value = targetId;

//       // Clear div when a song is selected
//       parent.textContent = '';
//     }

//     result.addEventListener('click', insertSelectedSong);
//   });
// }

// function debounce(callback, delay) {
//   let interval;
//   return (...args) => {
//     clearTimeout(interval);
//     interval = setTimeout( () => callback(...args), delay);
//   };
// }

// const searchDebounce = debounce(handleSearch, 250);

// // Event listeners for search inputs
// const search1 = document.getElementById('search-input-1');
// search1.addEventListener('input', (e) => {
//   searchDebounce(e);
// });

// const search2 = document.getElementById('search-input-2');
// search2.addEventListener('input', (e) => {
//   searchDebounce(e);
// });

// const search3 = document.getElementById('search-input-3');
// search3.addEventListener('input', (e) => {
//   searchDebounce(e);
// });
