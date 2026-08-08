const db = require('./db');

//查询数据库中是否有注册管理员
exports.isRegister = () => {
    let _sql = `select count(*) as count from manager;`;
    return db.query2(_sql);
}

//管理员注册
exports.insertManager = (value) => {
    let _sql = "insert into manager set ?;";
    return db.query2(_sql, value);
}

//管理员登录
exports.signIn = (name, password) => {
    let _sql = `select * from manager where name = "${name}" and Password="${password}";`;
    return db.query2(_sql);
}

//获取评论
exports.getCommentPage = (pageSize, nowPage) => {
    let _sql = `select * from COMMENT order by ID DESC LIMIT ${(nowPage - 1) * pageSize}, ${pageSize};`;
    return db.query2(_sql);
}

//获取评论总数
exports.commentCount = (articleID) => {
    let _sql;
    if (articleID == -1) {
        _sql = `select count(*) as count from COMMENT;`;
    } else {
        _sql = `select count(*) as count from COMMENT where articleID="${articleID}";`;
    }
    return db.query2(_sql);
}

//评论变为已读
exports.commentIsRead = (id) => {
    let _sql = `update COMMENT set isRead=1 where id="${id}";`;
    return db.query2(_sql);
}

//删除评论
exports.deleteComment = (id) => {
    let _sql = `delete from COMMENT where ID="${id}";`;
    return db.query2(_sql);
}

//获取文章名称
exports.getArtitleTitle = (id) => {
    let _sql = `select title from ARTICLE where ID="${id}";`;
    return db.query2(_sql);
}

//获取私信
exports.getMessagePage = (pageSize, nowPage) => {
    let _sql = `select * from MESSAGE order by ID DESC LIMIT ${(nowPage - 1) * pageSize}, ${pageSize};`;
    return db.query2(_sql);
}

//获取私信总数
exports.messageCount = (isRead) => {
    let _sql;
    if (isRead == 0) {
        _sql = `select count(*) as count from MESSAGE where isRead=0;`;
    } else {
        _sql = `select count(*) as count from MESSAGE;`;
    }
    return db.query2(_sql);
}

//删除私信
exports.deleteMessage = (id) => {
    let _sql = `delete from MESSAGE where id="${id}";`;
    return db.query2(_sql);
}

//私信变为已读
exports.messageIsRead = (id) => {
    let _sql = `update MESSAGE set isRead=1 where id="${id}";`;
    return db.query2(_sql);
}

//新建文章/图库
exports.createArticle = (value) => {
    let _sql = "insert into ARTICLE set ?;";
    return db.query2(_sql, value);
}

//获取文章/图库用于修改
exports.gainArticle = (articleID, managerID) => {
    let _sql;
    if (managerID == -1)
        _sql = `select * from ARTICLE where ID="${articleID}";`;
    else
        _sql = `select * from ARTICLE where managerID="${managerID}" and ID="${articleID}";`;
    return db.query2(_sql);
}

