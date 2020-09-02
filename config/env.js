const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const env = {
  AWS_ACCESS_KEY: '',
  AWS_SECRET_ACCESS_KEY: '',
  REGION: 'us-west-2',
  Bucket: 'guestfile',
  poolData : {
    UserPoolId: '',
    ClientId: '',
  }
};

module.exports = env;
