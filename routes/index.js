const express = require('express');

const router = express.Router();
const dynamoGuestFile = require('../controllers/dynamodb/dynamoGuestFile');
const generateCode = require('../controllers/generateCode');
const s3 = require('../controllers/s3');

router.get('/', (req, res) => {
  res.render('index');
});

// Xử lý upload
router.post('/upload', (req, res) => {
  // Schema data file để thêm vào dynamo
  const fileUpload = {
    code: '',
    fileName: '',
    fileSize: 0,
    fileType: '',
    pass: '',
  };

  // Tạo code ngẫu nhiên 6 chữ số hoa thường
  generateCode.generate(6)
    .then((code) => {
      // Thành công sẽ thêm code attribute vào schema
      fileUpload.code = code;
    })
    .catch(() => {
      // Trả lỗi 500
      res.status(500).send({ err: 'Lỗi hệ thống không thể generate code' });
    });

  // Upload file lên s3
  s3.upload(req)
    .then((file) => {
      // Upload thành công sẽ trả về thông tin file, truyền thông tin vào schema
      fileUpload.fileName = file.fileName;
      fileUpload.fileSize = file.fileSize;
      fileUpload.fileType = file.fileType;
      fileUpload.pass = file.pass;
      // Sau khi schema đã thêm đầy đủ, create object ở dynamodb
      dynamoGuestFile.createFile(fileUpload)
        .then((item) => {
          // Thêm thành công sẽ trả về code tìm file
          res.status(200).json({ code: `Your code: ${item.code}` });
        })
        .catch(() => {
          // Thêm thất bại trả về error
          res.status(500).json({ err: 'Lỗi không thể thêm file vào database' });
        });
    })
    .catch((err) => {
      // Bắt lỗi file rỗng ở đây
      res.status(500).send({ err });
    });
});

// Tìm file trong dynamodb và hiển thị thông tin trước khi download
router.post('/find', (req, res) => {
  // Tìm file
  dynamoGuestFile.getFile(String(req.query.code))
    .then((data) => {
      // Không có pass thì mặc định pass là 1 dấu cách
      if (req.body.pass === undefined || req.body.pass === '') {
        req.query.pass = ' ';
      }
      // Check password
      if (String(req.body.pass) === String(data.Item.pass)) {
        res.status(200).json({ data: data.Item });
      } else {
        res.status(401).json({ err: 'Lỗi sai mật khẩu' });
      }
    })
    .catch(() => {
      // Lỗi get file dynamo
      res.status(400).send({ err: 'Lỗi không thể get file từ database' });
    });
});

// Tải file về
router.post('/download', (req, res) => {
  s3.download(req.body.fileName, res);
});

module.exports = router;
