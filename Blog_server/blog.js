//express中间件主要设计用于HTTP请求/响应。
const express = require('express');
const history = require('connect-history-api-fallback');
const app = express();

const config = require('./config/default');
const jwt = require('./lib/JWT');

// 使用 history 回退中间件，必须放在 static 之前
app.use(history());

//加入静态文件
app.use(express.static(__dirname+'/data'));

//设置跨域
app.all(/.*/, function(req,res,next){
    //允许访问ip，*为所有
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    //这段为了方便返回JSON
    res.header("Content-Type", "application/json;charset=utf-8");
    if(req.method == 'OPTIONS'){
        //让options请求快速返回
        res.sendStatus(200);
    }else{
        next();
    }
});

//解析前端数据
app.use(express.json());  //request.body

//token处理
//app.use()的内容会在每个HTTP请求到达时执行：
//无论是什么HTTP方法（GET、POST、PUT、DELETE等）；
//无论访问什么路由路径；
//只要有请求到达服务器，这个中间件就会执行。
app.use(async(req,res,next)=>{
    //错误提示是 Cannot read properties of undefined (reading 'token')，
    //所以肯定是 req.body 为 undefined 导致的。
    //因此，我们只需要在访问 req.body.token 之前确保 req.body 不是 undefined 即可。
    //
    //如果有的请求不是 JSON 格式，那么 express.json() 中间件不会解析，那么 req.body 也会是 undefined；
    //如果请求的 Content-Type 不是 application/json，那么 express.json() 也不会解析，所以同样需要检查 req.body 是否存在；
    //某些请求没有请求体（比如 GET 请求）；请求 Content-Type 不正确，导致 express.json() 没有正确解析。
    if(req.body && req.body.token && typeof(req.body.token) != 'undefined'){
        let token = req.body.token;
        let isOk = jwt.verifyToken(token);
        if(isOk == 1){
            next();
        }else{
            //验证未通过
            res.send({
                //code=300表示token验证未通过
                code: 300
            }); //不调用next()继续执行。使用res.send后就不能调用next()了，防止发送信息后重新设置HTTP头导致Node.js错误。
        }
    }
    else{
        next();
    }
})

//引入路由
require('./routes/index')(app);
require('./routes/files')(app);

//监听http连接
app.listen(config.port, ()=>{
    console.log(`Example app is listening on Port ${config.port}`);
});