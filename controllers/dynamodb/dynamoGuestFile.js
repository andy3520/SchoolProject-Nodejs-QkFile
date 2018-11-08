const AWS = require('aws-sdk');
const config = require('../../config/env');

AWS.config.update({
  region: config.REGION,
  accessKeyId: config.AWS_ACCESS_KEY,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY
});

// Tạo bảng cho File của guest (không tài khoản)
exports.createTable = (req, res) => {
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

  dynamodb.createTable(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to create table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      res.status(404).send({message: `Create fail`});
    } else {
      console.log(
        "Created table. Table description JSON:",
        JSON.stringify(data, null, 2)
      );
      res.status(200).send(JSON.stringify(data, null, 2))
    }
  });
};
/// ^^^

// Tạo file 
exports.createFile = (req, res, code, fileName, pass, fileType, fileSize) => {
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
  
  docClient.put(params, function (err, data) {
    if (err) {
      console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
      res.status(404).send({error: JSON.stringify(err, null, 2)});
    } else {
      res.status(200).send(JSON.stringify(data, null, 2));
    }
  });
};