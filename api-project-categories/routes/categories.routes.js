const categoriesRoutes = require('express').Router();
const Categories = require('../controllers/categories.controller');
const { validarToken } = require('../middlewares/Auth')

categoriesRoutes.get('/all', validarToken ,Categories.findAll)

categoriesRoutes.get('/show/:id', validarToken ,Categories.findOne)

categoriesRoutes.post('/create', validarToken ,Categories.create)

categoriesRoutes.put('/update', validarToken ,Categories.update)

categoriesRoutes.delete('/delete/:id', validarToken ,Categories.delete)

module.exports = categoriesRoutes;