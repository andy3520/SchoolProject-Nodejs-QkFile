const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const config = require('../../config/env.js');

global.fetch = require('node-fetch');

exports.pool_region = 'us-west-2';

const userPool = new AmazonCognitoIdentity.CognitoUserPool(config.poolData);

let userData = (email) => (
  {
    Username: email,
    Pool: userPool
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
        Value: '+84' + user.phone.substring(1, user.phone.length)
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
  if (currentUser == null) {
    reject(currentUser);
  } else {
    return (
      currentUser.getSession((err, session) => {
        if (err) reject(err);
        else resolve(session);
      })
    );
  }
});

let cognitoUserCustom = null;
exports.logIn = (email, password) => new Promise((resolve, reject) => {
  let userForm = userData(email);
  let authenticationDetailsCustom = authenticationDetails(email, password);
   cognitoUserCustom = cognitoUser(userForm);
  return cognitoUserCustom.authenticateUser(authenticationDetailsCustom, {
    onSuccess: (result) => {
      cognitoUserCustom['tokens'] = {
        accessToken: result.getAccessToken().getJwtToken(),
        idToken: result.getIdToken().getJwtToken(),
        refreshToken: result.getRefreshToken().getToken()
      };
      resolve(result);
    },
    onFailure: (err) => {
      reject(err);
    },
  });
});

exports.changePassword = (email, oldPassword, newPassword) => (new Promise((resolve, reject) => {
  const AccessToken = new AmazonCognitoIdentity.CognitoAccessToken({ AccessToken: cognitoUserCustom.tokens.accessToken });
  const IdToken = new AmazonCognitoIdentity.CognitoIdToken({ IdToken: cognitoUserCustom.tokens.idToken });
  const RefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({ RefreshToken: cognitoUserCustom.tokens.refreshToken });

  const sessionData = {
    IdToken: IdToken,
    AccessToken: AccessToken,
    RefreshToken: RefreshToken
  };

  const userSession = new AmazonCognitoIdentity.CognitoUserSession(sessionData);

  let currentUserFromPool = userData(email);

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(currentUserFromPool);
  cognitoUser.setSignInUserSession(userSession);

  cognitoUser.getSession(function (err, session) { // You must run this to verify that session (internally)
    if (session.isValid()) {
      cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    } else {
      reject(err);
    }
  });
}));

exports.updateInfo = (email, req) => (new Promise((resolve, reject) => {
  // let cognitoUserUpdate = cognitoUser(currentUserFromPool);
  
  const AccessToken = new AmazonCognitoIdentity.CognitoAccessToken({ AccessToken: cognitoUserCustom.tokens.accessToken });
  const IdToken = new AmazonCognitoIdentity.CognitoIdToken({ IdToken: cognitoUserCustom.tokens.idToken });
  const RefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({ RefreshToken: cognitoUserCustom.tokens.refreshToken });
  
  const sessionData = {
    IdToken: IdToken,
    AccessToken: AccessToken,
    RefreshToken: RefreshToken
  };

  const userSession = new AmazonCognitoIdentity.CognitoUserSession(sessionData);

  let currentUserFromPool = userData(email);

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(currentUserFromPool);
  cognitoUser.setSignInUserSession(userSession);

  cognitoUser.getSession(function (err, session) { // You must run this to verify that session (internally)
    if (session.isValid()) {
      const attributes = [];
      const user = {
        nickname: req.body.nickname,
        phone_number: req.body.phone_number,
        name: req.body.name,
        gender: req.body.gender,
        birthdate: req.body.birthdate,
        address: req.body.address
      };
      
      Object.keys(req.body).forEach((key) => {
        let originPhone = req.body["phone_number"];
        let phone = "+84"+originPhone.substr(1,originPhone.length);
        const attribute = {
          Name: key,
          Value: key === "phone_number" ? phone : req.body[key],
        };
        attributes.push(attribute);
      });
      cognitoUser.updateAttributes(attributes, (err, result) => {
        if (err) {
          reject(err);
        } else {
          req.session.user.nickname = user.nickname;
          req.session.user.phone_number = user.phone_number;
          req.session.user.name = user.name;
          req.session.user.gender = user.gender;
          req.session.user.birthdate = user.birthdate;
          req.session.user.address.formatted = user.address;
          resolve(result);
        }
      });
    } else {
      reject(err);
    }
  });
}));

