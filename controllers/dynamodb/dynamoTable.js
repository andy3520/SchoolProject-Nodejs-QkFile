const AWS = require('aws-sdk')

AWS
    .config
    .update(
        {region: 'ap-northeast-1', endpoint: "http://localhost:4444", accessKeyId: "AKIAJROWWG3FWXF4BEKQ", secretAccessKey: "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"}
    );
// Create Table 
exports.createDB = (req, res) => {

    const dynamodb = new AWS.DynamoDB();

    var params = {
        TableName: "Customer",
        KeySchema: [
            {
                AttributeName: "id",
                KeyType: "HASH"
            }, {
                AttributeName: "username",
                KeyType: "RANGE"
            }
        ],
        AttributeDefinitions: [
            {
                AttributeName: "id",
                AttributeType: "N"
            }, {
                AttributeName: "username",
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
            res
                .status(404)
                .send({message: `Create fail`});

        } else {
            console.log(
                "Created table. Table description JSON:",
                JSON.stringify(data, null, 2)
            );
            res
                .send(200)
                .send(JSON.stringify(data, null, 2))
        }
    });
}

// exports.createDB = (req, res) => {
//
//     const dynamodb = new AWS.DynamoDB();
//
//     var params = {
//         TableName: "Customer",
//         KeySchema: [
//             {
//                 AttributeName: "id",
//                 KeyType: "HASH"
//             }, {
//                 AttributeName: "username",
//                 KeyType: "RANGE"
//             }
//         ],
//         AttributeDefinitions: [
//             {
//                 AttributeName: "id",
//                 AttributeType: "N"
//             }, {
//                 AttributeName: "username",
//                 AttributeType: "S"
//             }
//         ],
//         ProvisionedThroughput: {
//             ReadCapacityUnits: 10,
//             WriteCapacityUnits: 10
//         }
//     };
//     dynamodb.createTable(params, function (err, data) {
//         if (err) {
//             console.error(
//                 "Unable to create table. Error JSON:",
//                 JSON.stringify(err, null, 2)
//             );
//             res
//                 .status(404)
//                 .send({message: `Create fail`});
//
//         } else {
//             console.log(
//                 "Created table. Table description JSON:",
//                 JSON.stringify(data, null, 2)
//             );
//             res
//                 .send(200)
//                 .send(JSON.stringify(data, null, 2))
//         }
//     });
// }

exports.createCus = (req, res) => {
    var docClient = new AWS
        .DynamoDB
        .DocumentClient();

    var params = {
        TableName: "Customer",
        Item: {
            "id": req.body.id,
            "username": req.body.username,
            "email": req.body.email,
            "password": req.body.password,
            "limited_method": req.body.limited_method,
            "files": [
                {
                    "file_name": req.body.file_name,
                    "link": req.body.link,
                    "short_link": req.body.short_link
                }
            ]
        }
    };

    console.log("Adding a new item...");
    docClient.put(params, function (err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            req
                .status(404)
                .send({
                    error: JSON.stringify(err, null, 2)
                });
        } else {
            req
                .status(200)
                .send(JSON.stringify(err, null, 2));
        }
    });
}

exports.addNewFile = (req, res) => {

    var docClient = new AWS
        .DynamoDB
        .DocumentClient()

    var table = "Customer";

    const params = {
        TableName: "Customer",
        Key: {
            "id": req.body.id,
            "username": req.body.id
        },
        UpdateExpression: "SET #attrName = list_append(#attrName, :attrValue)",
        ExpressionAttributeNames: {
            "#attrName": "files"
        },
        ExpressionAttributeValues: {
            ":attrValue": [
                {
                    "file_name": req.body.fileName,
                    "link": req.body.link,
                    "short_link": req.body.short_link
                }
            ]
        },
        ReturnValues: "UPDATED_NEW"
    };
    docClient.update(params, function (err, data) {
        if (err) {
            req
                .status(404)
                .send({
                    message: JSON.stringify(err, null, 2)
                })
        } else {
            req
                .status(200)
                .send({
                    message: JSON.stringify(data, null, 2)
                })
        }
    });
}

exports.deleteFileUploadByCustomer = () => {
    var docClient = new AWS
        .DynamoDB
        .DocumentClient();

    var params = {
        TableName: "Customer",
        Key: {
            "id": req.body.id,
            "username": req.body.username
        },
        ConditionExpression: "files.fileName = :val",
        ExpressionAttributeValues: {
            ":val": req.body.fileName
        }
    };

    console.log("Attempting a conditional delete...");
    docClient.delete(params, function (err, data) {
        if (err) {
            console.error(
                "Unable to delete item. Error JSON:",
                JSON.stringify(err, null, 2)
            );
        } else {
            console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
}

exports.deleteFileByLink = (req, res) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();

  var params = {
      TableName: "Customer",
      Key: {
          "id": req.body.id,
          "username": req.body.username,
      },
      UpdateExpression: `remove files[${req.body.index}]`,
      ReturnValues: "UPDATED_NEW",
  };
  
  documentClient.update(params, (err, data) => {
      if (err) console.error(`Error when updating ${JSON.stringify(err, null, 2)}`)
      else
          console.log(`Success full when updating ${JSON.stringify(data, null, 2)}`)
  })
};