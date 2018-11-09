const AWS = require('aws-sdk');
const formidable = require('formidable');
const fs = require('fs');
const config = require('../config/env');

AWS.config.update({
  accessKeyId: config.AWS_ACCESS_KEY,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  region: config.REGION,
});

const s3 = new AWS.S3();

exports.upload = req => new Promise((resolve, reject) => {
  const form = new formidable.IncomingForm();
  form.parse(req);
  const fileUpload = {
    code: '',
    fileName: '',
    fileSize: 0,
    fileType: '',
    pass: '',
  };

  form.on('field', (name, value) => {
    if (name === 'pass') {
      if (String(value) === "" || value === undefined) {
        pass = " ";
      }
      fileUpload.pass = value;
    }
  });

  form.on('file', (name, file) => {
    const params = {
      Bucket: config.Bucket,
      Body: fs.createReadStream(file.path),
      Key: `${Date.now()}_${file.name}`,
    };
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        fileUpload.fileName = data.key;
        fileUpload.fileSize = file.size;
        fileUpload.fileType = file.type;
        resolve(fileUpload);
      }
    });
  });
});

exports.download = (fileName, res) => {
  const params = {
    Bucket: config.Bucket,
    Key: String(fileName),
  };

  res.attachment(params.Key);
  s3.getObject(params).createReadStream().pipe(res);
};