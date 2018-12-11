const AWS = require('aws-sdk');
const config = require('../../config/env');

// Config AWS
AWS.config.update({
  region: config.REGION,
  accessKeyId: config.AWS_ACCESS_KEY,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
});

// Tạo file, truyền object file vào
exports.createFileUser = file => new Promise((resolve, reject) => {
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
      email: String(file.email)
    },
  };

  // Tiến hành thêm vào csdl
  docClient.put(params, (err) => {
    if (err) {
      // Xảy ra lỗi
      // console.log(`dynamoGuestFile.js createFile error ${err}`);
      reject(err);
    } else {
      // Thành công trả thông tin file thêm về
      resolve(params.Item);
    }
  });
});

// Get all file của user bằng user email
exports.getFileByEmail = email => new Promise((resolve, reject) => {
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: 'GuestFile',
    FilterExpression: "#em = :em",
    ScanIndexForward: false,
    ExpressionAttributeNames: {
      "#em": "email"
    },
    ExpressionAttributeValues: {
      ":em": String(email)
    }
  };

  docClient.scan(params, onScan);

  function onScan(err, data) {
    if (err) {
      reject(err);
    } else {
      resolve(data.Items);
    }
  }

  /*  
        // continue scanning if we have more movies, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != "undefined") {
          console.log("Scanning for more...");
          params.ExclusiveStartKey = data.LastEvaluatedKey;
          docClient.scan(params, onScan);
        }
      }*/
});

exports.deleteFile = code => new Promise((resolve, reject) => {
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: 'GuestFile',
    Key: {
      code: String(code),
    },
  };

  docClient.delete(params, (err, data) => {
    if (err) {
      // Thất bại
      // console.log(`dynamoGuestFile.js getFile error ${err}`);
      reject(err);
    } else {
      // Thành công trả thông tin file về
      resolve(data);
    }
  });
});