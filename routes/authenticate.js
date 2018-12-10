const express = require('express');

const router = express.Router();
const COGNITO = require('../controllers/cognito/cognito');

router.post('/login', (req, res) => {
  COGNITO.logIn(req.body.email, req.body.password)
    .then(result => {
      // let token = result.idToken.jwtToken;
      req.session.user = result.idToken.payload;
      req.session.user.phone_number = "0" + req.session.user.phone_number.substr(3, req.session.user.phone_number.length);
      // console.log(JSON.stringify(result.idToken.payload));
      res.redirect('/user');
    }, error => {
      console.log(error);
      if (error.code === "UserNotConfirmedException") {
        res.redirect('/?loginmessage=Vui lòng xác nhận email#login');
      } else if (error.code === "NotAuthorizedException") {
        if (error.message === "User is disabled") {
          res.redirect('/?loginmessage=Tài khoản bạn đã bị khóa vui lòng liên hệ qkfile@gmail.com để được hỗ trợ#login');
        } else {
          res.redirect('/?loginmessage=Sai tài khoản hoặc mật khẩu#login');
        }
      } else {
        res.redirect('/?loginmessage=Tài khoản không tồn tại#login');
      }
    });
});

router.post('/register', (req, res) => {
  COGNITO.registerUser(req.body)
    .then((result) => {
      res.redirect('/?signupmessage=Đăng kí thành công. Vui lòng kiểm tra và xác nhận email#login');
    }, (err) => {
      if (err.code === "UsernameExistsException") {
        res.redirect('/?signuperrormessage=Email này đã được đăng kí#signup');
      } else {
        res.redirect('/?signuperrormessage=Lỗi đăng kí không thành công#signup');
      }
    });
});


router.get('/validate', (req, res) => {
  COGNITO.validateCurrentUser()
    .then((result) => {
      res.json(result);
    }, (err) => {
      res.json(err);
    });
});

router.get('/facebook', (req, res, next) => {
  res.render('loginFacebook');
});

router.get('/forgotPassword/:email', (req, res) => {
  console.log(req);
  COGNITO.forgotPassword(req.params.email)
    .then(result => {
      res.json(result);
    }).catch(err => {
    res.send(`<script>alert('${err}')</script>`)
  })
});

router.post('/forgotPassword/:email', (req, res) => {
  console.log(req);
  COGNITO.confirmPassword(req.params.email, req.body.code, req.body.newPassword)
    .then(result => {
      res.redirect('/');
    })
    .catch(err => {
      res.json(err);
    });
});
router.post('/updatepassword', (req, res) => {
  COGNITO.changePassword(req.body.email, req.body.oldPassword, req.body.newPassword)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = router;
