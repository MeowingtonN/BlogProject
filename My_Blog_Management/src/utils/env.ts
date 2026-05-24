let baseUrl = "";
let baseImgPath = "";

if(process.env.NODE_ENV == "development"){
    //开发环境
    baseUrl = "http://127.0.0.1:3000";
    baseImgPath = "http://localhost:3000/files";
}else{
    //服务器
    baseUrl = "http://182.123.21:3000";
    baseImgPath = "http://182.123.21:3000/files";
}

export{
    baseUrl,
    baseImgPath
}