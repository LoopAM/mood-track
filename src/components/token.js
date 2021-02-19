import 'dotenv/config.js';
import axios from 'axios';

const client = process.env.CLIENT_ID;
const secret = process.env.SECRET;

export async function getSearchToken(req, res, next) {
  await axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        `Basic ${Buffer.from(client + ':' + secret).toString('base64')}`
    },
    params: {
      grant_type: 'client_credentials'
    }
  })
  .catch( error => {
    console.log(error);
  })
  .then( response => {
    req.searchToken = response.data.access_token;
    next();
  });
}
