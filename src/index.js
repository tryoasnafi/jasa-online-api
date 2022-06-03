// make express server
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const routes = require('./routes');
routes(app)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})