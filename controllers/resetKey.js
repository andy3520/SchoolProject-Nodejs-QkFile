const AWS = require('aws-sdk');
const env = require('../config/env');

exports.resetS3Key = function resetS3Key() {
  AWS.config.update({
    region: env.REGION,
    'accessKeyId': env.AWS_ACCESS_KEY,
    'secretAccessKey': env.AWS_SECRET_ACCESS_KEY
  });
  console.log("changeKey");
};