//获取文章
exports.getArticlePage = (pageSize, nowPage, state, subsetID, searchTerm, classify, managerID) => {
    let _sql;
    if (managerID == -1) {
        if (searchTerm) {
            _sql = `select * from ARTICLE where state=1 and concat(Title, Introduce) like "%${searchTerm}%" and classify="${classify}" order by ID DESC LIMIT ${(nowPage - 1) * pageSize}, ${pageSize};`;
        } else if (subsetID > -1 && typeof subsetID == 'number') {
            _sql = `select * from ARTICLE where state=1 and subsetID="${subsetID}" and classify="${classify}" order by ID DESC LIMIT ${(nowPage - 1) * pageSize}, ${pageSize};`;
        } else if (typeof subsetID == 'string') {
            if(subsetID != null && subsetID.length > 0)
                _sql = `select * from ARTICLE where state=1 and subsetID not in (${subsetID}) and classify="${classify}" order by ID DESC LIMIT ${(nowPage - 1) * pageSize}, ${pageSize};`;
            else
                _sql = `select * from ARTICLE where state=1 and classify="${classify}" order by ID DESC LIMIT ${(nowPage - 1) * pageSize}, ${pageSize};`;
        } else if (state > -1) {
            _sql = `select * from ARTICLE where state=1 and State="${state}" and classify=0 order by ID DESC LIMIT ${(nowPage - 1) * pageSize}, ${pageSize};`;
        } else {
            _sql = `select * from ARTICLE where state=1 and classify="${classify}" order by ID DESC LIMIT ${(nowPage - 1) * pageSize}, ${pageSize};`;
        }
    } else {
        if (searchTerm) {
            _sql = `select * from ARTICLE where managerID="${managerID}" and concat(Title, Introduce) like "%${searchTerm}%" and classify="${classify}" order by ID DESC LIMIT ${(nowPage - 1) * pageSize}, ${pageSize};`;
        } else if (subsetID > -1 && typeof subsetID == 'number') {
            _sql = `select * from ARTICLE where managerID="${managerID}" and subsetID="${subsetID}" and classify="${classify}" order by ID DESC LIMIT ${(nowPage - 1) * pageSize}, ${pageSize};`;
        } else if (typeof subsetID == 'string') {
            if(subsetID != null && subsetID.length > 0)
                _sql = `select * from ARTICLE where managerID="${managerID}" and subsetID not in (${subsetID}) and classify="${classify}" order by ID DESC LIMIT ${(nowPage - 1) * pageSize}, ${pageSize};`;
            else
                _sql = `select * from ARTICLE where managerID="${managerID}" and classify="${classify}" order by ID DESC LIMIT ${(nowPage - 1) * pageSize}, ${pageSize};`;
        } else if (state > -1) {
            _sql = `select * from ARTICLE where managerID="${managerID}" and State="${state}" and classify=0 order by ID DESC LIMIT ${(nowPage - 1) * pageSize}, ${pageSize};`;
        } else {
            _sql = `select * from ARTICLE where managerID="${managerID}" and classify="${classify}" order by ID DESC LIMIT ${(nowPage - 1) * pageSize}, ${pageSize};`;
        }
    }

    return db.query2(_sql);
}

//获取文章总数
exports.articleCount = (state, subsetID, searchTerm, classify, managerID) => {
    let _sql;
    if (managerID == -1) {
        if (searchTerm) {
            _sql = `select count(*) as count from ARTICLE where state=1 and concat(Title, Introduce) like "%${searchTerm}%" and classify="${classify}";`;
        } else if (subsetID > -1 && typeof subsetID == 'number') {
            _sql = `select count(*) as count from ARTICLE where state=1 and subsetID="${subsetID}" and classify="${classify}";`;
        } else if (typeof subsetID == 'string') {
            if(subsetID != null && subsetID.length > 0)
                _sql = `select count(*) as count from ARTICLE where state=1 and subsetID not in (${subsetID}) and classify="${classify}";`;
            else
                _sql = `select count(*) as count from ARTICLE where state=1 and classify="${classify}";`;
        } else if (state > -1) {
            _sql = `select count(*) as count from ARTICLE where state=1 and State="${state}" and classify=0;`;
        } else {
            _sql = `select count(*) as count from ARTICLE where state=1 and classify="${classify}";`;
        }
    } else {
        if (searchTerm) {
            _sql = `select count(*) as count from ARTICLE where managerID="${managerID}" and concat(Title, Introduce) like "%${searchTerm}%" and classify="${classify}";`;
        } else if (subsetID > -1 && typeof subsetID == 'number') {
            _sql = `select count(*) as count from ARTICLE where managerID="${managerID}" and subsetID="${subsetID}" and classify="${classify}";`;
        } else if (typeof subsetID == 'string') {
            if(subsetID != null && subsetID.length > 0)
                _sql = `select count(*) as count from ARTICLE where managerID="${managerID}" and subsetID not in (${subsetID}) and classify="${classify}";`;
            else
                _sql = `select count(*) as count from ARTICLE where managerID="${managerID}" and classify="${classify}";`;
        } else if (state > -1) {
            _sql = `select count(*) as count from ARTICLE where managerID="${managerID}" and State="${state}" and classify=0;`;
        } else {
            _sql = `select count(*) as count from ARTICLE where managerID="${managerID}" and classify="${classify}";`;
        }
    }

    return db.query2(_sql);
}

//获取文章作者
exports.getArticleAuthor = (articleIDArrayString)=>{
    if(articleIDArrayString == null || articleIDArrayString.length <= 0) return;

    let _sql = `select article.id,name from manager,article where manager.ID=article.managerID and article.id in (${articleIDArrayString});`;

    return db.query2(_sql);
}

//改变文章发布状态
exports.changeArticleState = (id, state) => {
    let _sql = `update ARTICLE set State="${state}" where ID="${id}";`;
    return db.query2(_sql);
}

