var express = require('express');
var router = express.Router();
var {poolData, pool_region, RegisterUser, userPool} = require('../controllers/cognito/index')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', (req, res, next) => {
  userPoolConfig =  userPool(poolData);
  RegisterUser(userPoolConfig, req)
    .then( result => {
      res.redirect('/');
    }, err => {
      res.send('alert("Error")');
    })
});

router.post('/signin' ,(req, res) => {

})

module.exports = router;
