const multer= require('multer');

module.exports = ( multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/upload/users')
          },
          filename: function (req, file, cb) {
            cb(null, Date.now().toString() + '_' +file.originalname);
          }
    }),
    fileFilter: function (req, file, cb) {
        const extensionImg = ['image/png', 'image/jpeg', 'image/jpg']
        .find(formatoAceito => formatoAceito == file.mimetype)
        if( extensionImg ){
            return cb(null, true)
        }
        return cb(null, false);
    }
}))