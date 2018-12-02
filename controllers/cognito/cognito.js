const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');

global.fetch = require('node-fetch');

exports.userData = (req, userPool) => (
  {
    Username: req.body.email,
    Pool: userPool,
  }
);

exports.pool_region = 'us-west-2';

exports.userPool = poolData => new AmazonCognitoIdentity.CognitoUserPool(poolData);

exports.cognitoUser = userData => new AmazonCognitoIdentity.CognitoUser(userData);

exports.authenticationDetails = req => new AmazonCognitoIdentity.AuthenticationDetails(
  {
    Username: req.body.email,
    Password: req.body.password, 
  },
);

exports.registerUser = (userPool, req) => new Promise((resolve, reject) => {
  const attributeList = [];
  return (
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'name',
      Value: req.body.name
    })),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'gender',
      Value: req.body.gender
    })),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'birthdate',
      Value: req.body.birthday
    })),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'address',
      Value: req.body.address
    })),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'email',
      Value: req.body.email
    })),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'phone_number',
      Value: '+84'+req.body.phone.substring(1,req.body.phone.length)
    })),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'custom:user_role',
      Value: 'member'
    })),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: 'nickname',
        Value: req.body.username
      }
    )),
    userPool.signUp(req.body.email, req.body.password, attributeList, null, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result); 
      }
    })
  );
});

exports.validateCurrentUser = userPool => new Promise((resolve, reject) => {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser != null) {
    return (
      cognitoUser.getSession((err, session) => {
        if (err) reject(err);
        else resolve(session.isValid());
      })
    );
  }
});

exports.signin = (cognitoUser, authenticationDetails) => new Promise((resolve, reject) => (
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
      const accessToken = result.getAccessToken().getJwtToken();
      const idToken = result.idToken.jwtToken;
      console.log(accessToken);
      console.log(idToken);
      console.log(result);
    },
    onFailure: (err) => {
      console.log(err);
    },
  })
));

exports.changePassword = (cognitoUser, req) => (new Promise((resolve, reject) => (
  cognitoUser.changePassword(req.body.oldPassword, req.body.newPassword, (err, result) => {
    if (err) reject(err);
    else resolve(result);
  })
)));

exports.updateInfo = (cognitoUser, req) => (new Promise((resolve, reject) => {
  const attributes = [];
  Object.keys(req.body).forEach((key) => {
    const attribute = {
      Name: key,
      Value: req.body[key],
    };
    attributes.push(attribute);
  });
}));
