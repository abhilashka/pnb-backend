const fs = require('fs');
const AWS = require('aws-sdk');
const path = require('path')

require('dotenv').config()


const s3 = new AWS.S3({
    accessKeyId: "AKIAWKIZICMLW3GRAVRL",
    secretAccessKey: "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"
});




function uploadFile(filename) {
    console.log("uploadFile -> filename", filename)
    const htmlPath = path.join(__dirname, './' + `${filename}`)

    fs.readFile(htmlPath, (err, data) => {
        if (err) throw err;
        const params = {
            Bucket: 'publicnewsboard', // pass your bucket name
            Key: `${filename}`, // file will be saved as testBucket/contacts.csv
            Body: JSON.stringify(data, null, 2)
        };
        s3.upload(params, function (s3Err, data) {
            if (s3Err) throw s3Err
            console.log(`File uploaded successfully at ${data.Location}`)
        });
    });
};

module.exports = {
    uploadFile: uploadFile
}