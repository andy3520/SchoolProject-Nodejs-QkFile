const randomstring = require('randomstring');
const dynamoGuestFile = require('./dynamodb/dynamoGuestFile');

// Tạo mã ngẫu nhiên
exports.generate = function generateCode(length) {
  return new Promise((resolve, reject) => {
    // Gọi func tạo mã
    const tempCode = randomstring.generate(length);
    // Tìm mã trong database để check trùng
    dynamoGuestFile.getFile(tempCode)
      .then((data) => {
        // Nếu như không tìm thấy => không trùng mã => trả mã về
        if (JSON.stringify(data) === JSON.stringify({}) || data === undefined) {
          resolve(tempCode);
        } else {
          // Trùng mã gọi lại đệ quy để tạo mã mới
          generateCode(length);
        }
      })
      .catch((err) => {
        // Xảy ra lỗi hệ thống
        // console.log(`generateCode.js error ${err}`);
        reject(err);
      });
  });
};
