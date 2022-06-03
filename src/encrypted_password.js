const crypto = require('crypto')

/**
* generates random string of characters i.e salt
* @function
* @param {number} length - Length of the random string.
*/
const generateRandomString = (length) => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length)
}

/**
* hash password with sha512.
* @function
* @param {string} password - List of required fields.
* @param {string} salt - Data to be validated.
*/
const sha512 = (password, salt) => {
  const hash = crypto.createHmac('sha512', salt)
  hash.update(password)
  const value = hash.digest('hex')
  return {
    salt: salt,
    passwordHash: value
  }
}

/**
* hash user password with sha512 and salt from generateRandomString.
* @function
* @param {string} userPass - password to be hashed.
*/
const saltHashPassword = (userPass) => {
  const salt = generateRandomString(16)
  const passwordData = sha512(userPass, salt)
  return `${passwordData.passwordHash}\$${passwordData.salt}`
}

/**
* compare hash password with plain password from user.
* @function
* @param {string} hashSaltPassword - hashed + salt password.
* @param {string} plainPassword - plain user password.
*/
const compareHashPassword = (hashSaltPassword, plainPassword) => {
  const [hashedPassword, salt] = hashSaltPassword.split('$')
  const hash = crypto.createHmac('sha512', salt || "").update(plainPassword).digest('hex')
  return (hash === hashedPassword) ? true : false
}

module.exports = {
  generateRandomString,
  saltHashPassword,
  compareHashPassword
}