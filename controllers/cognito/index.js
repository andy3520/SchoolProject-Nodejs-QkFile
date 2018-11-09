const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');

exports.poolData = {
  UserPoolId: "ap-southeast-1_9R9ZGSuOX",
  ClientId: "59hu3rcn5490a5jp7b8uu3sbuk", 
};
exports.pool_region = "ap-southeast-1";

exports.userPool = (poolData) => ( new AmazonCognitoIdentity.CognitoUserPool(poolData));

exports.RegisterUser = (userPool) => {
  var attributeList = [];
  return (
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"name",Value:"NamDepTrai"})),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"gender",Value:"male"})),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"birthdate",Value:"1991-06-21"})),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"address",Value:"CMB"})),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:"andy.annguyen3520@gmail.com"})),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"phone_number",Value:"+5412614324321"})),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:user_type",Value:"admin"})),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"locale",Value:"admin"})),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"profile",Value:"null"})),
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"picture",Value:"null"})),
    userPool.signUp('andy.annguyen3520@gmail.com', 'NamTran123', attributeList, null, function(err, result){
      console.log(attributeList);
      if (err) {
        console.log(err);
        return;
      }
      cognitoUser = result.user;
      console.log(cognitoUser);
      console.log('user name is ' + cognitoUser.getUsername());
    })
  )}
