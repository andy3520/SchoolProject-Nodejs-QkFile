const express = require('express');

const router = express.Router();
const COGNITO = require('../controllers/cognito/cognito');

// router.use((req, res, next) => {
//   COGNITO.validateCurrentUser()
//     .then(result => {
//       next('route');
//     })
//     .catch(err => {
//       res.redirect('/#login');
//     });
// });

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
  COGNITO.signOut();
  res.redirect('/');
});

module.exports = router;
