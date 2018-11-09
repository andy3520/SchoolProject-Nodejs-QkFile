var express = require('express');
var router = express.Router();
var {poolData, pool_region, RegisterUser, userPool} = require('../controllers/Cognito/index')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', (req, res, next) => {
  const userPoolConfig =  userPool(poolData);
  RegisterUser(userPoolConfig); 
  
});

module.exports = router;
