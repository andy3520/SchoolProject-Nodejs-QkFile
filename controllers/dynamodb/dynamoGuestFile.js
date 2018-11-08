const AWS = require('aws-sdk');
const config = require('../../config/env');

AWS.config.update({
  region: config.REGION,
  accessKeyId: config.AWS_ACCESS_KEY,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY
});

// Tạo bảng cho File của guest (không tài khoản)
exports.createTable = () => {
  return new Promise((resolve, reject) => {
    const dynamoDB = new AWS.DynamoDB();
    let params = {
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

    dynamoDB.createTable(params, function (err, data) {
      if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
        reject(err);
      } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
        resolve(data);
      }
    });
  });
};
/// ^^^

// Tạo file 
exports.createFile = (code, fileName, pass, fileType, fileSize) => {
  return new Promise((resolve, reject) => {
    let docClient = new AWS.DynamoDB.DocumentClient();
    let params = {
      TableName: "GuestFile",
      ConditionExpression: 'attribute_not_exists(code)',
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
        reject(err);
      } else {
        console.log("Created file: ", JSON.stringify(params.Item, null, 2));
        resolve(params.Item);
      }
    });
  });
};

// Tim file
exports.getFile = (code) => {
  return new Promise((resolve,reject)=>{
    let docClient = new AWS.DynamoDB.DocumentClient();
    let params = {
      TableName: "GuestFile",
      Key:{
        "code": String(code),
      }
    };

    docClient.get(params, function(err, data) {
      if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        reject(err);
      } else {
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        resolve(data);
      }
    });
  });
};
