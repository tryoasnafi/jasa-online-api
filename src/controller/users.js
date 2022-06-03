const RESPONSE = require('../responses')
const db = require('../database')
const encrypt = require('../encrypted_password')

const users = {
  'index': (req, res) => {
    RESPONSE.OK('Hello, pesan ini dari sisi server NodeJS RESTful API!', res)
  },
  'getAllUsers': (req, res) => {
    db.query('SELECT * FROM users', (err, result) => {
      return (err) ? RESPONSE.ERROR(err, res) : RESPONSE.OK_WITH_DATA('All users', result, res)
    })
  },
  'getUserById': (req, res) => {
    const id = req.params.id
    if (!id) {
      return RESPONSE.FAILED('No id provided', res)
    }
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
      return (err) ? RESPONSE.ERROR(err, res) : (result.length > 0) ? RESPONSE.OK_WITH_DATA('User', result[0], res) : RESPONSE.FAILED('User not found', res)
    })
  },
  'login': async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      return RESPONSE.FAILED('No email or password provided', res)
    }

    await db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
      return (err)
        ? RESPONSE.ERROR(err, res)
        : (result.length > 0)
          ? (encrypt.compareHashPassword(result[0].password, password))
            ? RESPONSE.OK_WITH_DATA('User', result[0], res)
            : RESPONSE.FAILED('Wrong password', res)
          : RESPONSE.FAILED('User not found', res)
    })
  },
  'register': async (req, res) => {
    const { nama, tanggal_lahir, jenis_kelamin, nomor_hp, alamat, email, password } = req.body

    if (!nama || !tanggal_lahir || !jenis_kelamin || !nomor_hp || !alamat || !email || !password) {
      return RESPONSE.FAILED('Kehilangan beberapa parameter yang dibutuhkan', res)
    }

    await db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
      if (result.length > 0) {
        return RESPONSE.FAILED('Email sudah terdaftar', res)
      }

      const hashedPassword = encrypt.saltHashPassword(password)

      const query = 'INSERT INTO users (nama, tanggal_lahir, jenis_kelamin, nomor_hp, alamat, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)'
      const values = [nama, tanggal_lahir, jenis_kelamin, nomor_hp, alamat, email, hashedPassword]
      db.query(query, values, (err, result) => {
        return (err) ? RESPONSE.ERROR(err, res) : RESPONSE.OK('User successfully register', res)
      })
    })
  },
  'update': async (req, res) => {
    const { id, nama, tanggal_lahir, jenis_kelamin, nomor_hp, alamat, email, password } = req.body
    if (!id, !nama || !tanggal_lahir || !jenis_kelamin || !nomor_hp || !alamat || !email || !password) {
      return RESPONSE.FAILED('Kehilangan beberapa parameter yang dibutuhkan', res)
    }

    let query
    let values
    if (password == "") {
      query = 'UPDATE users SET nama = ?, tanggal_lahir = ?, jenis_kelamin = ?, nomor_hp = ?, alamat = ?, email = ? WHERE id = ?'
      values = [nama, tanggal_lahir, jenis_kelamin, nomor_hp, alamat, email, id]
    } else {
      query = 'UPDATE users SET nama = ?, tanggal_lahir = ?, jenis_kelamin = ?, nomor_hp = ?, alamat = ?, email = ?, password = ? WHERE id = ?'
      values = [nama, tanggal_lahir, jenis_kelamin, nomor_hp, alamat, email, encrypt.saltHashPassword(password), id]
    }

    await db.query('SELECT * FROM users WHERE email = ? and id <> ?', [email, id], (err, result) => {
      if (result.length > 0) {
        return RESPONSE.FAILED('Email sudah terdaftar', res)
      }

      db.query(query, values, (err, result) => {
        return (err) ? RESPONSE.ERROR(err, res) : RESPONSE.OK('User successfully updated', res)
      })
    })
  },
  'delete': async (req, res) => {
    const id = req.params.id
    if (!id) {
      return RESPONSE.FAILED('No id provided', res)
    }

    await db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
      if (result.affectedRows == 0) {
        return RESPONSE.FAILED('User Id not found', res)
      }

      return (err) ? RESPONSE.ERROR(err, res) : RESPONSE.OK('User successfully deleted', res)
    })
  },
}

module.exports = users
