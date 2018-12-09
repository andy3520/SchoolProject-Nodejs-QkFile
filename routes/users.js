const express = require('express');

const router = express.Router();
const COGNITO = require('../controllers/cognito/cognito');

router.get('/', (req, res) => {
  res.render('user/_userFile');
});

router.get('/upload', (req, res) => {
  res.render('user/_userUpload');
});

router.get('/account', (req, res) => {
  let user = req.session.user;
  res.render('user/_userAccount',{user: user});
});

router.get('/signout', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
  }
    COGNITO.signOut();
    res.redirect('/#login');
});

module.exports = router;
