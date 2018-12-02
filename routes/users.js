var express = require('express');
var router = express.Router();
var {poolData, pool_region, RegisterUser, userPool,
userData, cognitoUser, authenticationDetails, Signin, 
ValidateCurrentUser, GetAll} = require('../controllers/cognito/index')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/facebook', (req, res, next) => {
  res.render('views/loginFacebook');
})

router.post('/register', (req, res, next) => {
  userPoolConfig =  userPool(poolData);
  RegisterUser(userPoolConfig, req)
    .then( result => {
      res.redirect('/');
    }, err => {
       res.send(`<script>alert('${err.message}')</script>`)
    });
});

router.post('/login' ,(req, res) => {
  var userPoolConfig = userPool(poolData);
  var userDataCustom = userData(req, userPoolConfig);
  var cognitoUserCustom = cognitoUser(userDataCustom);
  var authenticationDetailsCustom = authenticationDetails(req);
  Signin(cognitoUserCustom, authenticationDetailsCustom);
})

router.get('/validate', (req, res) => {
  userPoolConfig = userPool(poolData);
  ValidateCurrentUser(userPoolConfig)
    .then(result => {
      res.json(result);
    }, err => {
      res.json(err);
    })
})

router.get('/getUsers', (req, res) => {
 GetAll(poolData)
  .then(result => {
    res.json(result);
  }, err => {
    res.json(err); 
 })
});
module.exports = router;
