const AWS = require('aws-sdk');
const config = require('../../config/env');

AWS.config.update({
  region: config.REGION,
  accessKeyId: config.AWS_ACCESS_KEY,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
});

// Tạo bảng cho File của guest (không tài khoản)
exports.createTable = () => new Promise((resolve, reject) => {
  const dynamoDB = new AWS.DynamoDB();
  const params = {
    TableName: 'GuestFile',
    KeySchema: [
      {
        AttributeName: 'code',
        KeyType: 'HASH',
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'code',
        AttributeType: 'S',
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10,
    },
  };

  dynamoDB.createTable(params, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});
// / ^^^

// Tạo file
exports.createFile = (code, fileName, pass, fileType, fileSize) => new Promise((resolve, reject) => {
  if (String(pass) === "" || pass === undefined) {
    pass = " ";
  }
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: 'GuestFile',
    ConditionExpression: 'attribute_not_exists(code)',
    Item: {
      code: String(code),
      fileName: String(fileName),
      pass: String(pass),
      fileType: String(fileType),
      fileSize: Number(fileSize),
    },
  };

  docClient.put(params, (err) => {
    if (err) {
      reject(err);
    } else {
      resolve(params.Item);
    }
  });
});

// Tim file
exports.getFile = code => new Promise((resolve, reject) => {
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: 'GuestFile',
    Key: {
      code: String(code),
    },
  };

  docClient.get(params, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});
