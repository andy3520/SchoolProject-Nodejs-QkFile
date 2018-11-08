const AWS = require('aws-sdk');
const config = require('../../config/env');

AWS.config.update({
  region: config.REGION,
  accessKeyId: config.AWS_ACCESS_KEY,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY
});

// Tạo bảng cho File của guest (không tài khoản)
exports.createTable = () => {
  const dynamodb = new AWS.DynamoDB();

  var params = {
    TableName: "GuestFile",
    KeySchema: [
      {
        AttributeName: "code",
        KeyType: "HASH"
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: "code",
        AttributeType: "S"
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
    }
  };

  return dynamodb.createTable(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to create table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      return err;
    } else {
      console.log(
        "Created table. Table description JSON:",
        JSON.stringify(data, null, 2)
      );
      return data;
    }
  });
};
/// ^^^

// Tạo file 
exports.createFile = (code, fileName, pass, fileType, fileSize) => {
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: "GuestFile",
    Item: {
      "code": String(code),
      "fileName": String(fileName),
      "pass": String(pass),
      "fileType": String(fileType),
      "fileSize": Number(fileSize)
    }
  };
  
  return docClient.put(params, function (err, data) {
    if (err) {
      console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
      return err;
    } else {
      console.log(
        "Created file: ",
        JSON.stringify(params.Item, null, 2)
      );
      return params.Item;
    }
  });
};

// Tim file