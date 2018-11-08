const AWS = require('aws-sdk');
const formidable = require('formidable');
const fs = require('fs');
const config = require('../config/env');

AWS.config.update({
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

exports.upload = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req);

    form.on('file', function (name, file) {
        var params = {
            Bucket: config.Bucket,
            Body: fs.createReadStream(file.path),
            Key: Date.now() + "_" + file.name
        };

        s3.upload(params, function (err, data) {  
            if (err)
                console.log("Error", err);
            if (data)
                console.log("Uploaded:", data);
        });
    });
}

exports.dowload = function(req, res){
    var params = {
        Bucket: 'mphung97',
        Key: req.params.key
    };

    res.attachment(params.Key);
    s3.getObject(params).createReadStream().pipe(res);
}