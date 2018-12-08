const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const env = {
  AWS_ACCESS_KEY: 'AKIAIYAQ6MFOPKE23EDA',
  AWS_SECRET_ACCESS_KEY: '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',
  REGION: 'us-west-2',
  Bucket: 'guestfile',
  poolData : {
    UserPoolId: 'us-west-2_YYCZS19k2',
    ClientId: '447t3hs1nsi0t7ode1oi9af587',
    // Storage: new AmazonCognitoIdentity.CookieStorage({domain: "localhost:3000", expires:30})
  }
};

module.exports = env;
