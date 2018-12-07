const express = require('express');

const router = express.Router();
const COGNITO = require('../controllers/cognito/cognito');


router.get('/facebook', (req, res, next) => {
  res.render('loginFacebook');
});

router.post('/login', (req, res) => {
  COGNITO.logIn(req.body.email, req.body.password)
    .then(result => {
      res.redirect('/user');
    }, error => {
      res.redirect('/#login');
    }); 
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

router.post('/register', (req, res) => {
  COGNITO.registerUser(req.body)
    .then((result) => {
      res.json(result);
    }, (err) => {
      res.json(err);
    });
});
// router.get('/validate', (req, res) => {
//   COGNITO.validateCurrentUser()
//     .then((result) => {
//       res.redirect('/users');
//     }, (err) => {
//       res.redirect('/#login');
//     });
// });

// router.get('/getUsers', (req, res) => {
//   COGNITO.getAll(config.poolData)
//   .then(result => {
//     res.json(result);
//   }, err => {
//     res.json(err); 
//   })
// });

module.exports = router;
