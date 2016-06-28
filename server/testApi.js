'use strict';
const router = require('express').Router(); // eslint-disable-line new-cap
const tinder = require('tinder');
const client = new tinder.TinderClient();
const CONFIG = require('./config.js');
let token;

const tinderauth = (req, res, next) => {
  client.setAuthToken(token);
  if (client.isAuthorized()) {
    next();
  } else {
    res.send('not authorized');
  }
};

/*
  Gets Tinder XAuth Token with FB Token and Profile Id
*/
router.get('/tinder/auth', (req, res) => {
  client.authorize(CONFIG.token, CONFIG.profileid, (err, authed) => {
    token = client.getAuthToken();
    if (err) res.json(err);
    else res.json(authed);
  });
});

/*
  Gets User Profile Information
*/
router.get('/tinder/self', tinderauth, (req, res) => {
  client.getAccount((err, user) => {
    if (err) res.status(404).json(err);
    res.json(user);
  });
});

/*
  Gets Profile Recommendations for User
*/
router.get('/tinder/recommendations', tinderauth, (req, res) => {
  client.getRecommendations(10, (err, profiles) => {
    if (err) res.status(404).json(err);
    res.json(profiles);
  });
});

/*
  Posts User Like to Tinder
*/
router.post('/tinder/like/:id', tinderauth, (req, res) => {
  client.like(req.params.id, (err, liked) => {
    if (err) res.status(404).json(err);
    res.json(liked);
  });
});

/*
  Posts User Pass to Tinder
*/

router.post('/tinder/pass/:id', tinderauth, (req, res) => {
  client.pass(req.params.id, (err, passed) => {
    if (err) res.status(404).json(err);
    res.json(passed);
  });
});

/*
****LIKE RESULTS****
{
  "match": {
    "_id": "574de9db2ad776210ccdcb635767bd15c965c4103cc1026d",
    "closed": false,
    "common_friend_count": 0,
    "common_like_count": 0,
    "created_date": "2016-06-20T17:29:09.093Z",
    "dead": false,
    "last_activity_date": "2016-06-20T17:29:09.093Z",
    "message_count": 0,
    "messages": [],
    "participants": [
      "574de9db2ad776210ccdcb63",
      "5767bd15c965c4103cc1026d"
    ],
    "pending": false,
    "is_super_like": false,
    "following": true,
    "following_moments": true
  },
  "likes_remaining": 100
}

{
  "match": false,
  "likes_remaining": 100
}
*/

module.exports = router;
