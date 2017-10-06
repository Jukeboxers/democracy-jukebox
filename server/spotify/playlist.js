// *** Helper ***
const spotifyHelpers = require('./spotifyHelpers.js');

const User = require('../../db/user');
const Song = require('../../db/song');

// Table of Contents

// AddSongToCollections     -     add song to both user collection and songs collection in mongodb
// DeleteSong               -     delete song from songs collection in mongodb
// FetchSongs               -     fetch top 50 songs by netVoteCount from songs collection and send resonse to client
// RegisterVoteOnSong       -     update vote on songs collection
// SearchSongResults        -     fetch song results // defaulted to 50 songs

exports.AddSongToCollections = (req, res) => {
  var newSong = new Song({
    name: req.body.name,
    image: req.body.image,
    link: req.body.link,
    userName: req.body.userName,
    artist: req.body.artist
  });

  User.findOne({name: req.body.userName})
  .then((user) => {
    if (user) {
      user.addedSongs.push(newSong);
      user.save();
      return newSong.save();
    }
  })
  .then(() => {
    res.sendStatus(201);
  })
  .catch((err) => {
    res.status(400).send(err);
  });
};

exports.DeleteSong = (req, res) => {
  const songId = req.query.id;
  Song.remove({'_id': songId}, (err) => {
    if (err) { console.log(err); }
  });
  res.sendStatus(201);
}

exports.FetchSongs = (req, res) => {
  Song.find({}).sort({netVoteCount: 'descending'}).limit(50)
  .then((songs) => {
    res.json(songs);
  })
  .catch((err) => {
    res.status(400).send(err);
  });
};

exports.RegisterVoteOnSong = (req, res) => {
  Song.findOne({name: req.body.name})
  .then(function(song) {
    if (song) {
      if(req.body.vote > 0) {
        song.upVoteCount++;
      } else {
        song.downVoteCount++;
      }
      song.save();
      res.sendStatus(201);
    }
  })
  .catch((err) => {
    res.status(400).send(err);
  });
};

exports.SearchSongResults = (req, res) => {
  spotifyHelpers.getTrackSearchResults(req.query.query)
  .then((results) => {
    res.json(results);
  })
  .catch((err) => {
    res.status(400).send(err);
  });
};