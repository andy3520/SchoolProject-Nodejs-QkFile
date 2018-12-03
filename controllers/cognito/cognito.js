const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
const config = require('../../config/env.js');

global.fetch = require('node-fetch');

exports.pool_region = 'us-west-2';

const userPool = new AmazonCognitoIdentity.CognitoUserPool(config.poolData);

var userData = (email) => (
  {
    Username: email,
    Pool: userPool,
  }
);

var cognitoUser = userData => new AmazonCognitoIdentity.CognitoUser(userData);

var authenticationDetails = (email, password) => new AmazonCognitoIdentity.AuthenticationDetails(
  {
    Username: email,
    Password: password, 
  },
);

exports.registerUser = (user) => new Promise((resolve, reject) => {
  
  const attributeList = [];
  return (
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'name',
      Value: user.name
    })),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'gender',
      Value: user.gender
    })),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'birthdate',
      Value: user.birthday
    })),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'address',
      Value: user.address
    })),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'email',
      Value: user.email
    })),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'phone_number',
      Value: '+84'+user.phone.substring(1,user.phone.length)
    })),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'custom:user_role',
      Value: 'member'
    })),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: 'nickname',
        Value: user.username
      }
    )),
    userPool.signUp(user.email, user.password, attributeList, null, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result); 
      }
    })
  );
});

exports.validateCurrentUser = () => new Promise((resolve, reject) => {
  const currentUser = userPool.getCurrentUser();
  console.log(`Info : ${currentUser}`);
  if (currentUser == null) {
    reject(currentUser);
  } else {
    return (
      currentUser.getSession((err, session) => {
      console.log(session.idToken)
        if (err) reject(err);
        else resolve(session.isValid());
      })
    );
  }
});

exports.logIn = (email, password) => new Promise((resolve, reject) => {
  let userForm = userData(email);
  let cognitoUserCustom = cognitoUser(userForm);
  let authenticationDetailsCustom = authenticationDetails(email, password);
  return cognitoUserCustom.authenticateUser(authenticationDetailsCustom, {
    onSuccess: (result) => {
      // const accessToken = result.getAccessToken().getJwtToken();
      // const idToken = result.idToken.jwtToken;
      resolve(result);
    },
    onFailure: (err) => {
      reject(err);
    },
  })
});

exports.changePassword = (email, oldPassword, newPassword) => (new Promise((resolve, reject) => {
  var userForm = userData(email);
  var cognitoUserCustom = cognitoUser(userForm);
  cognitoUserCustom.changePassword(oldPassword, newPassword, (err, result) => {
    if (err) reject(err);
    else resolve(result);
  })
}));

exports.updateInfo = (cognitoUser, req) => (new Promise((resolve, reject) => {
  const attributes = [];
  Object.keys(req.body).forEach((key) => {
    const attribute = {
      Name: key,
      Value: req.body[key],
    };
    attributes.push(attribute);
  });
  cognitoUser.updateAttributes(attributeList, (err, result) => {
    if(err) reject(err);
    else  resolve(result);
  })  
}));

exports.forgotPassword = (email) => new Promise((resolve, reject) => {
  var userForm = userData(email);
  var cognitoUserCustom = cognitoUser(userForm);
  cognitoUserCustom.forgotPassword({
    onSuccess: (result) => {
      resolve(result);
    },
    onFailure: (err)  => {
      reject(err);
    },
  });
});

exports.confirmPassword = (email, code, newPassword) => new Promise ((resolve, reject) => {
  var userForm = userData(email);
  var cognitoUserCustom = cognitoUser(userForm);
  resolve(cognitoUserCustom.confirmPassword(code, newPassword, {
    onSuccess: (result) => {
      resolve(result);
    },
    onFailure: (err) => {
      reject(err);
    }
  }));
})

exports.deleteUser = (cognitoUser, req) => (new Promise((resolve, reject) => {
  cognitoUser.deleteUser((err, result) => {
    if(err) reject(err);
    else resolve(result);
  });
}));

exports.signOut = () => new Promise((resolve, reject) => {
  var currentUser = userPool.getCurrentUser();
  console.log(currentUser.username) 

  var userForm = userData(currentUser.username);
  var cognitoUserCustom = cognitoUser(userForm);
  if(cognitoUserCustom != null)
    cognitoUserCustom.signOut();
});

exports.getAll = (poolData) => (new Promise((resolve, reject) => {
  AWS.config.update({ region: 'us-west-2', 'accessKeyId': 'AKIAIN2TIOJKKK3MDNGQ', 'secretAccessKey': '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'}); 
  var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  var params = {
  UserPoolId: "us-west-2_YYCZS19k2",
  
  AttributesToGet: [
    'email',
    'phone_number',
    /* more items */
  ],
};
  cognitoidentityserviceprovider.listUsers(params, function(err, data) {
    if (err) reject(err, err.stack); // an error occurred
    else     resolve(data.Users);           // successful response
  });
}))
