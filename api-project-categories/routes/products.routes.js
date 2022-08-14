const productsRoutes = require('express').Router();
const Products = require('../controllers/products.controller');

productsRoutes.get('/all', Products.findAll)

productsRoutes.get('/show/:id', Products.findOne)

productsRoutes.post('/create', Products.create)

productsRoutes.put('/update', Products.update)

productsRoutes.delete('/delete/:id', Products.delete)

module.exports = productsRoutes;