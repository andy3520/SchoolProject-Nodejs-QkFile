const randomstring = require('randomstring');
const dynamoGuestFile = require('./dynamodb/dynamoGuestFile');

exports.generate = function generateCode(length) {
  return new Promise((resolve, reject) => {
    const tempCode = randomstring.generate(length);
    dynamoGuestFile.getFile(tempCode)
      .then((data) => {
        if (JSON.stringify(data) === JSON.stringify({}) || data === undefined) {
          resolve(tempCode);
        } else {
          generateCode(length);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
