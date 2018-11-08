const express = require('express');
const router = express.Router();
const dynamoGuestFile = require('../controllers/dynamodb/dynamoGuestFile');
const generateCode = require('../controllers/generateCode');

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
  dynamoGuestFile.createFile("X", Date.now() + "Test.jpg", "test", "images/jpg", 1)
    .then((data) => {
      res.send(JSON.stringify(data));
    })
    .catch((err) => {
      res.send(JSON.stringify(err));
    });
});

router.get('/getFile', (req, res) => {
  dynamoGuestFile.getFile("X")
    .then((data) => {
      res.send(JSON.stringify(data.Item));
    })
    .catch((err) => {
      res.send(JSON.stringify(err));
    });
});

router.get('/genCode', (req, res) => {
  generateCode.generate(8)
    .then((code)=>{
      res.send(code);
    });
});
module.exports = router;
