const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY


function createResult(error, data) {
  return error ? createError(error) : createSuccess(data)
}

function createSuccess(data) {
  const result = {}
  result['status'] = 'success'
  result['data'] = data

  return result
}

function createError(error) {
  const result = {}
  result['status'] = 'error'
  result['error'] = error

  return result
}

function generateOTP() {
  const min = 10000
  const max = 99999
  return Math.floor(Math.random() * (max - min) + min)
}


const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

// uploads a file to s3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path)

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename
  }

  return s3.upload(uploadParams).promise()
}


// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }

  return s3.getObject(downloadParams).createReadStream()
}

module.exports = {
  createResult: createResult,
  createError: createError,
  createSuccess: createSuccess,
  generateOTP: generateOTP,
  uploadFile: uploadFile,
  getFileStream: getFileStream
}