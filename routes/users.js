const express = require('express');
const localStorage = require('node-localstorage');

const router = express.Router();
const COGNITO = require('../controllers/cognito/cognito');

router.get('/', (req, res) => {
  res.render('_userFile');
});

router.get('/upload', (req, res) => {
  res.render('_userUpload');
});

router.get('/account', (req, res) => {
  res.render('_userAccount');
});

router.get('/facebook', (req, res, next) => {
  res.render('views/loginFacebook');
});

router.post('/register', (req, res) => {
  COGNITO.registerUser(req.body)
    .then((result) => {
      res.redirect('/');
    }, (err) => {
      res.send(`<script>alert('${err.message}')</script>`);
    });
});

router.post('/login', (req, res) => {
  COGNITO.logIn(req.body.email, req.body.password)
  .then(result => {
    res.json(result);
  }, error => {
    res.json(error);
  })
});

router.get('/validate', (req, res) => {
  COGNITO.validateCurrentUser()
    .then((result) => {
      res.json(result);
    }, (err) => {
      res.json(err);
    });
//  }
});

// router.get('/getUsers', (req, res) => {
//   COGNITO.getAll(config.poolData)
//   .then(result => {
//     res.json(result);
//   }, err => {
//     res.json(err); 
//   })
// });

router.get('/signout', (req, res) => {
    COGNITO.signOut();
    res.redirect('/');
})

router.get('/forgotPassword/:email', (req, res) => {
  console.log(req);
  COGNITO.forgotPassword(req.params.email)
  .then(result => {
    res.json(result);
  }).catch(err => {
    res.send(err);
  })
})

router.post('/forgotPassword/:email', (req, res) => {
  console.log(req);
  COGNITO.confirmPassword(req.params.email, req.body.code, req.body.newPassword)
  .then(result => {
    res.redirect('/');
  }).catch(err => {
    res.send(err);
  })
})

router.post('/updatepassword', (req, res) => {
  COGNITO.changePassword(req.body.email, req.body.oldPassword, req.body.newPassword)
  .then(result => {
    res.json(result);
  }).catch(err => {
    res.send(err);
  })
})

module.exports = router;
