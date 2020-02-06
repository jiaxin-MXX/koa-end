const multer = require('@koa/multer')
const path = require('path')
//上传文件存放路径、及文件命名
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'public/lunbo')
    },
    filename: function (req, file, cb) {
        const name = file.originalname;
        // 设置文件的后缀名，
        //我这里取的是上传文件的originalname属性的后四位，
        // 即： .png，.jpg等，这样就需要上传文件的后缀名为3位
        const extension = name.substring(name.length - 4);
        cb(null, 'img-' + Date.now() + extension);
    }
})

const upload = multer({storage})
module.exports=upload
