const express = require('express');

const router = express.Router();
const COGNITO = require('../controllers/cognito/cognito');
const config = require('../config/env');

router.get('/', (req, res) => {
  res.render('_userFile');
});

router.get('/upload', (req, res) => {
  res.render('_userUpload');
});

router.get('/account', (req, res) => {
  res.render('_userAccount');
});

router.get('/facebook', (req, res, next) => {
  res.render('views/loginFacebook');
});

router.post('/register', (req, res) => {
  let userPoolConfig = COGNITO.userPool(config.poolData);
  COGNITO.registerUser(userPoolConfig, req)
    .then((result) => {
      res.redirect('/');
    }, (err) => {
      res.send(`<script>alert('${err.message}')</script>`);
    });
});

router.post('/login', (req, res) => {
  const userPoolConfig = COGNITO.userPool(config.poolData);
  const userDataCustom = COGNITO.userData(req, userPoolConfig);
  const cognitoUserCustom = COGNITO.cognitoUser(userDataCustom);
  const authenticationDetailsCustom = COGNITO.authenticationDetails(req);
  COGNITO.signin(cognitoUserCustom, authenticationDetailsCustom);
});

router.get('/validate', (req, res) => {
  let userPoolConfig = COGNITO.userPool(config.poolData);
  COGNITO.validateCurrentUser(userPoolConfig)
    .then((result) => {
      res.json(result);
    }, (err) => {
      res.json(err);
    });
});

router.get('/getUsers', (req, res) => {
 COGNITO.GetAll(config.poolData)
  .then(result => {
    res.json(result);
  }, err => {
    res.json(err); 
 })
});

router.get('/forgotPassword', (req, res) => {
  
})
module.exports = router;
