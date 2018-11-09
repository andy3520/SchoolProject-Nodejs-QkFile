const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');

exports.poolData = {
  UserPoolId: "us-west-2_YYCZS19k2",
  ClientId: "447t3hs1nsi0t7ode1oi9af587", 
};
exports.pool_region = "us-west-2";

exports.userPool = (poolData) => ( new AmazonCognitoIdentity.CognitoUserPool(poolData));

exports.RegisterUser = (userPool, req) => { return new Promise((resolve, reject) => {
  var attributeList = [];
  return (
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"name",Value:req.body.name})),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"gender",Value:req.body.gender})),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"birthdate",Value:req.body.birthdate})),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"address",Value:req.body.addreqs})),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:req.body.email})),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"phone_number",Value:req.body.phone_number})),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:user_role",Value:"member"})),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"nickname",Value:req.body.username})),
    userPool.signUp(req.body.email, req.body.password, attributeList, null, function(err, result){
      console.log(attributeList);
      if (err) {
        reject(err);
      }else {
        resolve(result);
      }
    })
  )}
)}

