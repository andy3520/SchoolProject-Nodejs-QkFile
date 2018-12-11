const AWS = require('aws-sdk');
const formidable = require('formidable');
const fs = require('fs');
const config = require('../config/env');

// Config AWS
AWS.config.update({
  accessKeyId: config.AWS_ACCESS_KEY,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  region: config.REGION,
});

const s3 = new AWS.S3();

// Upload file
exports.upload = (req,maxSize) => new Promise((resolve, reject) => {
  // Get file và các trường trong form bằng formidable
  const form = new formidable.IncomingForm();
  form.parse(req);
  // Schema thông tin file upload
  const fileUpload = {
    code: '',
    fileName: '',
    fileSize: 0,
    fileType: '',
    pass: '',
    email: ''
  };

  // Lấy field pass
  form.on('field', (name, value) => {
    // Do dynamo ko chấp nhận null khi ko có pass nên pass mặc định là một dấu cách nếu ko có pass
    if (name === 'pass') {
      if (String(value) === '' || value === undefined) {
        value = ' ';
      }
      fileUpload.pass = value;
    }
    if (name === 'email') {
      fileUpload.email = value;
    }
  });

  // Lấy data file và fill schema params để lưu lên s3
  form.on('file', (name, file) => {
    if (file.size <= 0) {
      reject({err: 'Lỗi file size <=0B không hợp lệ'});
    } else if (file.size > maxSize) {
      let MB = maxSize/1000/1024;
      reject({err: 'File lớn hơn mức quy định là '+MB+" MB"});
    } else {
      const params = {
        Bucket: config.Bucket,
        Body: fs.createReadStream(file.path),
        // Tạo tên file unique ( do s3 get file bằng tên )
        Key: `${Date.now()}_${file.name}`
      };
      // Tiến hành upload
      s3.upload(params, (err, data) => {
        // console.log("Run upload" + JSON.stringify(data));
        if (err) {
          // console.log(`s3 upload error ${err}`);
          reject(err);
        } else if (file.size <= 0) {
          // Check file 0b, reject
          // console.log(`s3 upload file 0b error ${err}`);
          reject({err: 'Lỗi file 0b không hợp lệ'});
        } else {
          fileUpload.fileName = data.Key;
          fileUpload.fileSize = file.size;
          fileUpload.fileType = file.type;
          // Thành công
          resolve(fileUpload);
        }
      });
    }
  });
});

// Download file từ s3, trả về stream, open save dialog
exports.download = (fileName, res) => {
  // Schema params get file
  const params = {
    Bucket: config.Bucket,
    Key: String(fileName),
  };

  // Mở save dialog
  res.attachment(params.Key);
  // Truyền stream xuống client
  s3.getObject(params).createReadStream().pipe(res);
};

exports.delete = fileName => new Promise((resolve,reject)=> {
  // Schema params get file
  const params = {
    Bucket: config.Bucket,
    Key: String(fileName),
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});