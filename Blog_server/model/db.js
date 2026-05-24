const mysql = require("mysql");
const rootConfig = require('../config/default');

//数据库连接
const connection = mysql.createConnection({
    host: rootConfig.database.HOST,
    user: rootConfig.database.USER,
    password: rootConfig.database.PASSWORD
});

//直接连接
let query = (sql, values)=>{
    return new Promise((resolve, reject)=>{
        connection.query(sql, values, (err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
};

//连接指定数据库
const pool = mysql.createPool({
    connectionLimit: 10,
    host: rootConfig.database.HOST,
    user: rootConfig.database.USER,
    password: rootConfig.database.PASSWORD,
    database: rootConfig.database.DB
})

//通过pool.getConnection获得连接
let query2 = (sql, values) => {
    return new Promise((resolve,reject)=>{
        pool.getConnection((err,connection)=>{
            if(err){
                reject(err);
            }else{
                connection.query(sql,values,(err,result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                    //释放该连接到池中供其它需求使用
                    connection.release();
                })
            }
        });
    });
};

//数据库创建SQL语句
let blog_project = 'CREATE DATABASE IF NOT EXISTS Blog_Project default charset utf8mb4 collate utf8mb4_unicode_ci;';

//创建数据库
let createDatabase = (db)=>{
    return query(db, []);
}

//数据表
//管理员
let manager = 
    `CREATE TABLE IF NOT EXISTS manager(
    ID INT NOT NULL AUTO_INCREMENT,
    NAME VARCHAR(100) NOT NULL COMMENT '用户名',
    Password VARCHAR(100) NOT NULL COMMENT '密码',
    Moment VARCHAR(100) NOT NULL COMMENT '创建时间',
    PRIMARY KEY(ID)
    );`

//分类
let subset = 
    `CREATE TABLE IF NOT EXISTS SUBSET(
    ID INT NOT NULL AUTO_INCREMENT,
    subsetName VARCHAR(100) NOT NULL COMMENT '分类名称',
    Classify INT NOT NULL COMMENT '类型0文章,1图片,2资源',
    Moment VARCHAR(100) NOT NULL COMMENT '创建时间',
    PRIMARY KEY(ID)
    );`

//本地文件
let file = 
    `CREATE TABLE IF NOT EXISTS FILE(
    ID INT NOT NULL AUTO_INCREMENT,
    URL VARCHAR(300) NOT NULL COMMENT '文件地址',
    fileName VARCHAR(100) NOT NULL COMMENT '文件名称',
    fileFormat VARCHAR(32) NOT NULL COMMENT '文件格式',
    subsetID INT NOT NULL COMMENT '所属分类',
    Moment VARCHAR(100) NOT NULL COMMENT '创建时间',
    PRIMARY KEY(ID)
    );`

//文章/图库
let article = 
    `CREATE TABLE IF NOT EXISTS ARTICLE(
    ID INT NOT NULL AUTO_INCREMENT,
    Title VARCHAR(200) NOT NULL COMMENT '标题',
    subsetID INT COMMENT '所属分类',
    Classify INT NOT NULL COMMENT '类型0文章,1图片',
    Label VARCHAR(200) COMMENT '标签',
    Introduce VARCHAR(1000) COMMENT '简介',
    coverURL VARCHAR(300) COMMENT '封面地址',
    Content VARCHAR(10000) COMMENT '内容',
    Views INT DEFAULT 0 COMMENT '查看次数',
    State INT DEFAULT 0 COMMENT '文章状态',
    Moment VARCHAR(100) NOT NULL COMMENT '创建时间',
    PRIMARY KEY(ID)
    );`

//文章点赞
let praise = 
    `CREATE TABLE IF NOT EXISTS PRAISE(
    ID INT NOT NULL AUTO_INCREMENT,
    userID VARCHAR(100) NOT NULL COMMENT '点赞用户ID',
    userType INT NOT NULL COMMENT '点赞者类型0登录用户,1游客',
    articleID INT NOT NULL COMMENT '所属文章ID',
    MOMENT VARCHAR(100) NOT NULL COMMENT '点赞时间',
    PRIMARY KEY(ID)
    );`

//文章评论
let comment = 
    `CREATE TABLE IF NOT EXISTS COMMENT(
    ID INT NOT NULL AUTO_INCREMENT,
    userID VARCHAR(100) NOT NULL COMMENT '评论者ID',
    userName VARCHAR(100) COMMENT '评论者名称',
    articleID INT NOT NULL COMMENT '所属文章ID',
    Moment VARCHAR(100) NOT NULL COMMENT '评论时间',
    Content VARCHAR(1000) NOT NULL COMMENT '评论内容',
    Complaint INT DEFAULT 0 COMMENT '举报次数',
    isRead INT DEFAULT 0 COMMENT '是否已读0未读,1已读',
    PRIMARY KEY(ID)
    );`

//标签
let label = 
    `CREATE TABLE IF NOT EXISTS LABEL(
    ID INT NOT NULL AUTO_INCREMENT,
    labelName VARCHAR(100) NOT NULL COMMENT '标签名称',
    Moment VARCHAR(100) NOT NULL COMMENT '创建时间',
    PRIMARY KEY(ID)  
    );`

//日记
let diary = 
    `CREATE TABLE IF NOT EXISTS DIARY(
    ID INT NOT NULL AUTO_INCREMENT,
    Title VARCHAR(200) NOT NULL COMMENT '标题',
    Content VARCHAR(5000) NOT NULL COMMENT '内容',
    Picture VARCHAR(300) COMMENT '图片地址',
    weatherID INT COMMENT '天气',
    Moment VARCHAR(100) NOT NULL COMMENT '创建时间',
    PRIMARY KEY(ID)
    );`

//天气
let weather = 
    `CREATE TABLE IF NOT EXISTS WEATHER(
    ID INT NOT NULL AUTO_INCREMENT,
    weatherName VARCHAR(32) NOT NULL COMMENT '名称',
    ICON VARCHAR(100) COMMENT '天气图标地址',
    PRIMARY KEY(ID)
    );`

//私信
let message = 
    `CREATE TABLE IF NOT EXISTS MESSAGE(
    ID INT NOT NULL AUTO_INCREMENT,
    userID VARCHAR(100) NOT NULL COMMENT '评论者ID',
    userName VARCHAR(100) COMMENT '评论者名称',
    Moment VARCHAR(100) NOT NULL COMMENT '发送时间',
    Content VARCHAR(1000) NOT NULL COMMENT '内容',
    isRead INT DEFAULT 0 COMMENT '是否已读0未读,1已读',
    PRIMARY KEY(ID)
    );`

//埋点
let record = 
    `CREATE TABLE IF NOT EXISTS RECORD(
    ID INT NOT NULL AUTO_INCREMENT,
    userID VARCHAR(100) NOT NULL COMMENT '用户',
    userType INT NOT NULL COMMENT '评论者类型0登录用户,1游客',
    Position VARCHAR(100) COMMENT '位置',
    isRead INT DEFAULT 0 COMMENT '是否已读0未读,1已读',
    Moment VARCHAR(100) NOT NULL COMMENT '时间',
    PRIMARY KEY(ID)
    );`

// //创建数据表
// const createTable = (sql)=>{
//     return query2(sql, []);
// }

// //先创建数据库再创建数据表
// async function create(){
//     await createDatabase(blog_project);
//     createTable(manager);
//     createTable(subset);
//     createTable(file);
//     createTable(article);
//     createTable(praise);
//     createTable(comment);
//     createTable(label);
//     createTable(diary);
//     createTable(weather);
//     createTable(message);
//     createTable(record);
// }

// //开启连接数据库
// connection.connect();

// create();

exports.query2 = query2;