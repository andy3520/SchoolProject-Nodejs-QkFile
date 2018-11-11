const express = require('express');

const router = express.Router();
const dynamoGuestFile = require('../controllers/dynamodb/dynamoGuestFile');
const generateCode = require('../controllers/generateCode');
const s3 = require('../controllers/s3');

router.get('/createTable', (req, res) => {
  dynamoGuestFile.createTable()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(JSON.stringify(err));
    });
});

router.get('/createFile', (req, res) => {
  dynamoGuestFile.createFile('X', `${Date.now()}-Test.jpg`, 'test', 'images/jpg', 1)
    .then((data) => {
      res.send(JSON.stringify(data));
    })
    .catch((err) => {
      res.send(JSON.stringify(err));
    });
});

router.get('/getFile', (req, res) => {
  dynamoGuestFile.getFile('X')
    .then((data) => {
      res.send(JSON.stringify(data.Item));
    })
    .catch((err) => {
      res.send(JSON.stringify(err));
    });
});

router.get('/genCode', (req, res) => {
  generateCode.generate(8)
    .then((code) => {
      res.send(code);
    });
});

router.post('/upload', (req, res) => {
  const fileUpload = {
    code: '',
    fileName: '',
    fileSize: 0,
    fileType: '',
    pass: '',
  };

  generateCode.generate(6)
    .then((code) => {
      fileUpload.code = code;
      console.log('1.gen ' + JSON.stringify(fileUpload));
    })
    .catch((err) => {
      res.send(JSON.stringify(err));
    });

  s3.upload(req)
    .then((file) => {
      fileUpload.fileName = file.fileName;
      fileUpload.fileSize = file.fileSize;
      fileUpload.fileType = file.fileType;
      fileUpload.pass = file.pass;
      console.log('2.up ' + JSON.stringify(fileUpload));
      dynamoGuestFile.createFile(fileUpload.code, fileUpload.fileName, fileUpload.pass, fileUpload.fileType, fileUpload.fileSize)
        .then((item) => {
          console.log('3.thanhcong ' + JSON.stringify(fileUpload));
          res.json({ 'code': "Your code: " + item.code, 'flag': true });
        })
        .catch((err) => {
          //flag:false
          console.log('4.??? ' + JSON.stringify(fileUpload));
          res.json({ 'code': err, 'flag': false });
        });
    })
    .catch((err) => {
      res.send(JSON.stringify(err));
    });
});


router.post('/find', (req, res) => {
  console.log(req.body.code);
  dynamoGuestFile.getFile(String(req.body.code))
    .then((data) => {
      if (req.body.pass === undefined || req.body.pass === "") {
        req.body.pass = " ";
      }
      if (String(req.body.pass) === String(data.Item.pass)) {
        //s3.download(data.Item.fileName, res);
        res.json({ 'data': data.Item, 'flag': true });
      } else {
        res.send(JSON.stringify({ message: 'Sai mật khẩu' }));
      }
    })
    .catch((err) => {
      res.send(JSON.stringify(err));
    });
});

router.post('/download', (req, res) => {
    s3.download(req.fileName, res);
});

module.exports = router;
