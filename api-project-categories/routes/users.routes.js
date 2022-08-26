const usersRoutes = require('express').Router();
const { validarToken } = require('../middlewares/Auth')
const upload = require('../middlewares/uploadImgUser');
const Users = require('../controllers/users.controller');

usersRoutes.get('/validatoken', validarToken, Users.validaToken)

usersRoutes.get('/all', validarToken, Users.findAll)

usersRoutes.get('/show/:id', validarToken, Users.findOne)

usersRoutes.get('/view-profile/:id', validarToken, Users.viewProfile)

usersRoutes.post('/login', Users.findOne2)

usersRoutes.post('/create', validarToken, Users.create)

usersRoutes.put('/update', validarToken, Users.update)

usersRoutes.put('/user-senha', validarToken, Users.update2)

usersRoutes.put('/edit-profile-imatge', validarToken, upload.single('avatar'),Users.editProfileImage)

usersRoutes.delete('/delete/:id', validarToken, Users.delete)

module.exports = usersRoutes;