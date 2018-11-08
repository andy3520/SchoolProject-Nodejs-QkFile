var express = require('express');
var router = express.Router();
let dynamoGuestFile = require('../controllers/dynamodb/dynamoGuestFile');

router.get('/createTable', function (req, res) {
  (async ()=>{
    let data = await dynamoGuestFile.createTable();
    res.end(data);
  })();
});

router.get('/createFile', function (req, res) {
  dynamoGuestFile.createFile("X56E896aadfa", Date.now() + "Test.jpg", "test", "images/jpg", 89654);
});

module.exports = router;
