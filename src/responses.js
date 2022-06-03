const RESPONSE = {
  OK: function (message, res) {
    res.status(200).json({
      message: message,
      error: false,
    })
  },
  OK_WITH_DATA: function (message, values, res) {
    res.status(200).json({
      message: message,
      error: false,
      data: values
    })
  },
  FAILED: function (message, res) {
    res.status(404).json({
      message: message,
      error: true,
    })
  }
}

module.exports = RESPONSE