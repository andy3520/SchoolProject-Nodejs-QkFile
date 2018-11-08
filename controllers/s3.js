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
    console.log(req.body);
    form.parse(req);

    var fileupload = {
        filename: '',
        filesize: '',
        filetype: '',
        filepass: ''
    };

    form.on('file', function (name, file) {
        var params = {
            Bucket: 'mphung97',
            Body: fs.createReadStream(file.path),
            Key: Date.now() + "_" + file.name
        };
        s3.upload(params, function (err, data) {
            //handle error
            if (err)
                console.log("Error", err);
            //success
            if (data) {
                fileupload.filename = data.key,
                fileupload.filesize = file.size,
                fileupload.filetype = file.type

                console.log(fileupload);
            }
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