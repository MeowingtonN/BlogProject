const dbModel = require('../model/db_model');
const jwt = require('../lib/JWT');
const mkdir = require('../lib/mkdir');

//是否注册
exports.isRegister = async (req, res) => {
    //查询数据库中是否有注册管理员
    await dbModel.isRegister().then((result) => {
        //完成异步操作后执行的回调函数部分
        let code = 401;
        if (result[0].count > 0) {
            //已注册
            code = 200;
        }
        res.send({
            code: code,
        });
    })
}

//管理员注册
exports.insertManager = async (req, res) => {
    let data = req.body;

    //管理员注册
    await dbModel.insertManager(data).then(() => {
        res.send({
            code: 200,
        });
    })
}

//管理员登录
exports.signIn = async (req, res) => {
    let data = req.body;
    //管理员登录
    await dbModel.signIn(data.name, data.password).then((result) => {
        //result内容的key和数据表中表项的名称一致（注意：大小写区分！！！）
        if (result.length > 0 && data.password == result[0].Password) {
            let token = jwt.generateToken(data.name);
            let message = {
                id: result[0].ID,
                name: data.name,
                token: token
            };
            res.send({
                code: 200,
                data: message
            });
        } else {
            res.send({
                code: 400
            });
        }
    });
}

//获取评论
exports.getComment = async (req, res) => {
    let data = req.body;
    let count = -1;
    //获取评论
    await dbModel.getCommentPage(data.pageSize, data.nowPage).then(async (result) => {
        if (data.count) {
            let c = await dbModel.commentCount(-1);
            count = c[0].count;
        }
        if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                //将评论变为已读
                //await dbModel.commentIsRead(result[i].ID);
                //获取对应的文章（articleID为COMMENT数据表的一个表项）
                let getArticleTitle = await dbModel.getArtitleTitle(result[i].articleID);
                if (getArticleTitle.length > 0) {
                    result[i].article = {
                        id: result[i].articleID,
                        title: getArticleTitle[0].title
                    }
                } else {
                    result[i].article = {
                        id: -1
                    }
                }
            }
        }
        res.send({
            code: 200,
            data: {
                count,
                result
            }
        })
    });
}

//将评论变为已读
exports.commentIsRead = async (req, res) => {
    let data = req.body;
    await dbModel.commentIsRead(data.id).then(() => {
        res.send({
            code: 200
        });
    })
}

//删除评论
exports.deleteComment = async (req, res) => {
    if (req.body.token != "" && jwt.verifyToken(req.body.token) == 1) {
        let data = req.body;
        await dbModel.deleteComment(data.id).then(() => {
            res.send({
                code: 200
            });
        });
    } else {
        res.send({ code: 300 });
    }
}

//获取私信
exports.getMessage = async (req, res) => {
    let data = req.body;
    let count = -1;
    //获取私信
    await dbModel.getMessagePage(data.pageSize, data.nowPage).then(async (result) => {
        if (data.count) {
            let c = await dbModel.messageCount(1);
            count = c[0].count;
        }
        if (result.length > 0) {
            //在获取私信后就将私信变为已读
            for (let i = 0; i < result.length; i++) {
                await dbModel.messageIsRead(result[i].ID);
            }
        }
        res.send({
            code: 200,
            data: {
                count,
                result
            }
        });
    });
}

//获取未读私信数
exports.messageCountNotRead = async (req, res) => {
    await dbModel.messageCount(0).then(async (result) => {
        res.send({
            code: 200,
            data: result[0].count
        });
    });
}

//删除私信
exports.deleteMessage = async (req, res) => {
    if (req.body.token != "" && jwt.verifyToken(req.body.token) == 1) {
        let data = req.body;
        await dbModel.deleteMessage(data.id).then(() => {
            res.send({
                code: 200
            });
        });
    } else {
        res.send({ code: 300 });
    }
}

