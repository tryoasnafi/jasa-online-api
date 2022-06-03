
const UsersController = require('./controller/users')
const ServicesController = require('./controller/services')

const routes = (app) => {
  app.get('/', UsersController.index)
  app.get('/users', UsersController.getAllUsers)
  app.get('/users/:id', UsersController.getUserById)
  app.put('/users/:id', UsersController.update)
  app.delete('/users/:id', UsersController.delete)
  app.post('/login', UsersController.login)
  app.post('/register', UsersController.register)

  app.get('/services', ServicesController.index)
  app.get('/services/:id', ServicesController.show)
  app.post('/services', ServicesController.store)
  app.put('/services', ServicesController.updateAndReplaceImage)
  app.put('/services/:id', ServicesController.update)
  app.delete('/services/:id', ServicesController.destroy)
}

module.exports = routes
