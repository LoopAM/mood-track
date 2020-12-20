import css from './style.css';
import axios from 'axios';

// Redirect to Spotify's Authentication endpoint to prompt user
// to log into their Spotify account
function login() {
  axios({
    method: 'get',
    url: '/login'
  });
}

// Event listeners
const loginBtn = document.getElementById('login-btn');
loginBtn.addEventListener('click', login);
