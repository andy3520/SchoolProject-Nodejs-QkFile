const express = require('express');

const router = express.Router();
const {
  poolData, pool_region, RegisterUser, userPool,
  userData, cognitoUser, authenticationDetails, Signin, ValidateCurrentUser,
} = require('../controllers/cognito/index');
/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/register', (req, res, next) => {
  let userPoolConfig = userPool(poolData);
  RegisterUser(userPoolConfig, req)
    .then((result) => {
      res.redirect('/');
    }, (err) => {
      res.send(`<script>alert('${err.message}')</script>`);
    });
});

router.post('/login', (req, res) => {
  const userPoolConfig = userPool(poolData);
  const userDataCustom = userData(req, userPoolConfig);
  const cognitoUserCustom = cognitoUser(userDataCustom);
  const authenticationDetailsCustom = authenticationDetails(req);
  Signin(cognitoUserCustom, authenticationDetailsCustom);
});

router.get('/validate', (req, res) => {
  let userPoolConfig = userPool(poolData);
  ValidateCurrentUser(userPoolConfig)
    .then((result) => {
      res.json(result);
    }, (err) => {
      res.json(err);
    });
});

module.exports = router;