//新建文章/图库
exports.createArticle = async (req, res) => {
    if (req.body.token != "" && jwt.verifyToken(req.body.token) == 1) {
        let data = req.body.value;
        if (data.Label) {
            data.Label = data.Label.join(',');
        }
        //console.log(data);
        //新建文章/图库
        await dbModel.createArticle(data).then(async (result) => {
            res.send({
                code: 200,
                data: result.insertId
            });
        });
    } else {
        res.send({ code: 300 });
    }
}

//获取文章/图库
exports.gainArticle = async (req, res) => {
    let data = req.body;
    //获取文章/图库
    await dbModel.gainArticle(data.articleID, data.managerID).then(async (result) => {
        res.send({
            code: 200,
            data: result[0]
        });
    });
}

//获取文章
exports.getArticle = async (req, res) => {
    let data = req.body;
    let count = -1;
    //console.log(data);
    //获取文章
    await dbModel.getArticlePage(data.pageSize, data.nowPage, data.state, data.subsetID, data.searchTerm, data.classify, data.managerID).then(async (result) => {
        if (data.count) {
            let c = await dbModel.articleCount(data.state, data.subsetID, data.searchTerm, data.classify, data.managerID);
            count = c[0].count;
        }
        if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                let praise = await dbModel.praiseCount(result[i].id, -1);
                let comment = await dbModel.commentCount(result[i].id);
                result[i].praise = praise[0].count;
                result[i].comment = comment[0].count;
                if (result[i].label) {
                    result[i], label = result[i].label.split(",");
                }
            }
        }
        res.send({
            code: 200,
            data: {
                count,
                result
            }
        })
    });
}

// 获取文章作者
exports.getArticleAuthor = async (req, res)=>{
    await dbModel.getArticleAuthor(req.body.articleIDArrayString).then(async (result)=>{
        res.send({
            code: 200,
            data: result
        });
    });
}

//修改文章发布状态
exports.changeArticleState = async (req, res) => {
    if (req.body.token != "" && jwt.verifyToken(req.body.token) == 1) {
        let data = req.body;
        //修改文章发布状态
        await dbModel.changeArticleState(data.articleID, data.state).then(() => {
            res.send({
                code: 200,
            });
        });
    } else {
        res.send({ code: 300 });
    }
}

//文章删除
exports.deleteArticle = async (req, res) => {
    if (req.body.token != "" && jwt.verifyToken(req.body.token) == 1) {
        let data = req.body;
        //文章删除
        await dbModel.deleteArticle(data.articleID).then(() => {
            res.send({
                code: 200,
            });
        });
    } else {
        res.send({ code: 300 });
    }
}

//修改文章/图库
exports.updateArticle = async (req, res) => {
    if (req.body.token != "" && jwt.verifyToken(req.body.token) == 1) {
        let data = req.body;
        if (data.value.Label) {
            data.value.Label = data.value.Label.join(',');
        }
        //修改文章/图库
        await dbModel.updateArticle(data.articleID, data.value).then(() => {
            res.send({
                code: 200
            });
        });
    } else {
        res.send({ code: 300 });
    }

}

//查询文章不同状态下的数目
exports.articleState = async (req, res) => {
    //查询文章不同状态下的数目
    let unpublish = await dbModel.articleCount(0, -1, "", 0, req.body.managerID);
    let publish = await dbModel.articleCount(1, -1, "", 0, req.body.managerID);
    let message = [
        {
            id: 0,
            name: '未发布',
            value: unpublish[0].count
        },
        {
            id: 1,
            name: '已发布',
            value: publish[0].count
        }
    ];
    res.send({
        code: 200,
        data: message
    });
}

