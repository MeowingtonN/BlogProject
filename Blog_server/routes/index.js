const serve = require('../controller/serve');

module.exports = function (app) {
    //路由示例
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });
    //验证是否有注册管理员
    app.post('/isRegister', (req,res)=>{
        serve.isRegister(req, res);
    });
    //管理员注册
    app.post('/register', (req,res)=>{
        serve.insertManager(req, res);
    });
    //管理员登录
    app.post('/signIn', (req, res)=>{
        serve.signIn(req, res);
    });
    //获取评论
    app.post('/comment', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.getComment(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //将评论转为已读
    app.post('/commentIsRead', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.commentIsRead(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //删除评论
    app.post('/deleteComment', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.deleteComment(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //获取私信
    app.post('/message', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.getMessage(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //获取未读私信数
    app.post('/messageCountNotRead', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.messageCountNotRead(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //删除私信
    app.post('/deleteMessage', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.deleteMessage(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //新建文章/图库
    app.post('/createArticle', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.createArticle(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //获取文章/图库用于修改
    app.post('/gainArticle', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.gainArticle(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //获取文章
    app.post('/article', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.getArticle(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //获取文章作者
    app.post('/articleAuthor', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.getArticleAuthor(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //修改文章发布状态
    app.post('/changeArticleState', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.changeArticleState(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //文章删除
    app.post('/deleteArticle', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.deleteArticle(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //修改文章/图库
    app.post('/updateArticle', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.updateArticle(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //查询文章不同状态下的数目
    app.post('/articleState', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.articleState(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //查询分组
    app.post('/subset', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.subset(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //新建分组
    app.post('/addSubset', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.addSubset(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //修改分组名称
    app.post('/reviseSubset', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.updateSubset(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //删除分组
    app.post('/deleteSubset', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.deleteSubset(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //获取标签
    app.post('/label', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.getLabel(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //新建标签
    app.post('/addLabel', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.addLabel(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //删除标签
    app.post('/deleteLabel', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.deleteLabel(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //获取文件
    app.post('/file', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.getFile(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //删除文件
    app.post('/deleteFile', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.deleteFile(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //使用URL删除文件
    app.post('/deleteFileByURL', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.deleteFileByURL(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //移动文件
    app.post('/moveFile', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.moveFile(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //新建日记
    app.post('/createDiary', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.createDiary(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //获取日记
    app.post('/diary', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.getDiaryPage(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //获取指定ID的日记
    app.post('/gainDiary', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.gainDiary(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //删除日记
    app.post('/deleteDiary', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.deleteDiary(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    //获取数据总览
    app.post('/overview', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.overview(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    });
    // 更新文件所属管理员
    app.post('/updateFileManagerID', (req, res)=>{
        if(typeof(req.body.token) != 'undefined'){
            serve.updateFileManagerID(req, res);
        }else{
            res.send({
                //code=400功能拒绝
                code: 400
            });
        }
    })
}