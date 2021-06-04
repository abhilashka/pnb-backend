
function function1() {
  const uuid = require('uuid')

  // const token1 = uuid.v1()
  // const token3 = uuid.v3()
  const token4 = uuid.v4()
  // const token5 = uuid.v5()

  // console.log(`token 1 = ${token1}`)
  // console.log(`token 3 = ${token3}`)
  console.log(`token 4 = ${token4}`)
  // console.log(`token 5 = ${token5}`)
}


function function2() {
  let str = "Hello user"
  console.log(str)
  str = str.replace('user', "steve jobs")
  console.log(str)
}

// function2()

function function3() {
  const otp = Math.floor(randomNumber(10000, 99999))
  console.log(otp)
}

function3()