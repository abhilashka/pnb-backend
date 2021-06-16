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

module.exports = {
  createResult: createResult,
  createError: createError,
  createSuccess: createSuccess,
  generateOTP: generateOTP
}