//获取分组
exports.subset = async (req, res) => {
    let data = req.body;
    //获取分组
    await dbModel.getSubset(data.classify, data.managerID).then(async (result) => {
        if (data.classify == 0 || data.classify == 1) {
            let count = await dbModel.articleCount(-1, -1, "", data.classify, data.managerID);
            let list = [];
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    let value = await dbModel.articleCount(-1, result[i].ID, "", data.classify, data.managerID);
                    list[i] = {
                        id: result[i].ID,
                        value: value[0].count,
                        subsetName: result[i].subsetName,
                        moment: result[i].Moment
                    }
                }
            }
            res.send({
                code: 200,
                data: {
                    count: count[0].count,
                    list
                }
            });
        } else if (data.classify == 2) {   //文件
            let count = await dbModel.fileCount(-1, data.managerID);
            let list = [];
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    let value = await dbModel.fileCount(result[i].ID, data.managerID);
                    list[i] = {
                        id: result[i].ID,
                        value: value[0].count,
                        subsetName: result[i].subsetName,
                        moment: result[i].Moment
                    }
                }
            }
            res.send({
                code: 200,
                data: {
                    count: count[0].count,
                    list
                }
            });
        }
    });
}

//新建分组
exports.addSubset = async (req, res) => {
    if (req.body.token != "" && jwt.verifyToken(req.body.token) == 1) {
        let data = req.body;
        //新建分组
        await dbModel.addSubset(data.value).then(async (result) => {
            res.send({
                code: 200,
                data: result.insertId
            });
        });
    } else {
        res.send({ code: 300 });
    }
}

//修改分组名称
exports.updateSubset = async (req, res) => {
    if (req.body.token != "" && jwt.verifyToken(req.body.token) == 1) {
        let data = req.body;
        //修改分组名称
        await dbModel.updateSubset(data.subsetID, data.subsetName).then(() => {
            res.send({
                code: 200
            });
        });
    } else {
        res.send({ code: 300 });
    }
}

//删除分组
exports.deleteSubset = async (req, res) => {
    if (req.body.token != "" && jwt.verifyToken(req.body.token) == 1) {
        let data = req.body;
        //删除分组
        await dbModel.deleteSubset(data.subsetID).then(() => {
            res.send({
                code: 200
            });
        });
    } else {
        res.send({ code: 300 });
    }
}

//获取标签
exports.getLabel = async (req, res) => {
    //获取标签
    await dbModel.getLabel(req.body.managerID).then(async (result) => {
        res.send({
            code: 200,
            data: result
        });
    });
}

//新建标签
exports.addLabel = async (req, res) => {
    if (req.body.token != "" && jwt.verifyToken(req.body.token) == 1) {
        let data = req.body;
        //新建标签
        await dbModel.addLabel(data.value).then(async (result) => {
            res.send({
                code: 200,
                data: result.insertId
            });
        });
    } else {
        res.send({ code: 300 });
    }
}

//删除标签
exports.deleteLabel = async (req, res) => {
    if (req.body.token != "" && jwt.verifyToken(req.body.token) == 1) {
        let data = req.body;
        //删除标签
        await dbModel.deleteLabel(data.labelID).then(() => {
            res.send({
                code: 200
            });
        });
    } else {
        res.send({ code: 300 });
    }
}

//获取文件
exports.getFile = async (req, res) => {
    let data = req.body;
    let count = -1;
    //获取文件
    await dbModel.getFilePage(data.pageSize, data.nowPage, data.subsetID, data.managerID).then(async (result) => {
        if (data.count) {
            let c = await dbModel.fileCount(data.subsetID, data.managerID);
            count = c[0].count;
        }
        res.send({
            code: 200,
            data: {
                count,
                result
            }
        });
    })
}

//移动文件
exports.moveFile = async (req, res) => {
    if (req.body.token != "" && jwt.verifyToken(req.body.token) == 1) {
        let data = req.body;
        //移动文件
        await dbModel.moveFile(data.fileID, data.subsetID).then(() => {
            res.send({
                code: 200
            });
        });
    } else {
        res.send({ code: 300 });
    }
}

//新建日记
exports.createDiary = async (req, res) => {
    if (req.body.token != "" && jwt.verifyToken(req.body.token) == 1) {
        let data = req.body;
        await dbModel.createDiary(data.value).then(async (result) => {
            res.send({
                code: 200,
                id: result.insertId
            });
        });
    } else {
        res.send({ code: 300 });
    }
}

