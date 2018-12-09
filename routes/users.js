const express = require('express');

const router = express.Router();
const COGNITO = require('../controllers/cognito/cognito');
const dynamoUser = require('../controllers/dynamodb/dynamoUser');
const generateCode = require('../controllers/generateCode');
const s3 = require('../controllers/s3');

router.get('/', (req, res) => {
  res.render('user/_userFile');
});

router.get('/uploadandfind', (req, res) => {
  let email = req.session.user.email;
  res.render('user/_userUpload_Find',{email: email});
});

let c = 1;
router.get('/account', (req, res) => {
  let user = req.session.user;
  if (c === 1) {
    user.phone_number = "0"+user.phone_number.substr(3,user.phone_number.length);
    c++;
  }
  res.render('user/_userAccount', {user: user});
});

router.get('/signout', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
  }
  COGNITO.signOut();
  res.redirect('/#login');
});

router.post('/upload', (req, res) => {
  // Schema data file để thêm vào dynamo
  const fileUpload = {
    code: '',
    fileName: '',
    fileSize: 0,
    fileType: '',
    pass: '',
    email: ''
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
      fileUpload.email = file.email;
      // Sau khi schema đã thêm đầy đủ, create object ở dynamodb
      dynamoUser.createFileUser(fileUpload)
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

router.post('/update', (req, res) => {
  COGNITO.updateInfo(req.session.user.email, req)
    .then((result) => {
      res.json("success:"+result);
    })
    .catch((err) => {
      res.json("err:"+err);
    });
});

router.get('/validate', (req, res) => {
  COGNITO.validateCurrentUser()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
});
module.exports = router;