//文章删除
exports.deleteArticle = (id) => {
    let _sql = `delete from ARTICLE where id="${id}";`;
    return db.query2(_sql);
}

//修改文章/图库
exports.updateArticle = (articleID, value) => {
    let _sql = `update ARTICLE set ? where ID="${articleID}";`;
    return db.query2(_sql, value);
}

//新建文章点赞
exports.addPraise = (value) => {
    let _sql = `insert into PRAISE set ?;`;
    return db.query2(_sql, value);
}

//获取文章点赞数/判断文章是否点赞
exports.praiseCount = (articleID, userID) => {
    let _sql;
    if (userID == -1) {
        _sql = `select count(*) as count from PRAISE where articleID="${articleID}";`;
    } else {
        _sql = `select count(*) as count from PRAISE where articleID="${articleID}" and userID="${userID}";`;
    }
    return db.query2(_sql);
}

//新建分组
exports.addSubset = (value) => {
    let _sql = "insert into SUBSET set ?;";
    return db.query2(_sql, value);
}

//获取分组
exports.getSubset = (classify, managerID) => {
    let _sql;
    if (managerID == -1)
        _sql = `select * from SUBSET where classify="${classify}";`;
    else
        _sql = `select * from SUBSET where managerID="${managerID}" and classify="${classify}";`;
    return db.query2(_sql);
}

//修改分组名称
exports.updateSubset = (id, name) => {
    let _sql = `update SUBSET set subsetName="${name}" where ID="${id}";`;
    return db.query2(_sql);
}

//删除分组
exports.deleteSubset = (id) => {
    let _sql = `delete from SUBSET where id=${id};`;
    return db.query2(_sql);
}

//查询标签
exports.getLabel = (managerID) => {
    let _sql;
    if (managerID == -1)
        _sql = `select * from LABEL order by ID DESC;`;
    else
        _sql = `select * from LABEL where managerID="${managerID}" order by ID DESC;`;
    return db.query2(_sql);
}

//新建标签
exports.addLabel = (value) => {
    let _sql = 'insert into LABEL set ?;';
    return db.query2(_sql, value);
}

//删除标签
exports.deleteLabel = (id) => {
    let sql = `delete from LABEL where ID="${id}";`;
    return db.query2(sql);
}

//获取文件总数
exports.fileCount = (subsetID, managerID) => {
    let _sql;
    if (managerID == -1) {
        if (subsetID > -1 && typeof subsetID == 'number') {
            _sql = `select count(*) as count from FILE where subsetID="${subsetID}";`;
        } else if (typeof subsetID == 'string') {
            if(subsetID != null && subsetID.length > 0)
                _sql = `select count(*) as count from FILE where subsetID not in (${subsetID});`;
            else
                _sql = `select count(*) as count from FILE;`;
        } else {
            _sql = `select count(*) as count from FILE;`;
        }
    } else {
        if (subsetID > -1 && typeof subsetID == 'number') {
            _sql = `select count(*) as count from FILE where managerID="${managerID}" and subsetID="${subsetID}";`;
        } else if (typeof subsetID == 'string') {
            if(subsetID != null && subsetID.length > 0)
                _sql = `select count(*) as count from FILE where managerID="${managerID}" and subsetID not in (${subsetID});`;
            else
                _sql = `select count(*) as count from FILE where managerID="${managerID}";`;
        } else {
            _sql = `select count(*) as count from FILE where managerID="${managerID}";`;
        }
    }

    return db.query2(_sql);
}

