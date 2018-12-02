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
      // console.log(code);
    })
    .catch(() => {
      res.status(500).json({err: 'Hệ thống không thể generate code'});
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
          // console.log("Lưu dynamo run"+JSON.stringify(item));
          res.status(200).json({code: `Code tìm kiếm: ${item.code}`});
        })
        .catch(() => {
          // Thêm thất bại trả về error
          res.status(500).json({err: 'Không thể thêm file vào database'});
        });
    })
    .catch((err) => {
      // Bắt lỗi file rỗng ở đây
      res.status(411).json({err: err.err});
    });
});

// Tìm file trong dynamodb và hiển thị thông tin trước khi download
router.post('/find', (req, res) => {
  // Tìm file
  if (req.body.code === undefined || req.body.code === "") {
    res.status(401).json({err: "Vui lòng nhập mã tìm kiếm"});
  } else {
    dynamoGuestFile.getFile(String(req.body.code))
      .then((data) => {
        // Check password
        if (String(req.body.pass) === String(data.Item.pass)) {
          res.status(200).json({data: data.Item});
        } else {
          res.status(401).json({err: 'Sai mật khẩu'});
        }
      })
      .catch((err) => {
        // Lỗi get file dynamo
        res.status(404).json({err: 'Không tìm thấy file'});
      });
  }
});

// Tải file về
router.get('/download/:filename', (req, res) => {
  console.log(req.params.filename);
  s3.download(req.params.filename, res);
});

module.exports = router;
  