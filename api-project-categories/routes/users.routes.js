const userRoutes = require('express').Router();
const user = require('../controllers/user.controller');
const { validarToken } = require('../middlewares/Auth');
const upload = require('../middlewares/uploadImgUser');

userRoutes.get("/all",  validarToken, user.findAll);

userRoutes.get("/validarToken", user.validaToken);

userRoutes.get("/show/:id",  validarToken, user.findOne);

userRoutes.post("/create",  user.create);

userRoutes.post("/login", user.login);

userRoutes.put("/update",  validarToken, user.update);

userRoutes.put("/change-password",  validarToken, user.changepassword);

userRoutes.delete("/delete/:id",  validarToken, user.delete);

userRoutes.put("/edit-profile-image",  validarToken, upload.single('avatar'), user.editProfileImage);

userRoutes.get("/view-profile/:id",  validarToken, user.viewProfile);


module.exports = userRoutes;