//获取文件
exports.getFilePage = (pageSize, nowPage, subsetID, managerID) => {
    let _sql;
    if (managerID == -1) {
        if (subsetID > -1 && typeof subsetID == 'number') {
            _sql = `select * from FILE where subsetID="${subsetID}" order by ID desc limit ${(nowPage - 1) * pageSize}, ${pageSize};`;
        } else if (typeof subsetID == 'string') {
            if(subsetID != null && subsetID.length > 0)
                _sql = `select * from FILE where subsetID not in (${subsetID}) order by ID desc limit ${(nowPage - 1) * pageSize}, ${pageSize};`;
            else
                _sql = `select * from FILE where order by ID desc limit ${(nowPage - 1) * pageSize}, ${pageSize};`;
        } else {
            _sql = `select * from FILE order by ID desc limit ${(nowPage - 1) * pageSize}, ${pageSize};`;
        }
    } else {
        if (subsetID > -1 && typeof subsetID == 'number') {
            _sql = `select * from FILE where managerID="${managerID}" and subsetID="${subsetID}" order by ID desc limit ${(nowPage - 1) * pageSize}, ${pageSize};`;
        } else if (typeof subsetID == 'string') {
            if(subsetID != null && subsetID.length > 0)
                _sql = `select * from FILE where managerID="${managerID}" and subsetID not in (${subsetID}) order by ID desc limit ${(nowPage - 1) * pageSize}, ${pageSize};`;
            else
                _sql = `select * from FILE where managerID="${managerID}" order by ID desc limit ${(nowPage - 1) * pageSize}, ${pageSize};`;
        } else {
            _sql = `select * from FILE where managerID="${managerID}" order by ID desc limit ${(nowPage - 1) * pageSize}, ${pageSize};`;
        }
    }

    return db.query2(_sql);
}

//移动文件
exports.moveFile = (fileID, subsetID) => {
    let _sql = `update FILE set subsetID="${subsetID}" where ID in (${fileID});`;
    return db.query2(_sql);
}

//新建日记
exports.createDiary = (value) => {
    let _sql = `insert into DIARY set ?;`;
    return db.query2(_sql, value);
}

//获取日记
exports.getDiaryPage = (pageSize, nowPage, searchTerm, managerID) => {
    let _sql;
    if (managerID == -1) {
        if (searchTerm) {
            _sql = `select * from DIARY where concat(Title, Content) like "%${searchTerm}%" order by ID DESC LIMIT ${(nowPage - 1) * pageSize}, ${pageSize};`;
        } else {
            _sql = `select * from DIARY order by ID DESC LIMIT ${(nowPage - 1) * pageSize}, ${pageSize};`;
        }
    } else {
        if (searchTerm) {
            _sql = `select * from DIARY where managerID="${managerID}" and concat(Title, Content) like "%${searchTerm}%" order by ID DESC LIMIT ${(nowPage - 1) * pageSize}, ${pageSize};`;
        } else {
            _sql = `select * from DIARY where managerID="${managerID}" order by ID DESC LIMIT ${(nowPage - 1) * pageSize}, ${pageSize};`;
        }
    }

    return db.query2(_sql);
}

//查询日记数
exports.diaryCount = (searchTerm, managerID) => {
    let _sql;
    if (managerID == -1) {
        if (searchTerm) {
            _sql = `select count(*) as count from DIARY where concat(Title, Content) like "%${searchTerm}%";`;
        } else {
            _sql = `select count(*) as count from DIARY;`;
        }
    } else {
        if (searchTerm) {
            _sql = `select count(*) as count from DIARY where managerID="${managerID}" and concat(Title, Content) like "%${searchTerm}%";`;
        } else {
            _sql = `select count(*) as count from DIARY where managerID="${managerID}";`;
        }
    }

    return db.query2(_sql);
}

//日记删除
exports.deleteDiary = (diaryID) => {
    let _sql = `delete from DIARY where ID="${diaryID}";`;
    return db.query2(_sql);
}

//新建文件
exports.uploadFile = (value) => {
    let _sql = "insert into FILE set ?;";
    return db.query2(_sql, value);
}

//删除文件
exports.deleteFile = (filesID) => {
    let _sql;
    if (typeof filesID == 'number') {
        _sql = `delete from FILE where ID="${filesID}";`;
    } else {
        //批量删除文件
        _sql = `delete from FILE where ID in (${filesID});`;
    }
    return db.query2(_sql);
}

//使用URL删除文件
exports.deleteFileByURL = (filesURL) => {
    if(filesURL == null || filesURL.length <= 0) return;

    let _sql;
    
    //批量删除文件
    _sql = `delete from FILE where URL in (${filesURL});`;
    
    return db.query2(_sql);
}

//更新文件所属管理员
exports.updateFileManagerID = (fileID, managerID) => {
    let _sql = `update FILE set managerID="${managerID}" where ID="${fileID}";`;
    return db.query2(_sql);
}

// let aaa = ()=>{
//     let time = new Date();
//     let _sql = `insert into COMMENT(userID,userName,articleID,Moment,Content) VALUES('zuozhe','作者留言', -1, '${time}', '登录功能测试中，私信功能未开放。');`;
//     db.query2(_sql);
// }
// aaa();