const multer = require('multer');
const serve = require('../controller/serve');
const mkdir = require('../lib/mkdir');

// 生成随机数
function random(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

// 设置存储配置
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        // 保存文件的目录
        cb(null, '../Blog_server/data/files');    
    },
    filename: function (req, file, cb){
        let name = '';
        const fileName = file.originalname.split('.');
        let type = '.' + fileName[1];
        //正则匹配后缀名
        //let type = file.originalname.replace(/.+\./, ".");
        name = new Date().getTime()+random(1,1000)+type;
        // 保存文件名称，避免文件重名冲突
        cb(null, name);
    }
});

// 创建 multer 实例
const upload = multer({storage : storage});

//路由
module.exports = function(app){
    //文件单张上传
    app.post('/upload', upload.single('file'), (req, res)=>{
        //console.log(req.file);
        let data;
        try{
            //console.log(req.file);
            const reqFileName = req.file.originalname.split('.');
            data = {
                URL:req.file.filename,  //保存的文件名
                fileName:reqFileName[0],//原文件名
                fileFormat: reqFileName[1],//格式
                subsetID: -1,
                Moment: new Date()
            };
            serve.uploadFile(data, res);
        }catch(err){
            mkdir.deleteFiles(data.URL);
            res.send({
                code: 400
            });
        }
    })
}