//获取日记
exports.getDiaryPage = async (req, res) => {
    let data = req.body;
    let count = -1;
    //获取日记
    await dbModel.getDiaryPage(data.pageSize, data.nowPage, data.searchTerm, data.managerID).then(async (result) => {
        if (data.count) {
            let c = await dbModel.diaryCount(data.searchTerm, data.managerID);
            count = c[0].count;
        }
        if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                if (result[i].picture) {
                    result[i].picture = result[i].picture.split(",");
                }
            }
        }
        res.send({
            code: 200,
            data: {
                count,
                result
            }
        });
    });
}

//获取指定ID的日记
exports.gainDiary = async (req, res) => {
    let data = req.body;
    //获取文章/图库
    await dbModel.gainDiary(data.diaryID, data.managerID).then(async (result) => {
        res.send({
            code: 200,
            data: result[0]
        });
    });
}

//日记删除
exports.deleteDiary = async (req, res) => {
    if (req.body.token != "" && jwt.verifyToken(req.body.token) == 1) {
        let data = req.body;
        //日记删除
        await dbModel.deleteDiary(data.diaryID).then(() => {
            res.send({
                code: 200
            });
        });
    } else {
        res.send({ code: 300 });
    }
}

//新建文件
exports.uploadFile = async (data, res) => {
    await dbModel.uploadFile(data).then(async (result) => {
        let value = {
            ...data,
            ...{ id: result.insertId }
        };
        res.send({
            code: 200,
            data: value
        });
    });
}

//删除文件
exports.deleteFile = async (req, res) => {
    if (req.body.token != "" && jwt.verifyToken(req.body.token) == 1) {
        let data = req.body;
        await dbModel.deleteFile(data.filesID).then(async () => {
            //处理真实文件删除
            mkdir.deleteFiles(data.filesURL);
            res.send({
                code: 200
            });
        });
    } else {
        res.send({ code: 300 });
    }
}

//使用URL删除文件
exports.deleteFileByURL = async (req, res) => {
    if (req.body.token != "" && jwt.verifyToken(req.body.token) == 1) {
        let data = req.body;
        await dbModel.deleteFileByURL(data.filesURL).then(async () => {
            let filesURL = data.filesURL;
            // filesURL是一个数组
            //console.log(filesURL);
            if (typeof filesURL === 'string' && filesURL.startsWith("'") && filesURL.endsWith("'")) {
                filesURL = filesURL.slice(1, -1);
            }else if (Array.isArray(filesURL)) {
                filesURL = filesURL.map(url => {
                    if (typeof url === 'string' && url.startsWith("'") && url.endsWith("'")) {
                        return url.slice(1, -1);
                    }
                    return url;
                });
            }
            //处理真实文件删除
            mkdir.deleteFiles(filesURL);
            res.send({
                code: 200
            });
        });
    } else {
        res.send({ code: 300 });
    }
}

//获取数据总览
exports.overview = async (req, res) => {
    let article = await dbModel.articleCount(-1, -1, "", 0, req.body.managerID);
    let gallery = await dbModel.articleCount(-1, -1, "", 1, req.body.managerID);
    let diary = await dbModel.diaryCount("", req.body.managerID);
    let files = await mkdir.getDirSize('data/files');

    let filesSize = 0;
    if (files < 1024 * 1024) {
        filesSize = Math.round(files / 1024 * 100) / 100 + " KB";
    } else {
        filesSize = Math.round(files / 1024 / 1024 * 100) / 100 + " MB";
    }
    let data = {
        article: article[0].count,
        gallery: gallery[0].count,
        diary: diary[0].count,
        files: filesSize
    };

    res.send({
        code: 200,
        data: data
    });
}

//更新文件所属管理员
exports.updateFileManagerID = async (req, res) => {
    if (req.body.token != "" && jwt.verifyToken(req.body.token) == 1) {
        let data = req.body;
        //修改分组名称
        await dbModel.updateFileManagerID(data.fileID, data.managerID).then(() => {
            res.send({
                code: 200
            });
        });
    } else {
        res.send({ code: 300 });
    }
}