exports.forgotPassword = (email) => new Promise((resolve, reject) => {
  var userForm = userData(email);
  var cognitoUserCustom = cognitoUser(userForm);
  cognitoUserCustom.forgotPassword({
    onSuccess: (result) => {
      resolve(result);
    },
    onFailure: (err) => {
      reject(err);
    },
  });
});

exports.confirmPassword = (email, code, newPassword) => new Promise((resolve, reject) => {
  let userForm = userData(email);
  let cognitoUserCustom = cognitoUser(userForm);
  console.log(newPassword);
  cognitoUserCustom.confirmPassword(code, newPassword, {
    onSuccess: (result) => {
      resolve(result);
    },
    onFailure: (err) => {
      reject(err);
    }
  });
});

exports.signOut = () => new Promise( (resolve,reject)=>{
  var currentUser = userPool.getCurrentUser();
  if (currentUser != null) {
    var userForm = userData(currentUser.username);
    var cognitoUserCustom = cognitoUser(userForm);
    if (cognitoUserCustom != null) {
      cognitoUserCustom.signOut();
      resolve();
    } else {
      reject();
    }
  } else {
    reject();
  }
});


exports.deleteUser = (cognitoUser, req) => (new Promise((resolve, reject) => {
  cognitoUser.deleteUser((err, result) => {
    if (err) reject(err);
    else resolve(result);
  });
}));

exports.getAll = () => (new Promise((resolve, reject) => {
  const AWSCOG = require('aws-sdk');
  AWSCOG.config.update({
    region: 'us-west-2',
    'accessKeyId': 'AKIAIN2TIOJKKK3MDNGQ',
    'secretAccessKey': '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'
  });
  var cognitoidentityserviceprovider = new AWSCOG.CognitoIdentityServiceProvider();
  var params = {
    UserPoolId: "us-west-2_YYCZS19k2",

    AttributesToGet: [
      'email'
    ],
  };
  cognitoidentityserviceprovider.listUsers(params, function (err, data) {
    if (err) reject(err, err.stack); // an error occurred
    else resolve(data.Users);           // successful response
  });
}));

exports.disableUser = (username) => (new Promise((resolve, reject) => {
  const AWSCOG = require('aws-sdk');     
  AWSCOG.config.update({
    region: 'us-west-2',
    'accessKeyId': 'AKIAIN2TIOJKKK3MDNGQ',
    'secretAccessKey': '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'
  });
  var cognitoidentityserviceprovider = new AWSCOG.CognitoIdentityServiceProvider();
  var params = {
    UserPoolId: "us-west-2_YYCZS19k2",
    Username: username
  };
  cognitoidentityserviceprovider.adminDisableUser(params, function (err, data) {
    if (err) reject(err); // an error occurred
    else resolve(data);           // successful response
  });
}));

exports.enableUser = (username) => (new Promise((resolve, reject) => {
  const AWSCOG = require('aws-sdk'); 
  AWSCOG.config.update({
    region: 'us-west-2',
    'accessKeyId': 'AKIAIN2TIOJKKK3MDNGQ',
    'secretAccessKey': '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'
  });
  var cognitoidentityserviceprovider = new AWSCOG.CognitoIdentityServiceProvider();
  var params = {
    UserPoolId: "us-west-2_YYCZS19k2",
    Username: username
  };
  cognitoidentityserviceprovider.adminEnableUser(params, function (err, data) {
    if (err) reject(err); // an error occurred
    else resolve(data);           // successful response
  });
}));
