const AWS = require('aws-sdk');
const config = require('../../config/env');

// Config AWS
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

// Tạo file, truyền object file vào
exports.createFile = file => new Promise((resolve, reject) => {
  // Do dynamodb không chấp nhận rỗng nên sẽ thay thế rỗng bằng một dấu cách
  if (String(file.pass) === '' || file.pass === undefined) {
    file.pass = ' ';
  }
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: 'GuestFile',
    ConditionExpression: 'attribute_not_exists(code)',
    Item: {
      code: String(file.code),
      fileName: String(file.fileName),
      pass: String(file.pass),
      fileType: String(file.fileType),
      fileSize: Number(file.fileSize),
    },
  };

  // Tiến hành thêm vào csdl
  docClient.put(params, (err) => {
    if (err) {
      // Xảy ra lỗi
      console.log(`dynamoGuestFile.js createFile error ${err}`);
      reject(err);
    } else {
      // Thành công trả thông tin file thêm về
      resolve(params.Item);
    }
  });
});

// Tim file trong database bằng code
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
      // Thất bại
      console.log(`dynamoGuestFile.js getFile error ${err}`);
      reject(err);
    } else {
      // Thành công trả thông tin file về
      resolve(data);
    }
  });
});
