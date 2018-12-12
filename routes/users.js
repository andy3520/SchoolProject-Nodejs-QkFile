const express = require('express');

const router = express.Router();
const COGNITO = require('../controllers/cognito/cognito');
const dynamoUser = require('../controllers/dynamodb/dynamoUser');
const generateCode = require('../controllers/generateCode');
const s3 = require('../controllers/s3');

let files = [];
router.get('/', (req, res) => {
  let start = 0;
  let end = 10;
  if (req.query.page) {
    let page = Number(req.query.page);
    if (page === 1) {
      let paginate = files.slice(start, end);
      res.render('user/_userFile',{files: files, paginate: paginate, username: req.session.user.email, deleteerror: req.query.deleteerror, deletesuccess: req.query.deletesuccess});
    } else {
      end = end * page;
      start = end - 10; 
      let paginate = files.slice(start, end);
      res.render('user/_userFile',{files: files, paginate: paginate, username: req.session.user.email, deleteerror: req.query.deleteerror, deletesuccess: req.query.deletesuccess});
    }
  } else {
    if (sessionFile === false && req.session.files) {
      files = req.session.files;
      files.sort((a, b) => {
        let fNameA = a.fileName;
        let fNameB = b.fileName;
        let createA = fNameA.substr(0,13);
        let createB = fNameB.substr(0, 13);
        return parseInt(createB) - parseInt(createA);
      });
      let paginate = files.slice(start, end);
      res.render('user/_userFile',{files: files, paginate: paginate, username: req.session.user.email, deleteerror: req.query.deleteerror, deletesuccess: req.query.deletesuccess});
    } else {
      console.log("Load lại");
      sessionFile = false;
      dynamoUser.getFileByEmail(req.session.user.email)
        .then((result) => {
          console.log(result.length);
          files = result;
          files.sort((a, b) => {
            let fNameA = a.fileName;
            let fNameB = b.fileName;
            let createA = fNameA.substr(0,13);
            let createB = fNameB.substr(0, 13);
            return parseInt(createB) - parseInt(createA);
          });
          let paginate = files.slice(start, end);
          req.session.files = result;
          res.render('user/_userFile',{files: files, paginate: paginate, username: req.session.user.email, deleteerror: req.query.deleteerror, deletesuccess: req.query.deletesuccess});
        })
        .catch((err) => {
          res.render('user/_userFile',{error: err})
        });
    }
  }
});

router.get('/uploadandfind', (req, res) => {
  let email = req.session.user.email;
  res.render('user/_userUpload_Find',{email: email, username: req.session.user.email});
});

router.get('/account', (req, res) => {
  let user = req.session.user;
  res.render('user/_userAccount', {user: user, username: req.session.user.email, updatesuccess: req.query.updatesuccess, updatefail: req.query.updatefail});
});

router.get('/signout', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
  }
  req.session.destroy((err) => {
    if (err) 
      console.log(err);
  });
  COGNITO.signOut();
  res.redirect('/#login');
});

let sessionFile = false;
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
  s3.upload(req,50000000 )
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
          sessionFile = true;
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
      res.redirect('/user/account?updatesuccess=Cập nhật thông tin thành công');
    })
    .catch((err) => {
      res.redirect('/user/account?updatefail=Dữ liệu cập nhật không hợp lệ')
    });
});

router.get('/delete', (req, res) => {
  s3.delete(req.query.fileName)
    .then(data => {
      dynamoUser.deleteFile(req.query.code)
        .then(result => {
          sessionFile = true;
          let item = null; 
            req.session.files.forEach((f) => {
            if (f.code === req.query.code)
              return item = f;
          });
          let index = req.session.files.indexOf(item);
          req.session.files.splice(index,1);
          res.redirect('/user?deletesuccess=Xóa thành công'); 
        })
        .catch(err => {
          res.redirect('/user?deleteerror=' + JSON.stringify(err));
        });
    })
    .catch(err => {
      res.redirect('/user?deleteerror='+JSON.stringify(err));
    });
});

router.get('/changepassword', (req, res) => {
  res.render('user/_userChangePass',{username : req.session.user.email, changesuccess: req.query.changesuccess, changefail: req.query.changefail});
});

router.post('/changepassword', (req, res) => {
  COGNITO.changePassword(req.session.user.email, req.body.oldpassword, req.body.password)
    .then(result => {
      res.redirect('/user/changepassword?changesuccess=Đổi mật khẩu thành công');
    })
    .catch(err => {
      res.redirect('/user/changepassword?changefail=Sai mật khẩu hiện tại');
    });
});

router.get('/forgot', (req, res) => {
  COGNITO.forgotPassword(req.body.email)
  .then(result => {
    console.log('Success');
  }).catch(err => {
    console.log(err);
  })
})

router.post('/confirmPassword', (req, res) => {
  COGNITO.confirmPassword(req.body.email, req.body.code, req.body.newPassword)
  .then(result => {
    res.json(result);
  })
  .catch(err => {
    res.json(err);
  })
})
module.exports = router;
