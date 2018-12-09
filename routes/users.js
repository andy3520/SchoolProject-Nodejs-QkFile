const express = require('express');

const router = express.Router();
const COGNITO = require('../controllers/cognito/cognito');

router.get('/', (req, res) => {
  res.render('_userFile');
});

router.get('/upload', (req, res) => {
  res.render('_userUpload');
});

router.get('/account', (req, res) => {
  res.render('_userAccount');
});

router.get('/signout', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
  }
    COGNITO.signOut();
    res.redirect('/#login');
});

module.exports = router;
