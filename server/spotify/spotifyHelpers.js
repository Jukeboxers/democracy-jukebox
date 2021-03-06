const credentials = require('../env/credentials.js');
const Promise = require('bluebird');
const cookieParser = require('cookie-parser');
const request = require('request');
const querystring = require('querystring');

const searchAuthOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    Authorization:
      'Basic ' +
      new Buffer(
        credentials.client_id + ':' + credentials.client_secret
      ).toString('base64')
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

const generateRandomString = length => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

//Table of Contents
//getTrackSearchResults     -       use Spotify API credentials to get search results without needing to use Oauth
//handleHostLogin           -       used for checking state of browser for authentication
//redirectAfterLogin        -       redirect host user to Spotify login page to obtain authorization code

exports.getTrackSearchResults = queryString => {
  return new Promise((resolve, reject) => {
    if (credentials.access_token) {
      request.post(searchAuthOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          // const token = body.access_token;
          const token = credentials.access_token;
          const options = {
            url: `https://api.spotify.com/v1/search?q=${queryString}&type=track&market=US&limit=10`,
            headers: { Authorization: 'Bearer ' + token },
            json: true
          };
          request.get(options, (error, response, body) => {
            if (error) {
              reject(error);
            }
            resolve(body);
          });
        }
      });
    } else {
      reject(new Error('Host must login'));
    }
  });
};

exports.handleHostLogin = (req, res) => {
  const state = generateRandomString(16);
  const scope =
    'user-read-private user-read-email user-read-playback-state user-modify-playback-state';

  res.cookie('spotify_auth_state', state);

  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: credentials.client_id,
        scope: scope,
        redirect_uri: credentials.redirect_uri,
        state: state
      })
  );
};

exports.redirectAfterLogin = (req, res) => {
  const code = req.query.code || null;

  const playerAuthOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: credentials.redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(
          credentials.client_id + ':' + credentials.client_secret
        ).toString('base64')
    },
    json: true
  };

  //make a new request to spotify API and provide the authorization code in exchange for a token
  request.post(playerAuthOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      const refresh_token = body.refresh_token;

      credentials.access_token = access_token;
      credentials.refresh_token = refresh_token;

      console.log(credentials);

      //redirect host user back to playlist page and pass token to browser
      res.redirect(
        credentials.redirect_homepage +
          '#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          })
      );
    } else {
      res.redirect(
        '/#' +
          querystring.stringify({
            error: 'invalid_token'
          })
      );
    }
  });
};

exports.GetAccessToken = (req,res) => {
  if (credentials.access_token) {
    res.send(credentials.access_token);
  } else {
    res.status(400).send('no access token');
  }
}