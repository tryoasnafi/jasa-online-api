const MAX_FILE_SIZE = 1 * 1024 * 1024 // 1MB
const multer = require('multer')
const fs = require('fs')
const helpers = require('../helpers')
const RESPONSE = require('../responses')
const db = require('../database')

const services = {
  'index': (req, res) => {
    const query = 'SELECT jasa.id, users.nama as nama_penyedia, users.nomor_hp, jasa.nama_jasa, jasa.deskripsi_singkat, jasa.uraian_deskripsi, jasa.rating, jasa.gambar FROM jasa, users WHERE users.id = jasa.user_id ORDER BY jasa.id DESC'
    db.query(query, (err, result) => {
      if (err) {
        return RESPONSE.FAILED(err.message, res)
      } else {
        return RESPONSE.OK_WITH_DATA('Sukses manampilkan semua data jasa', result, res)
      }
    })
  },
  'show': (req, res) => {
    const user_id = req.params.id
    if (!user_id) {
      return RESPONSE.FAILED('No user id provided', res)
    }
    const query = 'SELECT jasa.id, users.nama as nama_penyedia, users.nomor_hp, jasa.nama_jasa, jasa.deskripsi_singkat, jasa.uraian_deskripsi, jasa.rating, jasa.gambar FROM jasa, users WHERE users.id = jasa.user_id AND users.id = ? ORDER BY jasa.id DESC'

    db.query(query, [user_id], (err, result) => {
      if (err) {
        return RESPONSE.FAILED(err.message, res)
      }
      if (result.length > 0) {
        return RESPONSE.OK_WITH_DATA('Sukses menampilkan semua data jasa pengguna', result, res)
      }
      return RESPONSE.FAILED('Data jasa pengguna tidak ditemukan', res)
    })

  },
  'store': (req, res) => {
    let upload = multer({
      storage: helpers.storage,
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: helpers.fileFilter
    }).single('file')

    upload(req, res, (err) => {
      if (req.fileValidationError) {
        return RESPONSE.FAILED(req.fileValidationError, res)
      } else if (!req.file) {
        return RESPONSE.FAILED('Please select an image to upload or choose image under 1MB', res)
      } else if (err instanceof multer.MulterError) {
        return RESPONSE.FAILED(err.message, res)
      } else if (err) {
        return RESPONSE.FAILED('Error upload image', res)
      }

      const { user_id, nama_jasa, deskripsi_singkat, uraian_deskripsi, rating } = req.body
      let gambar = req.body.gambar

      if (!nama_jasa || !deskripsi_singkat || !uraian_deskripsi || !rating || !gambar) {
        return RESPONSE.FAILED('Please fill all field', res)
      }

      gambar = req.file.filename
      const query = 'INSERT INTO jasa (user_id, nama_jasa, deskripsi_singkat, uraian_deskripsi, rating, gambar) VALUES (?, ?, ?, ?, ?, ?)'
      const values = [user_id, nama_jasa, deskripsi_singkat, uraian_deskripsi, rating, gambar]

      db.query(query, values, (err, result) => {
        if (err) {
          fs.unlink(`./public/images/${gambar}`, (err) => {
            if (err) throw err;
          })
          return RESPONSE.FAILED(err.message, res)
        } else {
          return RESPONSE.OK("Berhasil menambahkan jasa", res)
        }
      })


    })
  },
  'update': async (req, res) => {
    const id = req.params.id
    if (!id) {
      return RESPONSE.FAILED('No id provided', res)
    }
    const { nama_jasa, deskripsi_singkat, uraian_deskripsi } = req.body
    if (!nama_jasa || !deskripsi_singkat || !uraian_deskripsi) {
      return RESPONSE.FAILED('Please fill all field', res)
    }
    db.query('SELECT * FROM jasa WHERE id = ?', [id], (err, result) => {
      if (result.length > 0) {
        const query = 'UPDATE jasa SET nama_jasa = ?, deskripsi_singkat = ?, uraian_deskripsi = ? WHERE id = ?'
        const values = [nama_jasa, deskripsi_singkat, uraian_deskripsi, id]

        db.query(query, values, (err, result) => {
          if (err) {
            return RESPONSE.FAILED(err.message, res)
          }

          return RESPONSE.OK("Berhasil mengubah data jasa", res)
        })
      } else {
        return RESPONSE.FAILED('Service not found', res)
      }
    })
  },
  'updateAndReplaceImage': (req, res) => {
    let upload = multer({
      storage: helpers.storage,
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: helpers.fileFilter
    }).single('file')

    upload(req, res, (err) => {
      if (req.fileValidationError) {
        return RESPONSE.FAILED(req.fileValidationError, res)
      } else if (!req.file) {
        return RESPONSE.FAILED('Please select an image to upload or choose image under 1MB', res)
      } else if (err instanceof multer.MulterError) {
        return RESPONSE.FAILED(err.message, res)
      } else if (err) {
        return RESPONSE.FAILED('Error upload image', res)
      }

      const { id, nama_jasa, deskripsi_singkat, uraian_deskripsi } = req.body
      let { gambar } = req.body
      if (!id || !nama_jasa || !deskripsi_singkat || !uraian_deskripsi || !gambar) {
        return RESPONSE.FAILED('Please fill all field', res)
      }

      gambar = req.file.filename

      db.query('SELECT * FROM jasa WHERE id = ?', [id], (err, result) => {
        if (result.length > 0) {
          const query = 'UPDATE jasa SET nama_jasa = ?, deskripsi_singkat = ?, uraian_deskripsi = ?, gambar = ? WHERE id = ?'
          const values = [nama_jasa, deskripsi_singkat, uraian_deskripsi, gambar, id]

          db.query(query, values, (err, result) => {
            if (err) {
              fs.unlink(`./public/images/${gambar}`, (err) => {
                if (err) throw err;
              })
              return RESPONSE.FAILED(err.message, res)
            }

            return RESPONSE.OK("Berhasil mengubah data jasa", res)
          })
        } else {
          return RESPONSE.FAILED('Service not found', res)
        }
      })
    })
  },
  'destroy': (req, res) => {
    const id = req.params.id
    if (!id) {
      return RESPONSE.FAILED('No id provided', res)
    }

    db.query('SELECT * FROM jasa WHERE id = ?', [id], (err, result) => {
      if (result.length > 0) {
        const filename = result[0].gambar
        const query = 'DELETE FROM jasa WHERE id = ?'
        const values = [id]

        db.query(query, values, (err, result) => {
          if (err) {
            return RESPONSE.FAILED(err.message, res)
          } else {
            fs.unlink(`./public/images/${filename}`, (err) => {
              if (err) throw err;
            })
            return RESPONSE.OK("Berhasil menghapus data jasa", res)
          }
        })
      } else {
        return RESPONSE.FAILED('Data jasa tidak ditemukan', res)
      }
    })
  }
}

module.exports = services
