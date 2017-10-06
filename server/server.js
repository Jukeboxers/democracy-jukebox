// *** Express ***
const express = require('express');
var cors = require('cors')
const app = express();

app.use(cors());
const env = require('./env/credentials.js');

// *** Static Assets ***
app.use(express.static(__dirname + '/public'));



// *** Parser ***
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const querystring = require('querystring');

// *** Session ***
var session = require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));



// *** Routes ***
var users = require('./accounts/user');
var playlist = require('./spotify/playlist');
var spotifyHelpers = require('./spotify/spotifyHelpers.js');


app.get('/songs', playlist.FetchSongs);
app.post('/songs', playlist.AddSongToCollections);

app.get('/songs/search', playlist.SearchSongResults);

app.put('/song', playlist.RegisterVoteOnSong);
app.delete('/song', playlist.DeleteSong);

app.get('/users', users.FetchAllUsers);

// add user to users collection
app.post('/signup', users.NewUserSignUp);

// Host Authentication
app.get('/hostLogin', (req, res) => {
  spotifyHelpers.handleHostLogin(req, res);
});

app.get('/callback', (req, res) => {
  spotifyHelpers.redirectAfterLogin(req, res);
});

// *** Server ***
const server = app.listen(3000, () => {
  console.log('Listening at http://localhost:3000');
});

